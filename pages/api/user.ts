import { getLoginSession } from '../../lib/auth'
import { PrivyClient } from '@privy-io/privy-node';
const privyNode = new PrivyClient(process.env.PRIVY_API_KEY, process.env.PRIVY_API_SECRET);


export default async function user(req, res) {
  const session = await getLoginSession(req)
  // After getting the session you may want to fetch for the user instead
  // of sending the session's payload directly, this example doesn't have a DB
  // so it won't matter in this case
  // const token = await privyNode.createAccessToken(req.user.id);

  res.status(200).json({ user: session || null });

}
