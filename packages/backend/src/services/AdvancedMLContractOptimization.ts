import * as tf from '@tensorflow/tfjs-node';
import { OpenAI } from 'openai';
import { AdvancedBlockchainType } from './ExtendedBlockchainIntegration';

interface ContractOptimizationRequest {
  sourceCode: string;
  blockchain: AdvancedBlockchainType;
  optimizationObjectives?: {
    gasEfficiency?: boolean;
    securityEnhancement?: boolean;
    readability?: boolean;
  };
}

interface ContractOptimizationResult {
  optimizedCode: string;
  optimizationScore: number;
  recommendations: string[];
  potentialRisks: string[];
}

class AdvancedMLContractOptimization {
  private mlModel: tf.LayersModel | null = null;
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.initializeMLModel();
  }

  private async initializeMLModel() {
    try {
      this.mlModel = await tf.loadLayersModel('file://./ml-models/contract-optimization/model.json');
    } catch (error) {
      console.error('ML Model loading failed:', error);
    }
  }

  async optimizeContract(
    request: ContractOptimizationRequest
  ): Promise<ContractOptimizationResult> {
    // Extract contract features
    const features = this.extractContractFeatures(request.sourceCode);

    // ML-based optimization prediction
    const optimizationPrediction = this.predictOptimization(features);

    // AI-powered code optimization
    const optimizedCode = await this.generateOptimizedCode(
      request.sourceCode, 
      request.blockchain,
      request.optimizationObjectives
    );

    return {
      optimizedCode,
      optimizationScore: optimizationPrediction.score,
      recommendations: optimizationPrediction.recommendations,
      potentialRisks: this.identifyPotentialRisks(optimizedCode)
    };
  }

  private extractContractFeatures(code: string): number[] {
    return [
      code.split('\n').length, // Line count
      (code.match(/function/g) || []).length, // Function count
      (code.match(/storage/g) || []).length, // Storage operations
      (code.match(/require\s*\(/g) || []).length, // Validation checks
      (code.match(/\.call\s*\(/g) || []).length // External calls
    ];
  }

  private predictOptimization(features: number[]): {
    score: number;
    recommendations: string[];
  } {
    if (!this.mlModel) {
      // Fallback to basic optimization scoring
      return this.basicOptimizationScoring(features);
    }

    const inputTensor = tf.tensor2d([features]);
    const prediction = this.mlModel.predict(inputTensor) as tf.Tensor;
    const predictionData = prediction.dataSync();

    return {
      score: predictionData[0] * 100,
      recommendations: this.generateRecommendations(predictionData)
    };
  }

  private async generateOptimizedCode(
    originalCode: string,
    blockchain: AdvancedBlockchainType,
    optimizationObjectives?: ContractOptimizationRequest['optimizationObjectives']
  ): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert blockchain smart contract optimizer."
        },
        {
          role: "user",
          content: `Optimize this ${blockchain} smart contract:
          Objectives: ${JSON.stringify(optimizationObjectives)}
          
          Original Code:
          ${originalCode}`
        }
      ]
    });

    return response.choices[0].message.content || originalCode;
  }

  private basicOptimizationScoring(features: number[]): {
    score: number;
    recommendations: string[];
  } {
    const lineCount = features[0];
    const functionCount = features[1];
    const storageOps = features[2];

    const score = Math.max(0, 100 - (lineCount / 10 + functionCount * 5 + storageOps * 10));

    return {
      score,
      recommendations: [
        'Reduce function complexity',
        'Minimize storage operations',
        'Use memory instead of storage'
      ]
    };
  }

  private generateRecommendations(predictionData: Float32Array): string[] {
    const recommendations: string[] = [];

    if (predictionData[1] < 0.5) recommendations.push('Improve gas efficiency');
    if (predictionData[2] < 0.5) recommendations.push('Enhance security mechanisms');

    return recommendations;
  }

  private identifyPotentialRisks(code: string): string[] {
    const risks: string[] = [];

    if (/\.call\.value\s*\(/.test(code)) {
      risks.push('Potential reentrancy vulnerability');
    }

    if (/transfer\s*\(msg\.sender\s*,/.test(code)) {
      risks.push('Unchecked external call');
    }

    return risks;
  }
}

export default AdvancedMLContractOptimization;