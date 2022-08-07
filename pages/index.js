import Layout from '../components/layout'

const Home = () => {

  return (
    <Layout>

<<<<<<< HEAD
      <h1>Welcome to Cryptosnoops!</h1>
=======
      <h1>Welcome to Cryptosnoop!</h1>
>>>>>>> a223546338581913714cf15d4c7dcfe607842e1b

      <p>
        {`This demo allows you to 🌚 snoop 🌚 on Ethereum addresses.
    Youll receive an email anytime a non-zero amount goes to or from one of the specified accounts,
    with a link to the recent transaction.`}
      </p>
      <h3>This Privy demo showcases the following Privy API features:</h3>
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
      <h3>How to use:</h3>
      <ol>
        <li>Click Login (top right) and enter an email.</li>
        <li>
          {`If it's your first time, go through the Magic passwordless email process. Keep the tab open.`}
        </li>
        <li>
          Go to the Snoops tab and add your cryptosnoop subscriptions!
        </li>
        <li>
          You may always unsubscribe from cryptosnoop emails through this site.
        </li>
      </ol>

      <style jsx>{`
        li {
          margin-bottom: 0.5rem;
        }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `}</style>
    </Layout>
  )
}

export default Home
