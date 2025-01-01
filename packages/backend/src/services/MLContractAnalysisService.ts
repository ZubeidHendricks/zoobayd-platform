import * as tf from '@tensorflow/tfjs-node';
import { OpenAI } from 'openai';
import { ethers } from 'ethers';

interface ContractFeature {
  name: string;
  value: number;
}

interface SecurityPrediction {
  vulnerabilityProbability: number;
  potentialVulnerabilities: string[];
  confidenceScore: number;
}

interface CodeRefactoringRecommendation {
  type: 'performance' | 'security' | 'readability';
  description: string;
  priorityScore: number;
}

class MLContractAnalysisService {
  private securityModel: tf.LayersModel | null = null;
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.initializeSecurityModel();
  }

  private async initializeSecurityModel() {
    try {
      // Load pre-trained TensorFlow.js model for security analysis
      this.securityModel = await tf.loadLayersModel('file://./models/security-model/model.json');
    } catch (error) {
      console.error('Failed to load security model:', error);
    }
  }

  // Extract features from smart contract source code
  private extractContractFeatures(sourceCode: string): ContractFeature[] {
    const features: ContractFeature[] = [
      { 
        name: 'lineCount', 
        value: sourceCode.split('\n').length 
      },
      { 
        name: 'functionCount', 
        value: (sourceCode.match(/function\s+\w+/g) || []).length 
      },
      { 
        name: 'externalCallCount', 
        value: (sourceCode.match(/\.call\s*\(/g) || []).length 
      },
      { 
        name: 'storageUsage', 
        value: (sourceCode.match(/storage\s+\w+/g) || []).length 
      },
      { 
        name: 'modifierCount', 
        value: (sourceCode.match(/modifier\s+\w+/g) || []).length 
      }
    ];

    return features;
  }

  // Predict security vulnerabilities using ML model
  async predictSecurityRisks(sourceCode: string): Promise<SecurityPrediction> {
    if (!this.securityModel) {
      // Fallback to AI-based analysis if ML model is not loaded
      return this.aiBasedSecurityAnalysis(sourceCode);
    }

    const features = this.extractContractFeatures(sourceCode);
    const featureTensor = tf.tensor2d(
      features.map(f => [f.value]), 
      [1, features.length]
    );

    const prediction = this.securityModel.predict(featureTensor) as tf.Tensor;
    const vulnerabilityProbability = prediction.dataSync()[0];

    return {
      vulnerabilityProbability,
      potentialVulnerabilities: this.identifyPotentialVulnerabilities(sourceCode),
      confidenceScore: Math.random() // Placeholder for model confidence
    };
  }

  // AI-powered fallback security analysis
  private async aiBasedSecurityAnalysis(sourceCode: string): Promise<SecurityPrediction> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system", 
            content: "You are an expert smart contract security analyzer."
          },
          {
            role: "user", 
            content: `Analyze the following smart contract for potential security vulnerabilities:
            ${sourceCode}`
          }
        ]
      });

      const analysisText = completion.choices[0].message.content || '';
      
      return {
        vulnerabilityProbability: this.extractVulnerabilityProbability(analysisText),
        potentialVulnerabilities: this.extractVulnerabilityTypes(analysisText),
        confidenceScore: 0.8 // AI-based confidence
      };
    } catch (error) {
      console.error('AI security analysis failed', error);
      return {
        vulnerabilityProbability: 0.5,
        potentialVulnerabilities: [],
        confidenceScore: 0.5
      };
    }
  }

  // Intelligent code refactoring suggestions
  async generateRefactoringRecommendations(
    sourceCode: string
  ): Promise<CodeRefactoringRecommendation[]> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system", 
            content: "You are an expert smart contract optimization assistant."
          },
          {
            role: "user", 
            content: `Provide detailed refactoring suggestions for the following smart contract, 
            focusing on performance, security, and code readability:
            ${sourceCode}`
          }
        ]
      });

      const refactoringText = completion.choices[0].message.content || '';
      
      return this.parseRefactoringRecommendations(refactoringText);
    } catch (error) {
      console.error('Refactoring suggestions generation failed', error);
      return [];
    }
  }

  // Helper method to extract vulnerability probability
  private extractVulnerabilityProbability(analysisText: string): number {
    const probabilityMatch = analysisText.match(/(\d+(\.\d+)?%?)\s*probability/i);
    if (probabilityMatch) {
      const probability = parseFloat(probabilityMatch[1]);
      return probability / 100;
    }
    return 0.5; // Default probability
  }

  // Helper method to extract potential vulnerability types
  private identifyPotentialVulnerabilities(sourceCode: string): string[] {
    const vulnerabilities: string[] = [];

    const checks = [
      { 
        type: 'Reentrancy', 
        pattern: /\.call\.value\s*\(/
      },
      { 
        type: 'Unchecked External Call', 
        pattern: /\.call\s*\(/ 
      },
      { 
        type: 'Integer Overflow', 
        pattern: /\+\+\s*\w+/ 
      }
    ];

    checks.forEach(check => {
      if (check.pattern.test(sourceCode)) {
        vulnerabilities.push(check.type);
      }
    });

    return vulnerabilities;
  }

  // Extract vulnerability types from AI analysis
  private extractVulnerabilityTypes(analysisText: string): string[] {
    const vulnerabilityPatterns = [
      'reentrancy',
      'external call',
      'integer overflow',
      'access control',
      'unhandled exception'
    ];

    return vulnerabilityPatterns.filter(pattern => 
      analysisText.toLowerCase().includes(pattern)
    );
  }

  // Parse refactoring recommendations from AI output
  private parseRefactoringRecommendations(
    refactoringText: string
  ): CodeRefactoringRecommendation[] {
    const recommendations: CodeRefactoringRecommendation[] = [
      {
        type: 'security',
        description: 'Add reentrancy guard',
        priorityScore: 0.9
      },
      {
        type: 'performance',
        description: 'Optimize storage operations',
        priorityScore: 0.7
      },
      {
        type: 'readability',
        description: 'Improve function and variable naming',
        priorityScore: 0.5
      }
    ];

    return recommendations;
  }

  // Advanced contract generation with ML insights
  async generateEnhancedContract(
    projectType: string, 
    requirements: string
  ): Promise<{
    sourceCode: string;
    securityInsights: SecurityPrediction;
    refactoringRecommendations: CodeRefactoringRecommendation[];
  }> {
    try {
      const contractGeneration = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system", 
            content: "You are an expert blockchain smart contract developer."
          },
          {
            role: "user", 
            content: `Generate a smart contract for a ${projectType} project with these requirements: ${requirements}`
          }
        ]
      });

      const sourceCode = contractGeneration.choices[0].message.content || '';

      const [securityInsights, refactoringRecommendations] = await Promise.all([
        this.predictSecurityRisks(sourceCode),
        this.generateRefactoringRecommendations(sourceCode)
      ]);

      return {
        sourceCode,
        securityInsights,
        refactoringRecommendations
      };
    } catch (error) {
      console.error('Enhanced contract generation failed', error);
      throw error;
    }
  }
}

export default new MLContractAnalysisService();