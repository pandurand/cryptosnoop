import { PrivyClient, CustomSession } from "@privy-io/privy-browser";

export const MAX_NUM_SNOOPS = 3;

export const FIELD_NAME_PREFIX = 'snoop-';

// class Privy {
//     privy: PrivyClient
//     email: null | string
//     constructor() {
//         this.email = null
//         this.privy = new PrivyClient({
//             session: new CustomSession(async function authenticate() {
//                 //go fetch access token
//                 try {
//                     const response = await fetch(`${process.env.BASE_PATH}/api/privy/token`)
//                     return (await response.json()).token
//                 } catch {
//                     return null;
//                 }

//             })
//         });
//     }

//     authenticate() {

//     }
// }