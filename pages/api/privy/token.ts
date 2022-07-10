import { privyNode } from '../../../lib/privy';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getLoginSession } from '../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ token: string }>) {

    const session = await getLoginSession(req)
    const emailAddress = JSON.parse(req.body).toLowerCase()
    try {
        const privyEmail = await privyNode.get(emailAddress, 'email');
    } catch {
        await privyNode.put(emailAddress, 'email', emailAddress);
    }

    const token = await privyNode.createAccessToken(emailAddress);
    res.status(200).json({ token });
}