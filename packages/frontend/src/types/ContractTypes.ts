export enum AIProvider {
  GPT4 = 'gpt4',
  CLAUDE = 'claude',
  PALM = 'palm',
  CUSTOM = 'custom',
  OPENAI = 'openai'
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