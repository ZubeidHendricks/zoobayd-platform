import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Authentication Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Previous Components
import ContractGenerator from './components/ContractGenerator';
import BlockchainStatus from './components/BlockchainStatus';
import ComplianceCheck from './components/ComplianceCheck';

// Marketplace Components
import MarketplaceSearch from './pages/marketplace/MarketplaceSearch';
import CreateContractTemplate from './pages/marketplace/CreateContractTemplate';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <nav className="bg-gray-800 p-4">
                        <div className="container mx-auto flex justify-between items-center">
                            <Link to="/" className="text-white text-xl font-bold">
                                Zoobayd Platform
                            </Link>
                            <div className="space-x-4">
                                <Link to="/marketplace" className="text-gray-300 hover:text-white">
                                    Marketplace
                                </Link>
                                <Link to="/contract-generator" className="text-gray-300 hover:text-white">
                                    Contract Generator
                                </Link>
                                <Link to="/login" className="text-gray-300 hover:text-white">
                                    Login
                                </Link>
                                <Link to="/register" className="text-gray-300 hover:text-white">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </nav>

                    <Routes>
                        {/* Home Route */}
                        <Route path="/" element={<Home />} />

                        {/* Authentication Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Marketplace Routes */}
                        <Route path="/marketplace" element={<MarketplaceSearch />} />
                        <Route path="/marketplace/create" element={<CreateContractTemplate />} />

                        {/* Existing Service Routes */}
                        <Route path="/contract-generator" element={<ContractGenerator />} />
                        <Route path="/blockchain-status" element={<BlockchainStatus />} />
                        <Route path="/compliance-check" element={<ComplianceCheck />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

const Home: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Welcome to Zoobayd Platform</h1>
            <p className="mb-4">
                An AI-powered blockchain development ecosystem that revolutionizes 
                smart contract creation, optimization, and collaboration.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Contract Generation</h2>
                    <p>Generate advanced smart contracts with AI-powered assistance.</p>
                    <Link 
                        to="/contract-generator" 
                        className="mt-2 inline-block text-blue-500 hover:underline"
                    >
                        Get Started
                    </Link>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Marketplace</h2>
                    <p>Explore and share contract templates across multiple blockchains.</p>
                    <Link 
                        to="/marketplace" 
                        className="mt-2 inline-block text-blue-500 hover:underline"
                    >
                        Browse Templates
                    </Link>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Blockchain Status</h2>
                    <p>Monitor real-time status of various blockchain networks.</p>
                    <Link 
                        to="/blockchain-status" 
                        className="mt-2 inline-block text-blue-500 hover:underline"
                    >
                        Check Status
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default App;