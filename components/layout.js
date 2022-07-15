import Head from 'next/head'
import Header from './header'

const Layout = (props) => (
  <>
    <Head>
      <title>Cryptosnoop</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Header />

    <main>
      <div className="container">{props.children}</div>
    </main>

    <footer >
      <a href="https://github.com/privy-io/cryptosnoop">Github repo</a>
      |
      <a href="https://privy.io">Privy</a>
    </footer>

  </>
)

export default Layout
