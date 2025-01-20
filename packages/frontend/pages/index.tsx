import React from 'react';
import Head from 'next/head';

const HomePage: React.FC = () => {
  return (
    <div className="App">
      <Head>
        <title>Zoobayd Platform</title>
        <meta name="description" content="AI-Powered Blockchain Development Platform" />
      </Head>
      
      <header className="App-header">
        <h1>Zoobayd Platform</h1>
      </header>
      
      <main className="container mx-auto p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Zoobayd Platform</h2>
          <p>Your AI-Powered Blockchain Development Platform</p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
