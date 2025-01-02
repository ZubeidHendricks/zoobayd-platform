import { ContractType, BlockchainNetwork } from './ContractTypes';

export interface WorkflowStep {
  id: string;
  type: 'input' | 'generation' | 'analysis' | 'optimization' | 'deployment';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  details?: any;
}

export interface ContractWorkflowRequest {
  userId: string;
  projectName: string;
  contractType: ContractType;
  targetNetwork: BlockchainNetwork;
  requirements: {
    tokenName?: string;
    symbol?: string;
    initialSupply?: number;
    mintable?: boolean;
    burnable?: boolean;
    pausable?: boolean;
  };
}

export interface ContractWorkflowResult {
  workflowId: string;
  steps: WorkflowStep[];
  finalContract?: {
    sourceCode: string;
    securityScore: number;
    gasEfficiency: number;
    deploymentEstimate: {
      estimatedGasCost: number;
      networkFees: number;
    };
  };
}