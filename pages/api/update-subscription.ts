import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from "ethers";
import { privyNode } from '../../lib/privy';
import { FieldInstance } from '@privy-io/privy-node';
import { setIntervalAsync } from 'set-interval-async/dynamic'
import async from 'async'

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
    let newInfo: { [key: string]: SnoopInfo } = {}

    const data: GetBatchResponse = await privyNode.getBatch(SNOOP_FIELDS, { limit: 100000000000000 });
    //clear out emails for update 
    data.users.map(({ user_id, data }) => {
        data.map((fieldInstance: FieldInstance | null) => {
            if (!fieldInstance || !fieldInstance.text()) return;
            const { name, address } = JSON.parse(fieldInstance.text());
            if (!(address in newInfo)) {
                newInfo[address] = { receivers: [], balance: snoopToInfo[address]?.balance, lastTx: snoopToInfo[address]?.lastTx, }
            }
            newInfo[address].receivers.push({ email: user_id, nickname: name })
        })
    })

    //clean up any deleted addresses 
    snoopToInfo = newInfo;
}



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
            async.map(Object.entries(snoopToInfo), check)
        },
        5000
    )
}

if (!timer) {
    init();
}





// const init = () => {
//     return setInterval(async () => {
//         await Promise.all(Object.entries(snoopToInfo).map(async function ([address, info]) {
//             console.log('snoop', address, info)
//             const { receivers, balance: lastBalance, lastTx } = info;
//             const balance = await provider.getBalance(address)
//             const eth = ethers.utils.formatEther(balance)
//             if (!lastBalance || eth === lastBalance) {
//                 snoopToInfo[address].balance = eth;
//                 //hasn't changed balance.
//                 return;
//             }
//             //it's actually changed 
//             const blockStart = await provider.getBlockNumber() - 1;
//             const history: Array<ethers.providers.TransactionResponse> = await etherscanProvider.getHistory(address, blockStart);
//             let txHash = null;
//             if (history.length > 0) {
//                 const thisTxHash = history[history.length - 1].hash
//                 if (thisTxHash !== lastTx) {
//                     //avoid notifying about repeat transactions
//                     txHash = thisTxHash;
//                     snoopToInfo[address].lastTx = txHash;
//                 }
//             }
//             console.log('txhash', txHash);
//             snoopToInfo[address].balance = eth;

//             await Promise.all(receivers.map(async ({ email, nickname }) => {
//                 console.log('sending to', email)
//                 await privyNode.sendEmail(email,
//                     `Cryptosnoops: New Ethereum Activity From ${nickname}`,
//                     `${nickname}'s account balance just changed! See their account here: https://etherscan.io/address/${address}
//                     <br/>
//                      ${txHash && `Most recent transaction: https://etherscan.io/tx/${txHash}`}
//                     <br/>
//                     You are receiving this email because you subscribed to address activity notifications on Privy's demo, Cryptosnoops.
//                     You may unsubscribe at any point by logging into <a href="https://demos.privy.io">Cryptosnoops</a> and deleting the subscription. `)
//             }))

//         }));
//     }, 11000)[Symbol.toPrimitive]()

// };

//signals that it's time to check privy's database again to update email subscriptions
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.query.startlistener && timer) {
        res.status(200).json({ listening: true })
        return;
    }
    await updateSnoopToInfo();


    res.status(200).json({ listening: true, updated: true });
}