import React, { useState, useEffect } from 'react';
import axios from 'axios';

const blockchains = [
    'ethereum', 'polygon', 'solana', 'cardano', 'binanceSmartChain'
];

const BlockchainStatus: React.FC = () => {
    const [statuses, setStatuses] = useState<{[key: string]: any}>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const statusPromises = blockchains.map(async (blockchain) => {
                    try {
                        const response = await axios.get(`/api/blockchain/status?blockchain=${blockchain}`);
                        return { [blockchain]: response.data };
                    } catch (error) {
                        return { [blockchain]: { connected: false } };
                    }
                });

                const results = await Promise.all(statusPromises);
                const statusMap = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                
                setStatuses(statusMap);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch blockchain statuses:', error);
                setLoading(false);
            }
        };

        fetchStatuses();
        const intervalId = setInterval(fetchStatuses, 60000); // Refresh every minute

        return () => clearInterval(intervalId);
    }, []);

    const renderStatusBadge = (status: any) => {
        if (loading) return <span>Loading...</span>;
        
        return status.connected ? (
            <span style={{ color: 'green' }}>✓ Connected</span>
        ) : (
            <span style={{ color: 'red' }}>✗ Disconnected</span>
        );
    };

    return (
        <div>
            <h2>Blockchain Network Status</h2>
            <table>
                <thead>
                    <tr>
                        <th>Blockchain</th>
                        <th>Status</th>
                        <th>Latest Block</th>
                        <th>Network ID</th>
                    </tr>
                </thead>
                <tbody>
                    {blockchains.map((blockchain) => (
                        <tr key={blockchain}>
                            <td>{blockchain.charAt(0).toUpperCase() + blockchain.slice(1)}</td>
                            <td>{renderStatusBadge(statuses[blockchain] || {})}</td>
                            <td>{statuses[blockchain]?.latestBlock || 'N/A'}</td>
                            <td>{statuses[blockchain]?.networkId || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BlockchainStatus;