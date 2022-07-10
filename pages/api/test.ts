import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from "ethers";
import { privyNode } from '../../lib/privy';
import { FieldInstance } from '@privy-io/privy-node';

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
    balance: null | string,
    lastTx: null | string
}

let timer = null;
let snoopToInfo: { [key: string]: SnoopInfo } = {}

const updateSnoopToInfo = async () => {
    let snoopToInfo: { [key: string]: SnoopInfo } = {}

    const data: GetBatchResponse = await privyNode.getBatch(SNOOP_FIELDS, { limit: 100000000000000 });
    //clear out emails for update 
    data.users.map(({ user_id, data }) => {
        data.map((fieldInstance: FieldInstance | null) => {
            //0 means deletion. 
            if (!fieldInstance || !fieldInstance.text()) return;
            const { name, address } = JSON.parse(fieldInstance.text());
            if (!(address in snoopToInfo)) {
                snoopToInfo[address] = { receivers: [], balance: null, lastTx: null }
            }
            snoopToInfo[address].receivers.push({ email: user_id, nickname: name })
        })
    })
    //clean up any deleted addresses 
    console.log('after update', snoopToInfo);
}


const init = () => {
    return setInterval(() => {
        return Promise.all(Object.entries(snoopToInfo).map(async function ([address, info]) {
            console.log('snoop', address, info)
            const { receivers, balance: lastBalance, lastTx } = info;
            const balance = await provider.getBalance(address)
            const eth = ethers.utils.formatEther(balance)
            if (!lastBalance || eth === lastBalance) {
                snoopToInfo[address].balance = eth;
                //hasn't changed balance.
                return;
            }
            //it's actually changed 
            const blockStart = await provider.getBlockNumber() - 1;
            const history: Array<ethers.providers.TransactionResponse> = await etherscanProvider.getHistory(address, blockStart);
            let txHash = null;
            if (history.length > 0) {
                const thisTxHash = history[history.length - 1].hash
                if (thisTxHash !== lastTx) {
                    //avoid notifying about repeat transactions
                    txHash = thisTxHash;
                    snoopToInfo[address].lastTx = txHash;
                }
            }
            console.log('txhash', txHash);
            snoopToInfo[address].balance = eth;

            await Promise.all(receivers.map(async ({ email, nickname }) => {
                console.log('sending to', email)
                return privyNode.sendEmail(email, `Cryptosnoops: New Ethereum Activity From ${nickname}`,
                    `https://etherscan.io/address/${address}
                    <br/>
                    ${txHash && `https://etherscan.io/tx/${txHash}`}`)
            }))

        }));
    }, 11000)[Symbol.toPrimitive]()

};

//signals that it's time to check privy's database again to update email subscriptions
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const oldTimer = timer;
    if (!timer) {
        timer = init();
    }
    res.status(200).json({ oldTimer, timer })
    return;
}