import { BigNumber } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next'
import Decimal from 'decimal.js'
import { ethers } from "ethers";
import { privyNode } from '../../lib/privy';

// const INFURA_WS_URL = ["wss://mainnet.infura.io/ws/v3/329ee66d232148b0ab0e02cfffc87d0f", 'wss://mainnet.infura.io/ws/v3/8835cfa306cd45a68f89744d591f6da8', 'wss://mainnet.infura.io/ws/v3/fbf1316184da4a49b64a96584cc29b29'];
// let providerIndex = 1;
// var customWsProvider = new ethers.providers.WebSocketProvider(INFURA_WS_URL[providerIndex]);
// const WEI = 1000000000000000000

// // const ethToWei = (amount: BigNumber) => new Decimal(Number(amount)).times(WEI)

// type TransactionResponse = {
//   'hash': string,
//   'type': number,
//   'accessList': [],
//   'blockHash': null,
//   'blockNumber': null,
//   'transactionIndex': null,
//   'confirmations': number,
//   'from': string,
//   'gasPrice': BigNumber,
//   'maxPriorityFeePerGas': BigNumber,
//   'maxFeePerGas': BigNumber,
//   'gasLimit': BigNumber,
//   'to': string,
//   'value': BigNumber,
//   'nonce': number,
//   'data': '0x',
//   'r': string,
//   's': string,
//   'v': number,
//   'creates': null,
//   'chainId': number,
//   'wait': Function
// }

// let snoopToEmail = { 0xcbd6832ebc203e49e2b771897067fce3c58575ac: ['kailiwang2018@gmail.com'] }

// const sendEmailIfSubscribed = async (tx: TransactionResponse) => {
//   const from = tx.from.toLowerCase();
//   console.log(from);
//   const to = tx.to?.toLowerCase();
//   if (!to || !from) {
//     return;
//   }
//   if (from in snoopToEmail || to in snoopToEmail) {
//     console.log('snoop detected')
//     return Promise.all(snoopToEmail[tx.from].map((userId) => (async () => {
//       console.log('sending email');
//       return Promise.resolve(privyNode.sendEmail(userId, `Cryptosnoops: New Activity From ${tx.from}`, `https://etherscan.io/tx/${tx.hash}`))
//     })()))
//   }
// }

// var init = function () {
//   setTimeout(() => {

//   }, 5000)

//   const provider = customWsProvider.on("pending", async (tx) => {
//     let transaction: TransactionResponse;
//     try {
//       transaction = await customWsProvider.getTransaction(tx)

//     } catch (e) {
//       console.log(e.message);
//       if (e.message.includes('request rate limited')) {
//         console.log('rate error');
//         providerIndex = (providerIndex + 1) % INFURA_WS_URL.length
//         // customWsProvider.off('pending');
//         customWsProvider = new ethers.providers.WebSocketProvider(INFURA_WS_URL[providerIndex]);
//         init();

//         // throw { missedTx: tx, msg: 'rate limit' };

//       }

//     }
//     if (!transaction) return;

//     // console.log(Number(transaction.value) / WEI);
//     await sendEmailIfSubscribed(transaction);

//   });



//   customWsProvider._websocket.on("error", async (ep) => {
//     console.log(`Unable to connect to ${ep.subdomain} retrying in 3s...`);
//     setTimeout(init, 3000);
//   });
//   customWsProvider._websocket.on("close", async (code) => {
//     console.log(
//       `Connection lost with code ${code}! Attempting reconnect in 3s...`
//     );
//     customWsProvider._websocket.terminate();
//     setTimeout(init, 3000);
//   });
// };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // if (customWsProvider.listenerCount() == 0) {
  //   try {
  //     init();

  //   } catch (e) {
  //     console.log(e.msg, e.missedTx);
  //     // providerIndex += 1;

  //   }
  // }
  // // const t = await customWsProvider.getTransaction('0xc9d9bcc470777e057f85c4e95b38eec013c150c121fcd1bfab84a925ffcf62d0');
  // // console.log(t);
  // if (!req.body) {
  //   res.status(400).json({ error: 'Must supply user email (userId) in request body.' })
  //   return;
  // }
  // const email = JSON.parse(req.body)


  res.status(200).json(req);
}