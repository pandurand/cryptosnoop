import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from "ethers";
import { FieldInstance, PrivyClient } from '@privy-io/privy-node';
const Redis = require("ioredis");

let balances = new Redis(process.env.REDIS_URL);

balances.on("error", function (err) {
    throw err;
});



var provider = new ethers.providers.WebSocketProvider(process.env.INFURA_WS_URL);
const etherscanProvider = new ethers.providers.EtherscanProvider('homestead', process.env.ETHERSCAN_KEY)

const MAX_NUM_SNOOPS = 3;
const SNOOP_FIELDS = Array.apply(null, Array(MAX_NUM_SNOOPS)).map((_, i) => `snoop-${i}`)

type GetBatchResponse = {
    next_cursor_id: string,
    users: Array<{ user_id: string, data: Array<any> }>
}
type SendingInfo = {
    email: string,
    nickname: string,
}
type SnoopInfo = {
    receivers: Array<SendingInfo>,
}

const getSnoopToInfo = async (privyNode): Promise<{ [key: string]: SnoopInfo }> => {
    let newInfo: { [key: string]: SnoopInfo } = {}

    const data: GetBatchResponse = await privyNode.getBatch(SNOOP_FIELDS, { limit: 100000000000000 });
    //clear out emails for update 
    data.users.map(({ user_id, data }) => {
        data.map((fieldInstance: FieldInstance | null) => {
            if (!fieldInstance || !fieldInstance.text()) return;
            const { name, address } = JSON.parse(fieldInstance.text());
            if (!(address in newInfo)) {
                newInfo[address] = { receivers: [] }
            }
            newInfo[address].receivers.push({ email: user_id, nickname: name })
        })
    })

    return newInfo
}



const check = async function (snoopToInfo: { [key: string]: SnoopInfo }, privyNode) {
    await Promise.all(Object.entries(snoopToInfo).map(async ([address, info]) => {
        const { receivers } = info;
        console.log(address, receivers);
        const balance = await provider.getBalance(address)
        const eth = ethers.utils.formatEther(balance)
        const hasFetchedBefore = await balances.exists(address);
        console.log(hasFetchedBefore, hasFetchedBefore && await balances.get(address), eth)

        if (!hasFetchedBefore || eth == (await balances.get(address))) {
            //hasn't changed balance.
            await balances.set(address, eth)
            return;
        }
        await balances.set(address, eth)
        //it's actually changed 
        await Promise.all(receivers.map(async ({ email, nickname }) => {
            console.log('sending to', email)
            try {
                await privyNode.sendEmail(email,
                    `Cryptosnoops: New Ethereum Activity From ${nickname}`,
                    `${nickname}'s account balance just changed! See their account here: https://etherscan.io/address/${address}
                        <br/>
                        Current balance: ${eth}
                        <br/>
                        You are receiving this email because you subscribed to address activity notifications on Privy's demo, Cryptosnoops.
                        You may unsubscribe at any point by logging into <a href="https://demos.privy.io">Cryptosnoops</a> and deleting the subscription. `
                )
            } catch (e) {
                console.log(e);
            }
        }));

    }))

}

//signals that it's time to check privy's database again to update email subscriptions
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const privy = new PrivyClient(process.env.PRIVY_API_KEY, process.env.PRIVY_API_SECRET)
    const snoopToInfo = await getSnoopToInfo(privy);
    await check(snoopToInfo, privy);

    res.status(200).json({ listening: true, updated: true });
}