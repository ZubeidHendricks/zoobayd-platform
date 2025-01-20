import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Zoobayd Platform</h1>
        </header>
        <main className="container">
          <Routes>
            <Route path="/" element={
              <div>
                <h2>Welcome to Zoobayd Platform</h2>
                <p>Your AI-Powered Blockchain Development Platform</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;