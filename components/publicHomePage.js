
export default function PublicHomePage() {
    return (
        <>
            <h1>Welcome to Cryptosnoops!</h1>

            <p>
                {`This demo allows you to 🌚 snoop 🌚 on Ethereum addresses.
                Youll receive an email anytime a non-zero amount goes to or from one of the specified accounts,
                with a link to the recent transaction.`}
            </p>
            This Privy demo showcases the following Privy features:
            <ul>
                <li>
                    <a href="https://docs.privy.io/guide/authentication/authentication-in-privy">Privy integration with a third-party non-wallet auth</a> system (<a href="https://magic.link">Magic</a>)

                </li>
                <li>
                    <a href="https://docs.privy.io/guide/authentication/auth-tokens/access-tokens">Issuing access tokens</a> from server-side to front-end
                </li>
                <li>
                    The <a href="https://docs.privy.io/guide/actions/sending-emails"><code>sendEmail</code> API</a>
                </li>

            </ul>
            How to use:
            <ol>
                <li>Click Login and enter an email.</li>
                <li>
                    {`If it's your first time, go through the Magic passwordless email process. Keep the tab open.`}
                </li>
                <li>
                    Add your cryptosnoop subscriptions!
                </li>
                <li>
                    You may always unsubscribe from cryptosnoop emails through this site.
                </li>
            </ol>


        </>
    )
}