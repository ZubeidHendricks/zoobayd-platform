export enum AIProvider {
  OPENAI = 'openai',
  GOOGLE = 'google',
  ANTHROPIC = 'anthropic'
}

export enum BlockchainNetwork {
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  BINANCE_SMART_CHAIN = 'binance_smart_chain',
  SOLANA = 'solana'
}

export interface ContractGenerationRequest {
  projectType: string;
  blockchain: BlockchainNetwork;
  requirements: string;
  aiProvider: AIProvider;
  complexityLevel: 'basic' | 'intermediate' | 'advanced';
}