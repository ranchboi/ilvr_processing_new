import Head from 'next/head';
import MainContainer from '../components/MainContainer';

export default function Home() {
  return (
    <div className="flex bg-gray-100 min-h-screen flex-col items-center justify-center">
      <Head>
        <title>Visual Turing Test</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainContainer />
    </div>
  );
}
