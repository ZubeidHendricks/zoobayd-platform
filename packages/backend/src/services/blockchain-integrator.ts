import Web3 from 'web3';
import { BlockchainType } from '../types/blockchain';

interface BlockchainConfig {
    rpcUrl: string;
    chainId: number;
}

class BlockchainIntegrationService {
    private blockchainConfigs: Record<BlockchainType, BlockchainConfig> = {
        ethereum: {
            rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
            chainId: 1
        },
        polygon: {
            rpcUrl: 'https://polygon-rpc.com',
            chainId: 137
        },
        solana: {
            rpcUrl: 'https://api.mainnet-beta.solana.com',
            chainId: 101
        },
        cardano: {
            rpcUrl: 'https://cardano-mainnet.blockfrost.io/api/v0',
            chainId: 1
        },
        binanceSmartChain: {
            rpcUrl: 'https://bsc-dataseed.binance.org/',
            chainId: 56
        }
    };

    private web3Instances: Record<BlockchainType, Web3> = {} as Record<BlockchainType, Web3>;

    constructor() {
        // Initialize Web3 instances for EVM-compatible chains
        const evmChains: BlockchainType[] = ['ethereum', 'polygon', 'binanceSmartChain'];
        evmChains.forEach(chain => {
            this.web3Instances[chain] = new Web3(this.blockchainConfigs[chain].rpcUrl);
        });
    }

    async deployContract(
        blockchain: BlockchainType, 
        contractCode: string, 
        fromAddress: string
    ): Promise<string> {
        if (!this.web3Instances[blockchain]) {
            throw new Error(`Blockchain ${blockchain} not supported for deployment`);
        }

        const web3 = this.web3Instances[blockchain];
        
        try {
            const contract = new web3.eth.Contract(JSON.parse(contractCode));
            const deployedContract = await contract.deploy().send({
                from: fromAddress,
                gas: 1500000,
                gasPrice: '30000000000'
            });

            return deployedContract.options.address;
        } catch (error) {
            console.error(`Contract deployment failed for ${blockchain}:`, error);
            throw new Error(`Failed to deploy contract on ${blockchain}`);
        }
    }

    async getNetworkStatus(blockchain: BlockchainType): Promise<{
        connected: boolean;
        latestBlock: number;
        networkId: number;
    }> {
        if (!this.web3Instances[blockchain]) {
            return {
                connected: false,
                latestBlock: 0,
                networkId: 0
            };
        }

        const web3 = this.web3Instances[blockchain];

        try {
            const [latestBlock, networkId] = await Promise.all([
                web3.eth.getBlockNumber(),
                web3.eth.net.getId()
            ]);

            return {
                connected: true,
                latestBlock,
                networkId
            };
        } catch (error) {
            console.error(`Network status check failed for ${blockchain}:`, error);
            return {
                connected: false,
                latestBlock: 0,
                networkId: 0
            };
        }
    }
}

export default new BlockchainIntegrationService();