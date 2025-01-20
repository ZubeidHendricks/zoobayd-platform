import React from 'react';
import Head from 'next/head';

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Zoobayd Platform</title>
        <meta name="description" content="AI-Powered Blockchain Development Platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to Zoobayd Platform</h1>
        <p>Your AI-Powered Blockchain Development Solution</p>
      </main>
    </div>
  );
}

export default Home;
