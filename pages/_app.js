import '../styles/globals.css'
import { useEffect, } from 'react';


function MyApp({ Component, pageProps }) {
  useEffect(() => {
    fetch('/api/update-subscription?startlistener=true');
  }, [])
  return <Component {...pageProps} />
}

export default MyApp
