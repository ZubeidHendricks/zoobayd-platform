import React, { useState } from 'react';
import ContractGenerationService from '../services/ContractGenerationService';
import { 
  AIProvider, 
  BlockchainNetwork 
} from '../types/ContractTypes';

const AIContractGenerator: React.FC = () => {
  const [generationState, setGenerationState] = useState({
    projectType: '',
    blockchain: BlockchainNetwork.ETHEREUM,
    requirements: '',
    aiProvider: AIProvider.OPENAI,
    complexityLevel: 'intermediate'
  });

  const [generatedContract, setGeneratedContract] = useState<{
    sourceCode?: string;
    optimizationScore?: number;
    securityRecommendations?: string[];
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const projectTypeOptions = [
    'Token Contract',
    'NFT Collection',
    'DeFi Protocol',
    'Staking Contract',
    'Governance Token',
    'Crowdfunding Platform'
  ];

  const handleGenerateContract = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ContractGenerationService.generateContract({
        projectType: generationState.projectType,
        blockchain: generationState.blockchain,
        requirements: generationState.requirements,
        aiProvider: generationState.aiProvider,
        complexityLevel: generationState.complexityLevel as 'basic' | 'intermediate' | 'advanced'
      });
      
      setGeneratedContract({
        sourceCode: response.sourceCode,
        optimizationScore: response.optimizationScore,
        securityRecommendations: response.securityRecommendations
      });
    } catch (err) {
      setError('Failed to generate contract. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadContract = async () => {
    try {
      // This would typically involve first saving the contract and getting an ID
      const contractBlob = await ContractGenerationService.downloadContract('contract-id');
      
      // Create a download link
      const url = window.URL.createObjectURL(contractBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${generationState.projectType}_contract.sol`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download contract');
      console.error(err);
    }
  };

  const handleStateChange = (
    field: keyof typeof generationState, 
    value: string
  ) => {
    setGenerationState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="ai-contract-generator">
      <h2>AI Smart Contract Generator</h2>
      
      <div className="generation-form">
        <select
          value={generationState.projectType}
          onChange={(e) => handleStateChange('projectType', e.target.value)}
          required
        >
          <option value="">Select Project Type</option>
          {projectTypeOptions.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={generationState.blockchain}
          onChange={(e) => handleStateChange('blockchain', e.target.value)}
        >
          {Object.values(BlockchainNetwork).map(blockchain => (
            <option key={blockchain} value={blockchain}>
              {blockchain.replace(/_/g, ' ').toUpperCase()}
            </option>
          ))}
        </select>

        <select
          value={generationState.aiProvider}
          onChange={(e) => handleStateChange('aiProvider', e.target.value)}
        >
          {Object.values(AIProvider).map(provider => (
            <option key={provider} value={provider}>
              {provider.toUpperCase()} AI
            </option>
          ))}
        </select>

        <select
          value={generationState.complexityLevel}
          onChange={(e) => handleStateChange('complexityLevel', e.target.value)}
        >
          <option value="basic">Basic</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <textarea
          placeholder="Enter specific requirements for your smart contract"
          value={generationState.requirements}
          onChange={(e) => handleStateChange('requirements', e.target.value)}
          rows={4}
        />

        <button 
          onClick={handleGenerateContract}
          disabled={
            !generationState.projectType || 
            !generationState.requirements ||
            isLoading
          }
        >
          {isLoading ? 'Generating...' : 'Generate Contract'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {generatedContract.sourceCode && (
        <div className="generated-contract">
          <h3>Generated Contract</h3>
          
          <div className="contract-details">
            <p>
              <strong>Optimization Score:</strong> 
              {generatedContract.optimizationScore?.toFixed(2)}%
            </p>
            
            <div className="security-recommendations">
              <h4>Security Recommendations:</h4>
              <ul>
                {generatedContract.securityRecommendations?.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          <pre className="source-code">
            {generatedContract.sourceCode}
          </pre>

          <div className="contract-actions">
            <button onClick={() => {
              navigator.clipboard.writeText(generatedContract.sourceCode || '');
            }}>
              Copy Contract
            </button>
            <button onClick={handleDownloadContract}>
              Download Contract
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIContractGenerator;