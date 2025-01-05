import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Zoobayd Platform</h1>
        </header>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<div>Welcome to Zoobayd Platform</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;