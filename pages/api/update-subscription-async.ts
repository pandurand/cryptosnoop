import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from "ethers";
import { privyNode } from '../../lib/privy';
import { FieldInstance } from '@privy-io/privy-node';
import { setIntervalAsync } from 'set-interval-async/dynamic'
import { clearIntervalAsync } from 'set-interval-async'
// import async from 'async';

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
let snoopToInfo: { [key: string]: SnoopInfo } = {}


const updateSnoopToInfo = async () => {
    let newInfo: { [key: string]: SnoopInfo } = {}

    const data: GetBatchResponse = await privyNode.getBatch(SNOOP_FIELDS, { limit: 100000000000000 });
    console.log('users', data.users);
    //clear out emails for update 
    data.users.map(({ user_id, data }) => {
        data.map((fieldInstance: FieldInstance | null) => {
            if (!fieldInstance || !fieldInstance.text()) return;
            const { name, address } = JSON.parse(fieldInstance.text());
            if (!(address in newInfo)) {
                newInfo[address] = { receivers: [], balance: null, lastTx: null }
            }
            newInfo[address].receivers.push({ email: user_id, nickname: name })
        })
    })
    //clean up any deleted addresses 
    snoopToInfo = newInfo;
}

let timer;

function check([address, info], callback) {
    const { receivers, balance: lastBalance, lastTx } = info;
    console.log(address, receivers);
    provider.getBalance(address).then(balance => {
        const eth = ethers.utils.formatEther(balance)
        snoopToInfo[address].balance = eth;

        if (!lastBalance || eth == lastBalance) {
            //hasn't changed balance.
            return false;
        }
        //it's actually changed 
        return true;

    }).then((triggerSend) => {
        if (!triggerSend) return;
        Promise.all(receivers.map(async ({ email, nickname }) => {
            console.log('sending to', email)
            return privyNode.sendEmail(email, `Cryptosnoops: New Ethereum Activity From ${nickname}`,
                `https://etherscan.io/address/${address}
                <br/>`)
        })).then(callback());
    })
}


function init() {
    timer = true;
    setIntervalAsync(
        () => {
            // async.map(Object.entries(snoopToInfo), check)
        },
        5000
    )
}

if (!timer) {
    init();
}


//signals that it's time to check privy's database again to update email subscriptions
export default async function handler(req: NextApiRequest, res: NextApiResponse) {



    await updateSnoopToInfo();
    // if (timer) {
    //     await clearIntervalAsync(timer)
    // }

    // console.log(timer);


    res.status(200).json(timer);
}