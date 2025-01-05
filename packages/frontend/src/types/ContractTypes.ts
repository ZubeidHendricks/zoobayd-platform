export enum BlockchainNetwork {
  ETHEREUM = 'ethereum',
  BINANCE = 'binance',
  POLYGON = 'polygon',
  SOLANA = 'solana'
}

export enum AIProvider {
  GPT4 = 'gpt4',
  CLAUDE = 'claude',
  PALM = 'palm',
  CUSTOM = 'custom'
}

export interface ContractGenerationRequest {
  name: string;
  description: string;
  blockchain: BlockchainNetwork;
  aiProvider?: AIProvider;
  features: string[];
  optimizationLevel?: number;
  securityChecks?: boolean;
  metadata?: Record<string, any>;
}