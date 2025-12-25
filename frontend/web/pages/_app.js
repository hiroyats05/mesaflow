import Head from 'next/head'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon-256.png" type="image/png" sizes="256x256" />
        <link rel="apple-touch-icon" href="/favicon-256.png" />
        <meta name="theme-color" content="#0F172A" />
        <title>MesaFlow</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
