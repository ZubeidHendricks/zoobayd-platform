import { AIContractGenerationService } from './AIContractGenerationService';
import { NetworkOptimizationService } from './NetworkOptimizationService';
import { BlockchainNetworkType } from './AdvancedBlockchainNetworkService';

class NetworkAwareContractGeneration {
  private aiContractGenerator: AIContractGenerationService;
  private networkOptimizationService: NetworkOptimizationService;

  constructor() {
    this.aiContractGenerator = new AIContractGenerationService();
    this.networkOptimizationService = new NetworkOptimizationService();
  }

  async generateNetworkOptimizedContract(
    contractType: string,
    networkType: BlockchainNetworkType,
    requirements: any
  ) {
    // Generate base contract
    const baseContract = await this.aiContractGenerator.generateContract({
      type: contractType,
      network: networkType,
      requirements,
      complexity: 'advanced'
    });

    // Analyze and optimize for specific network
    const optimizationAnalysis = this.networkOptimizationService.analyzeContractOptimization(
      baseContract.sourceCode, 
      networkType
    );

    // Generate optimized contract
    const optimizedContractResult = this.networkOptimizationService.generateOptimizedContract(
      baseContract.sourceCode, 
      networkType
    );

    return {
      originalContract: baseContract,
      optimizationAnalysis,
      optimizedContract: optimizedContractResult.optimizedCode,
      optimizationChanges: optimizedContractResult.optimizationChanges
    };
  }

  // Generate network-specific contract templates
  async generateNetworkTemplates(networkType: BlockchainNetworkType) {
    const contractTypes = [
      'token', 
      'nft', 
      'defi', 
      'staking', 
      'governance'
    ];

    const templates = await Promise.all(
      contractTypes.map(async (type) => {
        const template = await this.generateNetworkOptimizedContract(
          type, 
          networkType, 
          {} // Empty requirements for template generation
        );

        return {
          type,
          template: template.optimizedContract
        };
      })
    );

    return {
      networkType,
      templates
    };
  }

  // Provide network-specific best practices and recommendations
  getNetworkSpecificRecommendations(networkType: BlockchainNetworkType) {
    const optimizationStrategy = this.networkOptimizationService.getOptimizationStrategy(
      networkType
    );

    if (!optimizationStrategy) {
      throw new Error(`No optimization strategy found for network type: ${networkType}`);
    }

    return {
      networkType,
      gasOptimizationTechniques: optimizationStrategy.gasOptimizationTechniques,
      securityEnhancements: optimizationStrategy.securityEnhancements,
      performanceTips: optimizationStrategy.performanceTips
    };
  }
}

export default NetworkAwareContractGeneration;