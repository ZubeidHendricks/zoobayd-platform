import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ContractTemplate {
    _id: string;
    title: string;
    description?: string;
    blockchainType: string;
    domain: string;
    complexity: string;
    author: string;
    tags?: string[];
    price?: number;
    ratings: {
        average: number;
        count: number;
    };
}

const MarketplaceSearch: React.FC = () => {
    const [templates, setTemplates] = useState<ContractTemplate[]>([]);
    const [filters, setFilters] = useState({
        blockchainType: '',
        domain: '',
        complexity: '',
        minPrice: '',
        maxPrice: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const blockchainOptions = [
        'ethereum', 'polygon', 'solana', 'cardano', 'binanceSmartChain'
    ];

    const domainOptions = [
        'defi', 'nft', 'gaming', 'insurance', 'general'
    ];

    const complexityOptions = [
        'beginner', 'intermediate', 'advanced'
    ];

    const searchTemplates = async () => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams();
            
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });

            const response = await axios.get(`/api/marketplace/templates/search?${queryParams}`);
            setTemplates(response.data);
        } catch (err) {
            setError('Failed to search templates');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        searchTemplates();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const downloadTemplate = async (templateId: string) => {
        try {
            await axios.post(`/api/marketplace/templates/${templateId}/download`);
            alert('Template downloaded successfully!');
        } catch (err) {
            console.error('Download failed', err);
            alert('Failed to download template');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Contract Template Marketplace</h1>

            {/* Filters */}
            <div className="mb-4 grid grid-cols-5 gap-4">
                <select 
                    name="blockchainType" 
                    value={filters.blockchainType}
                    onChange={handleFilterChange}
                    className="p-2 border rounded"
                >
                    <option value="">All Blockchains</option>
                    {blockchainOptions.map(blockchain => (
                        <option key={blockchain} value={blockchain}>
                            {blockchain.charAt(0).toUpperCase() + blockchain.slice(1)}
                        </option>
                    ))}
                </select>

                <select 
                    name="domain"
                    value={filters.domain}
                    onChange={handleFilterChange}
                    className="p-2 border rounded"
                >
                    <option value="">All Domains</option>
                    {domainOptions.map(domain => (
                        <option key={domain} value={domain}>
                            {domain.charAt(0).toUpperCase() + domain.slice(1)}
                        </option>
                    ))}
                </select>

                <select 
                    name="complexity"
                    value={filters.complexity}
                    onChange={handleFilterChange}
                    className="p-2 border rounded"
                >
                    <option value="">All Complexities</option>
                    {complexityOptions.map(complexity => (
                        <option key={complexity} value={complexity}>
                            {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
                        </option>
                    ))}
                </select>

                <input 
                    type="number" 
                    name="minPrice"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    className="p-2 border rounded"
                />

                <input 
                    type="number" 
                    name="maxPrice"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    className="p-2 border rounded"
                />

                <button 
                    onClick={searchTemplates}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Search
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center text-gray-500">
                    Loading templates...
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Template List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map(template => (
                    <div 
                        key={template._id} 
                        className="border rounded p-4 hover:shadow-lg transition-shadow"
                    >
                        <h2 className="text-xl font-bold mb-2">{template.title}</h2>
                        <p className="text-gray-600 mb-2">{template.description}</p>
                        
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-500">
                                Blockchain: {template.blockchainType}
                            </span>
                            <span className="text-sm text-gray-500">
                                Domain: {template.domain}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-sm text-gray-500">
                                    Rating: {template.ratings.average.toFixed(1)} 
                                    ({template.ratings.count} reviews)
                                </span>
                            </div>
                            <button
                                onClick={() => downloadTemplate(template._id)}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketplaceSearch;