import React, { useState } from 'react';
import axios from 'axios';

const CreateContractTemplate: React.FC = () => {
    const [templateData, setTemplateData] = useState({
        title: '',
        description: '',
        blockchainType: 'ethereum',
        domain: 'general',
        complexity: 'beginner',
        code: '',
        tags: '',
        price: 0
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const blockchainOptions = [
        'ethereum', 'polygon', 'solana', 'cardano', 'binanceSmartChain'
    ];

    const domainOptions = [
        'defi', 'nft', 'gaming', 'insurance', 'general'
    ];

    const complexityOptions = [
        'beginner', 'intermediate', 'advanced'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTemplateData(prev => ({
            ...prev,
            [name]: name === 'tags' 
                ? value.split(',').map(tag => tag.trim()) 
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post('/api/marketplace/templates', templateData);
            
            setSuccess('Contract template created successfully!');
            // Reset form
            setTemplateData({
                title: '',
                description: '',
                blockchainType: 'ethereum',
                domain: 'general',
                complexity: 'beginner',
                code: '',
                tags: '',
                price: 0
            });
        } catch (err) {
            setError('Failed to create contract template');
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create Contract Template</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={templateData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                        placeholder="Enter template title"
                    />
                </div>

                <div>
                    <label className="block mb-2">Description</label>
                    <textarea
                        name="description"
                        value={templateData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Describe your contract template"
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-2">Blockchain</label>
                        <select
                            name="blockchainType"
                            value={templateData.blockchainType}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        >
                            {blockchainOptions.map(blockchain => (
                                <option key={blockchain} value={blockchain}>
                                    {blockchain.charAt(0).toUpperCase() + blockchain.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2">Domain</label>
                        <select
                            name="domain"
                            value={templateData.domain}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        >
                            {domainOptions.map(domain => (
                                <option key={domain} value={domain}>
                                    {domain.charAt(0).toUpperCase() + domain.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2">Complexity</label>
                        <select
                            name="complexity"
                            value={templateData.complexity}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        >
                            {complexityOptions.map(complexity => (
                                <option key={complexity} value={complexity}>
                                    {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block mb-2">Contract Code</label>
                    <textarea
                        name="code"
                        value={templateData.code}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded font-mono h-48"
                        placeholder="Paste your contract code here"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2">Tags (comma-separated)</label>
                        <input
                            type="text"
                            name="tags"
                            value={templateData.tags}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="e.g. DeFi, Lending, NFT"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Price (optional)</label>
                        <input
                            type="number"
                            name="price"
                            value={templateData.price}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            className="w-full p-2 border rounded"
                            placeholder="Enter price if selling"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Create Contract Template
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateContractTemplate;