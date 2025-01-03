import * as tf from '@tensorflow/tfjs-node';
import axios from 'axios';

interface ContractFeatures {
    complexity: number;
    lineCount: number;
    functionCount: number;
    modifierCount: number;
    blockchainType: string;
    domain: string;
}

interface OptimizationRecommendation {
    score: number;
    suggestions: string[];
    potentialGasSavings: number;
}

class MLContractOptimizerService {
    private model: tf.Sequential | null = null;

    constructor() {
        this.initializeModel();
    }

    private async initializeModel() {
        try {
            // Create a simple sequential model
            this.model = tf.sequential();

            // Add layers
            this.model.add(tf.layers.dense({
                inputShape: [6],  // Number of input features
                units: 64,
                activation: 'relu'
            }));

            this.model.add(tf.layers.dense({
                units: 32,
                activation: 'relu'
            }));

            this.model.add(tf.layers.dense({
                units: 1,  // Optimization score
                activation: 'linear'
            }));

            // Compile the model
            this.model.compile({
                optimizer: 'adam',
                loss: 'meanSquaredError'
            });
        } catch (error) {
            console.error('ML Model initialization failed:', error);
        }
    }

    async extractContractFeatures(contractCode: string): Promise<ContractFeatures> {
        // Basic feature extraction
        return {
            complexity: this.calculateComplexity(contractCode),
            lineCount: contractCode.split('\n').length,
            functionCount: (contractCode.match(/function\s+\w+/g) || []).length,
            modifierCount: (contractCode.match(/modifier\s+\w+/g) || []).length,
            blockchainType: this.detectBlockchainType(contractCode),
            domain: this.detectDomain(contractCode)
        };
    }

    private calculateComplexity(contractCode: string): number {
        // Complexity based on cyclomatic complexity
        const conditionalStatements = (
            contractCode.match(/if\s*\(|else\s*{|for\s*\(|while\s*\(/g) || 
            []
        ).length;

        return Math.min(10, conditionalStatements);
    }

    private detectBlockchainType(contractCode: string): string {
        if (contractCode.includes('pragma solidity')) return 'ethereum';
        if (contractCode.includes('near')) return 'near';
        if (contractCode.includes('flow')) return 'flow';
        return 'unknown';
    }

    private detectDomain(contractCode: string): string {
        const domainKeywords: {[key: string]: string[]} = {
            defi: ['token', 'liquidity', 'swap', 'stake'],
            nft: ['mint', 'transfer', 'tokenURI'],
            gaming: ['player', 'game', 'reward'],
            insurance: ['claim', 'premium', 'policy']
        };

        for (const [domain, keywords] of Object.entries(domainKeywords)) {
            if (keywords.some(keyword => contractCode.toLowerCase().includes(keyword))) {
                return domain;
            }
        }

        return 'general';
    }

    async optimizeContract(contractCode: string): Promise<OptimizationRecommendation> {
        try {
            const features = await this.extractContractFeatures(contractCode);

            // Convert features to tensor
            const featureTensor = tf.tensor2d([
                [
                    features.complexity,
                    features.lineCount,
                    features.functionCount,
                    features.modifierCount,
                    this.encodeBlockchainType(features.blockchainType),
                    this.encodeDomain(features.domain)
                ]
            ]);

            // Predict optimization score
            const predictionTensor = this.model!.predict(featureTensor) as tf.Tensor;
            const optimizationScore = predictionTensor.dataSync()[0];

            // Generate optimization suggestions
            const suggestions = this.generateOptimizationSuggestions(features);

            // Estimate potential gas savings
            const gasSavings = this.estimateGasSavings(features);

            return {
                score: optimizationScore,
                suggestions,
                potentialGasSavings: gasSavings
            };
        } catch (error) {
            console.error('Contract optimization failed:', error);
            return {
                score: 0,
                suggestions: ['Unable to generate optimization recommendations'],
                potentialGasSavings: 0
            };
        }
    }

    private encodeBlockchainType(type: string): number {
        const encodings: {[key: string]: number} = {
            'ethereum': 1,
            'near': 2,
            'flow': 3,
            'unknown': 0
        };
        return encodings[type] || 0;
    }

    private encodeDomain(domain: string): number {
        const encodings: {[key: string]: number} = {
            'defi': 1,
            'nft': 2,
            'gaming': 3,
            'insurance': 4,
            'general': 0
        };
        return encodings[domain] || 0;
    }

    private generateOptimizationSuggestions(features: ContractFeatures): string[] {
        const suggestions: string[] = [];

        if (features.lineCount > 200) {
            suggestions.push('Contract is too long. Consider breaking it into smaller, modular contracts.');
        }

        if (features.complexity > 7) {
            suggestions.push('High cyclomatic complexity. Refactor to reduce conditional statements.');
        }

        if (features.functionCount > 10) {
            suggestions.push('Too many functions. Consider consolidating or splitting into separate contracts.');
        }

        return suggestions;
    }

    private estimateGasSavings(features: ContractFeatures): number {
        // Basic gas estimation logic
        const baseGasCost = 21000;
        const complexityMultiplier = features.complexity * 1000;
        const functionOverheadCost = features.functionCount * 500;

        return Math.max(0, baseGasCost - complexityMultiplier - functionOverheadCost);
    }
}

export default new MLContractOptimizerService();