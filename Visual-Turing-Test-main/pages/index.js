import Head from 'next/head'
import Image from 'next/image'
import MainContainer from '../components/MainContainer'



export default function Home() {

  
  
  function submitSurvey(payload) {
    fetch("/api/submitSurvey", {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then(() => {
        setSuccess(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  

  return (
    <div className="flex bg-gray-100 min-h-screen flex-col items-center justify-center">
      <Head>
        <title>Visual Turing Test</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainContainer />
    </div>
  )
}

