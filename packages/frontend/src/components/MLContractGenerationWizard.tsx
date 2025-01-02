import React, { useState } from 'react';
import { ContractType, BlockchainNetworkType } from '../types/ContractTypes';

const MLContractGenerationWizard: React.FC = () => {
  const [generationState, setGenerationState] = useState({
    contractType: ContractType.TOKEN,
    network: BlockchainNetworkType.ETHEREUM,
    requirements: '',
    complexity: 'intermediate'
  });

  const [generatedContract, setGeneratedContract] = useState<{
    sourceCode?: string;
    securityScore?: number;
    optimizationScore?: number;
    recommendations?: string[];
    vulnerabilities?: string[];
  }>({});

  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ml/generate-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(generationState)
      });

      const result = await response.json();
      setGeneratedContract(result);
    } catch (error) {
      console.error('Contract generation failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ml-contract-generation-wizard">
      <h2>AI-Powered Contract Generation</h2>

      <div className="generation-controls">
        <select
          value={generationState.contractType}
          onChange={(e) => setGenerationState(prev => ({
            ...prev,
            contractType: e.target.value as ContractType
          }))}
        >
          {Object.values(ContractType).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={generationState.network}
          onChange={(e) => setGenerationState(prev => ({
            ...prev,
            network: e.target.value as BlockchainNetworkType
          }))}
        >
          {Object.values(BlockchainNetworkType).map(network => (
            <option key={network} value={network}>{network}</option>
          ))}
        </select>

        <textarea
          placeholder="Enter contract requirements"
          value={generationState.requirements}
          onChange={(e) => setGenerationState(prev => ({
            ...prev,
            requirements: e.target.value
          }))}
        />

        <button 
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Contract'}
        </button>
      </div>

      {generatedContract.sourceCode && (
        <div className="generated-contract-details">
          <h3>Generated Contract</h3>
          
          <div className="contract-analysis">
            <div className="score-section">
              <h4>Security Score: {generatedContract.securityScore?.toFixed(2)}%</h4>
              <div 
                className={`score-indicator ${
                  generatedContract.securityScore! > 80 ? 'high' :
                  generatedContract.securityScore! > 50 ? 'medium' : 'low'
                }`}
              />
            </div>

            <div className="score-section">
              <h4>Optimization Score: {generatedContract.optimizationScore?.toFixed(2)}%</h4>
              <div 
                className={`score-indicator ${
                  generatedContract.optimizationScore! > 80 ? 'high' :
                  generatedContract.optimizationScore! > 50 ? 'medium' : 'low'
                }`}
              />
            </div>
          </div>

          {generatedContract.recommendations && (
            <div className="recommendations">
              <h4>Optimization Recommendations</h4>
              <ul>
                {generatedContract.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {generatedContract.vulnerabilities && (
            <div className="vulnerabilities">
              <h4>Potential Vulnerabilities</h4>
              <ul>
                {generatedContract.vulnerabilities.map((vuln, index) => (
                  <li key={index} className="vulnerability">{vuln}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="source-code">
            <h4>Generated Contract Code</h4>
            <pre>{generatedContract.sourceCode}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default MLContractGenerationWizard;