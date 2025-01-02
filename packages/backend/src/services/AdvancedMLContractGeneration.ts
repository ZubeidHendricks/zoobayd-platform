import { OpenAI } from 'openai';
import * as tf from '@tensorflow/tfjs-node';
import { BlockchainNetworkType, ContractType } from '../types/ContractTypes';

interface ContractGenerationRequest {
  type: ContractType;
  network: BlockchainNetworkType;
  requirements: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
}

interface GeneratedContract {
  sourceCode: string;
  analysis: {
    securityScore: number;
    optimizationScore: number;
    complexityScore: number;
  };
  recommendations: string[];
  potentialVulnerabilities: string[];
}

class AdvancedMLContractGeneration {
  private openai: OpenAI;
  private mlModel: tf.LayersModel | null = null;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.initializeMLModel();
  }

  private async initializeMLModel() {
    try {
      this.mlModel = await tf.loadLayersModel('file://./ml-models/contract-generation-model/model.json');
    } catch (error) {
      console.error('ML Model loading failed:', error);
    }
  }

  async generateContract(request: ContractGenerationRequest): Promise<GeneratedContract> {
    // AI-powered contract generation
    const generatedCode = await this.generateCodeWithAI(request);
    
    // ML-based analysis
    const mlAnalysis = await this.performMLAnalysis(generatedCode);

    // AI-powered recommendations
    const recommendations = await this.generateRecommendations(generatedCode, request);

    return {
      sourceCode: generatedCode,
      analysis: mlAnalysis,
      recommendations,
      potentialVulnerabilities: this.identifyVulnerabilities(generatedCode)
    };
  }

  private async generateCodeWithAI(request: ContractGenerationRequest): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert blockchain smart contract developer."
        },
        {
          role: "user",
          content: `Generate a ${request.complexity} ${request.type} smart contract for ${request.network} blockchain. 
          Requirements: ${request.requirements}`
        }
      ]
    });

    return response.choices[0].message.content || '';
  }

  private async performMLAnalysis(code: string): Promise<{
    securityScore: number;
    optimizationScore: number;
    complexityScore: number;
  }> {
    if (!this.mlModel) {
      // Fallback to basic analysis if ML model not loaded
      return {
        securityScore: this.calculateSecurityScore(code),
        optimizationScore: this.calculateOptimizationScore(code),
        complexityScore: this.calculateComplexityScore(code)
      };
    }

    // Prepare input for ML model
    const features = this.extractContractFeatures(code);
    const inputTensor = tf.tensor2d([features]);

    // Perform ML prediction
    const prediction = this.mlModel.predict(inputTensor) as tf.Tensor;
    const predictionData = prediction.dataSync();

    return {
      securityScore: predictionData[0] * 100,
      optimizationScore: predictionData[1] * 100,
      complexityScore: predictionData[2] * 100
    };
  }

  private async generateRecommendations(
    code: string, 
    request: ContractGenerationRequest
  ): Promise<string[]> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert smart contract optimizer."
        },
        {
          role: "user",
          content: `Provide optimization recommendations for this ${request.type} contract:
          ${code}`
        }
      ]
    });

    return this.parseRecommendations(
      response.choices[0].message.content || ''
    );
  }

  private identifyVulnerabilities(code: string): string[] {
    const vulnerabilities: string[] = [];

    if (/\.call\.value\s*\(/.test(code)) {
      vulnerabilities.push('Potential Reentrancy Vulnerability');
    }

    if (/transfer\s*\(msg\.sender\s*,/.test(code)) {
      vulnerabilities.push('Unchecked External Call');
    }

    if (!/onlyOwner/.test(code)) {
      vulnerabilities.push('Missing Access Control');
    }

    return vulnerabilities;
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

  private calculateSecurityScore(code: string): number {
    const vulnerabilities = this.identifyVulnerabilities(code);
    return Math.max(0, 100 - (vulnerabilities.length * 20));
  }

  private calculateOptimizationScore(code: string): number {
    const storageOps = (code.match(/storage/g) || []).length;
    const functionCount = (code.match(/function/g) || []).length;
    
    return Math.max(0, 100 - (storageOps * 10 + functionCount * 5));
  }

  private calculateComplexityScore(code: string): number {
    const lineCount = code.split('\n').length;
    const functionCount = (code.match(/function/g) || []).length;
    
    return Math.min(100, (lineCount / 50) * (functionCount * 10));
  }

  private parseRecommendations(recommendationText: string): string[] {
    const recommendationPatterns = [
      'improve security',
      'optimize gas',
      'add access control',
      'reduce complexity',
      'use best practices'
    ];

    return recommendationPatterns.filter(rec => 
      recommendationText.toLowerCase().includes(rec)
    );
  }
}

export default AdvancedMLContractGeneration;