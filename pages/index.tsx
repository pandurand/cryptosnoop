import { useUser } from '../lib/hooks'
import Layout from '../components/layout'
import UserHomePage from '../components/userHomePage'
import PublicHomePage from '../components/publicHomePage'


const Home = () => {
  const user = useUser()


  return (
    <Layout>


      {user ? <UserHomePage userEmail={user.email.toLowerCase()} /> : <PublicHomePage />}

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
