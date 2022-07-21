import { PrivyClient } from '@privy-io/privy-node';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ error?: string }>) {
    const privyNode = new PrivyClient(process.env.PRIVY_API_KEY, process.env.PRIVY_API_SECRET);
    if (!req.body) {
        res.status(400).json({ error: 'Must include params in the body of request.' });
        return;
    }
    const { isSubscribing, snoopName, userEmail, snoopAddress } = JSON.parse(req.body);
    if (isSubscribing) {
        await privyNode.sendEmail(userEmail, `Cryptosnoop subscription successful`,
            `Hello! <br/>
            This is a confirmation that you have successfully subscribed to balance change notifications of the following account: 
            ${snoopAddress} (${snoopName})<br/><br/>
            If you think this is a mistake, you can log into Cryptosnoops under https://demos.privy.io
            `)
    } else {
        await privyNode.sendEmail(userEmail, `Cryptosnoop subscription removed`,
            `Hello!<br/>
            This is a confirmation that you have successfully unsubscribed from the following Cryptosnoop: 
            ${snoopAddress} (${snoopName})
            `)
    }
    res.status(200).json({});
}