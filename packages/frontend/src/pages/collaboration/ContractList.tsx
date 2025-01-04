import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface CollaborativeContract {
    _id: string;
    title: string;
    description?: string;
    blockchainType: string;
    domain: string;
    currentVersion: number;
    owners: string[];
    collaborators: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ContractList: React.FC = () => {
    const [contracts, setContracts] = useState<CollaborativeContract[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const response = await axios.get('/api/collaboration/contracts');
                setContracts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch contracts');
                setLoading(false);
                console.error(err);
            }
        };

        fetchContracts();
    }, []);

    const createNewContract = async () => {
        try {
            const response = await axios.post('/api/collaboration/contracts', {
                title: 'New Contract',
                blockchainType: 'ethereum',
                domain: 'general'
            });
            
            // Redirect to new contract or update list
            setContracts(prev => [...prev, response.data]);
        } catch (err) {
            setError('Failed to create new contract');
            console.error(err);
        }
    };

    if (loading) return <div>Loading contracts...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Collaborative Contracts</h1>
                <button 
                    onClick={createNewContract}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Create New Contract
                </button>
            </div>

            {contracts.length === 0 ? (
                <div className="text-center text-gray-500">
                    No contracts found. Create your first contract!
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-4">
                    {contracts.map(contract => (
                        <div 
                            key={contract._id} 
                            className="border rounded p-4 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-semibold">{contract.title}</h2>
                                <span className="text-sm text-gray-500">
                                    v{contract.currentVersion}
                                </span>
                            </div>

                            <div className="text-sm text-gray-600 mb-2">
                                {contract.description || 'No description'}
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="space-x-2">
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {contract.blockchainType}
                                    </span>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                        {contract.domain}
                                    </span>
                                </div>

                                <Link 
                                    to={`/collaboration/${contract._id}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    Open
                                </Link>
                            </div>

                            <div className="mt-2 text-xs text-gray-500">
                                <span>Created: {new Date(contract.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContractList;