import { OpenAI } from 'openai';
import { ContractType, BlockchainNetwork } from '../types/ContractTypes';

interface GenerationContext {
  projectName: string;
  contractType: ContractType;
  network: BlockchainNetwork;
  requirements: Record<string, any>;
}

interface OptimizationSuggestion {
  type: 'security' | 'performance' | 'readability';
  description: string;
  priority: 'low' | 'medium' | 'high';
}

class AIEnhancedGenerationService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async enhanceContractGeneration(
    originalCode: string, 
    context: GenerationContext
  ): Promise<{
    enhancedCode: string;
    optimizationSuggestions: OptimizationSuggestion[];
  }> {
    // Comprehensive AI-powered contract enhancement
    const enhancementPrompt = this.createEnhancementPrompt(originalCode, context);
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert blockchain smart contract developer and optimizer."
        },
        {
          role: "user",
          content: enhancementPrompt
        }
      ]
    });

    const enhancedCode = response.choices[0].message.content || originalCode;
    const optimizationSuggestions = this.extractOptimizationSuggestions(enhancedCode);

    return {
      enhancedCode,
      optimizationSuggestions
    };
  }

  private createEnhancementPrompt(
    originalCode: string, 
    context: GenerationContext
  ): string {
    return `Enhance and optimize this ${context.contractType} smart contract for ${context.network}:

Context:
- Project Name: ${context.projectName}
- Contract Type: ${context.contractType}
- Network: ${context.network}
- Requirements: ${JSON.stringify(context.requirements)}

Original Contract Code:
${originalCode}

Enhancement Instructions:
1. Improve security mechanisms
2. Optimize gas efficiency
3. Enhance readability
4. Add best practice implementations
5. Ensure network-specific optimizations`;
  }

  private extractOptimizationSuggestions(code: string): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // Security optimization detection
    if (!/onlyOwner/.test(code)) {
      suggestions.push({
        type: 'security',
        description: 'Add access control modifier for critical functions',
        priority: 'high'
      });
    }

    // Performance optimization detection
    if (/storage\s+\w+/.test(code)) {
      suggestions.push({
        type: 'performance',
        description: 'Optimize storage operations, consider using memory',
        priority: 'medium'
      });
    }

    // Readability improvements
    if (!/\/\/\s*@dev/.test(code)) {
      suggestions.push({
        type: 'readability',
        description: 'Add natspec comments for better documentation',
        priority: 'low'
      });
    }

    return suggestions;
  }

  async generateComprehensiveExample(
    contractType: ContractType, 
    network: BlockchainNetwork
  ): Promise<{
    code: string;
    bestPractices: string[];
    potentialChallenges: string[];
  }> {
    const examplePrompt = `Generate a comprehensive, production-ready ${contractType} smart contract for ${network} 
    that demonstrates:
    1. Best security practices
    2. Gas optimization techniques
    3. Extensibility
    4. Clear documentation
    5. Network-specific considerations`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert blockchain smart contract architect."
        },
        {
          role: "user",
          content: examplePrompt
        }
      ]
    });

    const generatedCode = response.choices[0].message.content || '';

    return {
      code: generatedCode,
      bestPractices: this.extractBestPractices(generatedCode),
      potentialChallenges: this.identifyPotentialChallenges(generatedCode)
    };
  }

  private extractBestPractices(code: string): string[] {
    const bestPractices: string[] = [];

    if (/ReentrancyGuard/.test(code)) {
      bestPractices.push('Implemented reentrancy protection');
    }

    if (/Pausable/.test(code)) {
      bestPractices.push('Added emergency stop mechanism');
    }

    if (/AccessControl/.test(code)) {
      bestPractices.push('Implemented role-based access control');
    }

    return bestPractices;
  }

  private identifyPotentialChallenges(code: string): string[] {
    const challenges: string[] = [];

    if (/\.call\s*\(/.test(code)) {
      challenges.push('Potential external call complexity');
    }

    if (/for\s*\(\s*uint/.test(code)) {
      challenges.push('Possible gas-intensive iteration');
    }

    return challenges;
  }
}

export { 
  AIEnhancedGenerationService, 
  GenerationContext, 
  OptimizationSuggestion 
};