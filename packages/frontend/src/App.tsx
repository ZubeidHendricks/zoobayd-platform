import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Components
import ContractGenerator from './components/ContractGenerator';
import BlockchainStatus from './components/BlockchainStatus';
import ComplianceCheck from './components/ComplianceCheck';

const App: React.FC = () => {
    return (
        <Router>
            <div className="app-container">
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/contract-generator">Contract Generator</Link></li>
                        <li><Link to="/blockchain-status">Blockchain Status</Link></li>
                        <li><Link to="/compliance-check">Compliance Check</Link></li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contract-generator" element={<ContractGenerator />} />
                    <Route path="/blockchain-status" element={<BlockchainStatus />} />
                    <Route path="/compliance-check" element={<ComplianceCheck />} />
                </Routes>
            </div>
        </Router>
    );
};

const Home: React.FC = () => {
    return (
        <div>
            <h1>Zoobayd Platform</h1>
            <p>AI-Powered Blockchain Development Ecosystem</p>
        </div>
    );
};

export default App;