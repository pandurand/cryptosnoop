import { PrivyClient } from '@privy-io/privy-node';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getLoginSession } from '../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ token: string }>) {
    const privyNode = new PrivyClient(process.env.PRIVY_API_KEY, process.env.PRIVY_API_SECRET);

    //throws error or returns false if user is not authenticated via Magic
    const session = await getLoginSession(req)

    if (!session) {
        res.status(400).json({ token: 'No auth cookie found' })
        return;
    }
    const emailAddress = session.email;
    try {
        await privyNode.get(emailAddress, 'email');
    } catch {
        await privyNode.put(emailAddress, 'email', emailAddress);
    }
    const token = await privyNode.createAccessToken(emailAddress);
    res.status(200).json({ token });
}