import { AIContractGenerationService } from './AIContractGenerationService';
import { ContractWorkflowService } from './ContractWorkflowService';
import { BlockchainDeploymentService } from './BlockchainDeploymentService';
import { SecurityAnalysisService } from './SecurityAnalysisService';

class WorkflowIntegrationService {
  private aiContractGenerator: AIContractGenerationService;
  private workflowService: ContractWorkflowService;
  private deploymentService: BlockchainDeploymentService;
  private securityService: SecurityAnalysisService;

  constructor() {
    this.aiContractGenerator = new AIContractGenerationService();
    this.workflowService = new ContractWorkflowService();
    this.deploymentService = new BlockchainDeploymentService();
    this.securityService = new SecurityAnalysisService();
  }

  async executeFullWorkflow(request: any) {
    try {
      // Step 1: Generate Contract
      const generatedContract = await this.aiContractGenerator.generateContract(request);

      // Step 2: Security Analysis
      const securityAnalysis = await this.securityService.analyzeContract(generatedContract.sourceCode);

      // Step 3: Deployment Preparation
      const deploymentPrep = await this.deploymentService.prepareDeployment({
        contractCode: generatedContract.sourceCode,
        network: request.network
      });

      return {
        contract: generatedContract,
        securityAnalysis,
        deploymentPreparation: deploymentPrep
      };
    } catch (error) {
      console.error('Workflow Integration Failed:', error);
      throw new Error('Workflow execution failed');
    }
  }

  async validateAndEnhanceContract(contractCode: string) {
    // Comprehensive contract validation and enhancement
    const securityAnalysis = await this.securityService.analyzeContract(contractCode);
    const optimizedContract = await this.securityService.optimizeContract(contractCode);

    return {
      originalContract: contractCode,
      optimizedContract,
      securityScore: securityAnalysis.score,
      recommendations: securityAnalysis.recommendations
    };
  }
}