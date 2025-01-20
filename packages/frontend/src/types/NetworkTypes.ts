export enum BlockchainNetworkType {
  ETHEREUM = 'ethereum',
  BINANCE = 'binance',
  POLYGON = 'polygon',
  AVALANCHE = 'avalanche',
  SOLANA = 'solana'
}

export interface NetworkNode {
  id: string;
  url: string;
  status: 'active' | 'inactive' | 'syncing';
  latency: number;
}

export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface BlockchainNetworkConfig {
  id: string;
  type: BlockchainNetworkType;
  name: string;
  chainId: number;
  enabled: boolean;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: NativeCurrency;
  nodes: NetworkNode[];
  supportedFeatures: string[];
  performance: {
    latency: number;
    throughput: number;
    reliability: number;
  };
}