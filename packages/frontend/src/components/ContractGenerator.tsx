import React, { useState } from 'react';
import axios from 'axios';

const ContractGenerator: React.FC = () => {
    const [blockchain, setBlockchain] = useState('ethereum');
    const [specifications, setSpecifications] = useState('');
    const [generatedContract, setGeneratedContract] = useState('');
    const [securityAnalysis, setSecurityAnalysis] = useState<any>(null);

    const handleGenerateContract = async () => {
        try {
            const response = await axios.post('/api/contracts/generate', {
                blockchain,
                specifications
            });

            setGeneratedContract(response.data.contract);
            setSecurityAnalysis(response.data.securityAnalysis);
        } catch (error) {
            console.error('Contract generation failed:', error);
            alert('Failed to generate contract');
        }
    };

    return (
        <div>
            <h2>Smart Contract Generator</h2>
            <div>
                <label>
                    Blockchain:
                    <select 
                        value={blockchain} 
                        onChange={(e) => setBlockchain(e.target.value)}
                    >
                        <option value="ethereum">Ethereum</option>
                        <option value="polygon">Polygon</option>
                        <option value="solana">Solana</option>
                        <option value="cardano">Cardano</option>
                        <option value="binanceSmartChain">Binance Smart Chain</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Contract Specifications:
                    <textarea 
                        value={specifications}
                        onChange={(e) => setSpecifications(e.target.value)}
                        placeholder="Describe your smart contract requirements..."
                        rows={4}
                        cols={50}
                    />
                </label>
            </div>
            <button onClick={handleGenerateContract}>Generate Contract</button>

            {generatedContract && (
                <div>
                    <h3>Generated Contract</h3>
                    <pre>{generatedContract}</pre>
                </div>
            )}

            {securityAnalysis && (
                <div>
                    <h3>Security Analysis</h3>
                    <p>Security Score: {securityAnalysis.securityScore}/100</p>
                    {securityAnalysis.potentialVulnerabilities.length > 0 && (
                        <div>
                            <h4>Potential Vulnerabilities:</h4>
                            <ul>
                                {securityAnalysis.potentialVulnerabilities.map((vuln: string, index: number) => (
                                    <li key={index}>{vuln}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ContractGenerator;