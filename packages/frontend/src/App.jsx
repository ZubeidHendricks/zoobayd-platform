import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Zoobayd Platform</h1>
        </header>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Welcome to Zoobayd Platform</h2>
                <p>Your AI-Powered Blockchain Development Platform</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;