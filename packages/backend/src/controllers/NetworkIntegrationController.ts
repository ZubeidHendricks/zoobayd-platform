import express from 'express';
import { AdvancedBlockchainNetworkService } from '../services/AdvancedBlockchainNetworkService';
import { CrossChainCompatibilityService } from '../services/CrossChainCompatibilityService';
import { NetworkOptimizationService } from '../services/NetworkOptimizationService';
import { AIContractGenerationService } from '../services/AIContractGenerationService';

class NetworkIntegrationController {
  private networkService: AdvancedBlockchainNetworkService;
  private crossChainService: CrossChainCompatibilityService;
  private optimizationService: NetworkOptimizationService;
  private contractGenerationService: AIContractGenerationService;

  constructor() {
    this.networkService = new AdvancedBlockchainNetworkService();
    this.crossChainService = new CrossChainCompatibilityService();
    this.optimizationService = new NetworkOptimizationService();
    this.contractGenerationService = new AIContractGenerationService();
  }

  // Get all supported networks
  getSupportedNetworks = (req: express.Request, res: express.Response) => {
    try {
      const networks = this.networkService.getSupportedNetworks();
      res.json(networks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve networks' });
    }
  }

  // Perform cross-chain compatibility analysis
  analyzeCrossChainCompatibility = (req: express.Request, res: express.Response) => {
    try {
      const { sourceNetwork, targetNetwork } = req.body;

      const compatibilityAnalysis = this.crossChainService.analyzeCompatibility(
        sourceNetwork, 
        targetNetwork
      );

      res.json(compatibilityAnalysis);
    } catch (error) {
      res.status(400).json({ error: 'Cross-chain analysis failed' });
    }
  }

  // Get network-specific optimization recommendations
  getNetworkOptimizations = (req: express.Request, res: express.Response) => {
    try {
      const { networkType } = req.params;

      const optimizationStrategy = this.optimizationService.getOptimizationStrategy(
        networkType as any
      );

      if (!optimizationStrategy) {
        return res.status(404).json({ error: 'Network type not supported' });
      }

      res.json(optimizationStrategy);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve optimization strategies' });
    }
  }

  // Generate contract with network-specific optimizations
  generateNetworkOptimizedContract = async (req: express.Request, res: express.Response) => {
    try {
      const { 
        contractType, 
        network, 
        requirements 
      } = req.body;

      // Generate contract with network-specific considerations
      const generatedContract = await this.contractGenerationService.generateContract({
        type: contractType,
        network,
        requirements,
        complexity: 'advanced'
      });

      // Perform network-specific optimization analysis
      const optimizationAnalysis = this.optimizationService.analyzeContractOptimization(
        generatedContract.sourceCode, 
        network
      );

      res.json({
        contract: generatedContract,
        optimizationAnalysis
      });
    } catch (error) {
      res.status(400).json({ error: 'Contract generation failed' });
    }
  }

  // Prepare routes for the controller
  setupRoutes(app: express.Application) {
    app.get('/api/networks', this.getSupportedNetworks);
    app.post('/api/networks/cross-chain-analysis', this.analyzeCrossChainCompatibility);
    app.get('/api/networks/:networkType/optimizations', this.getNetworkOptimizations);
    app.post('/api/contracts/generate-optimized', this.generateNetworkOptimizedContract);
  }
}

export default NetworkIntegrationController;