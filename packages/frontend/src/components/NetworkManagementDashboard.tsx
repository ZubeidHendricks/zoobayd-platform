import React, { useState, useEffect } from 'react';
import { 
  BlockchainNetworkType, 
  BlockchainNetworkConfig 
} from '../types/NetworkTypes';

const NetworkManagementDashboard: React.FC = () => {
  const [networks, setNetworks] = useState<BlockchainNetworkConfig[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<BlockchainNetworkConfig | null>(null);
  const [crossChainAnalysis, setCrossChainAnalysis] = useState<{
    isCompatible: boolean;
    compatibilityScore: number;
    requiredAdaptations: string[];
    potentialChallenges: string[];
  } | null>(null);

  useEffect(() => {
    // Fetch supported networks
    const fetchNetworks = async () => {
      try {
        const response = await fetch('/api/networks');
        const data = await response.json();
        setNetworks(data);
      } catch (error) {
        console.error('Failed to fetch networks', error);
      }
    };

    fetchNetworks();
  }, []);

  const handleNetworkSelection = (network: BlockchainNetworkConfig) => {
    setSelectedNetwork(network);
  };

  const performCrossChainAnalysis = async (
    sourceNetwork: BlockchainNetworkConfig, 
    targetNetwork: BlockchainNetworkConfig
  ) => {
    try {
      const response = await fetch('/api/networks/cross-chain-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sourceNetwork,
          targetNetwork
        })
      });

      const analysisResult = await response.json();
      setCrossChainAnalysis(analysisResult);
    } catch (error) {
      console.error('Cross-chain analysis failed', error);
    }
  };

  const renderNetworkOptimizationRecommendations = (network: BlockchainNetworkConfig) => {
    return (
      <div className="network-optimization-recommendations">
        <h3>Optimization Recommendations</h3>
        <ul>
          {network.supportedFeatures.map(feature => (
            <li key={feature} className="optimization-feature">
              {feature}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="network-management-dashboard">
      <h2>Blockchain Network Management</h2>

      <section className="network-selection">
        <h3>Supported Networks</h3>
        <div className="network-grid">
          {networks.map(network => (
            <div 
              key={network.id} 
              className={`network-card ${
                selectedNetwork?.id === network.id ? 'selected' : ''
              }`}
              onClick={() => handleNetworkSelection(network)}
            >
              <h4>{network.name}</h4>
              <p>Type: {network.type}</p>
              <p>Chain ID: {network.chainId}</p>
            </div>
          ))}
        </div>
      </section>

      {selectedNetwork && (
        <section className="network-details">
          <h3>Network Details: {selectedNetwork.name}</h3>
          
          <div className="network-info">
            <p><strong>RPC URL:</strong> {selectedNetwork.rpcUrl}</p>
            <p><strong>Explorer URL:</strong> {selectedNetwork.explorerUrl}</p>
            <p>
              <strong>Native Currency:</strong> {selectedNetwork.nativeCurrency.name} 
              ({selectedNetwork.nativeCurrency.symbol})
            </p>
          </div>

          {renderNetworkOptimizationRecommendations(selectedNetwork)}

          <div className="cross-chain-analysis">
            <h3>Cross-Chain Compatibility</h3>
            <select 
              onChange={(e) => {
                const targetNetwork = networks.find(n => n.id === e.target.value);
                if (targetNetwork) {
                  performCrossChainAnalysis(selectedNetwork, targetNetwork);
                }
              }}
            >
              <option>Select Target Network</option>
              {networks
                .filter(n => n.id !== selectedNetwork.id)
                .map(network => (
                  <option key={network.id} value={network.id}>
                    {network.name}
                  </option>
                ))
              }
            </select>

            {crossChainAnalysis && (
              <div className="compatibility-results">
                <h4>Analysis Results</h4>
                <p>
                  <strong>Compatible:</strong> 
                  {crossChainAnalysis.isCompatible ? 'Yes' : 'No'}
                </p>
                <p>
                  <strong>Compatibility Score:</strong> 
                  {(crossChainAnalysis.compatibilityScore * 100).toFixed(2)}%
                </p>

                {crossChainAnalysis.requiredAdaptations.length > 0 && (
                  <div>
                    <h5>Required Adaptations</h5>
                    <ul>
                      {crossChainAnalysis.requiredAdaptations.map((adaptation, index) => (
                        <li key={index}>{adaptation}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {crossChainAnalysis.potentialChallenges.length > 0 && (
                  <div>
                    <h5>Potential Challenges</h5>
                    <ul>
                      {crossChainAnalysis.potentialChallenges.map((challenge, index) => (
                        <li key={index}>{challenge}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default NetworkManagementDashboard;