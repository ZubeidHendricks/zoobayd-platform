import { OpenAI } from 'openai';
import { z } from 'zod';

const ContractSpecificationSchema = z.object({
  projectName: z.string().min(3, "Project name must be at least 3 characters"),
  contractType: z.enum(['token', 'nft', 'defi', 'governance']),
  blockchain: z.string(),
  features: z.array(z.string()).optional(),
  complexityLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  requirements: z.record(z.string(), z.any()).optional()
});

class AIEnhancedContractSpecification {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async convertNaturalLanguageToSpecification(
    description: string
  ): Promise<z.infer<typeof ContractSpecificationSchema>> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Convert natural language project descriptions into structured blockchain contract specifications"
          },
          {
            role: "user",
            content: `Convert this project description into a structured specification:
            ${description}`
          }
        ]
      });

      const specificationText = response.choices[0].message.content || '{}';
      const parsedSpecification = JSON.parse(specificationText);

      return ContractSpecificationSchema.parse(parsedSpecification);
    } catch (error) {
      throw new Error(`Specification generation failed: ${error.message}`);
    }
  }

  async generateContractArchitecture(
    specification: z.infer<typeof ContractSpecificationSchema>
  ): Promise<{
    architecture: string;
    recommendedPatterns: string[];
    potentialChallenges: string[];
  }> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Provide detailed blockchain contract architecture recommendations"
        },
        {
          role: "user",
          content: `Generate contract architecture for:
          ${JSON.stringify(specification)}`
        }
      ]
    });

    const architectureText = response.choices[0].message.content || '';
    
    return {
      architecture: architectureText,
      recommendedPatterns: this.extractRecommendedPatterns(architectureText),
      potentialChallenges: this.identifyPotentialChallenges(architectureText)
    };
  }

  private extractRecommendedPatterns(text: string): string[] {
    const patterns = [
      'Factory Pattern',
      'Proxy Pattern',
      'Access Control',
      'Upgradeable Contract',
      'Pull Over Push'
    ];

    return patterns.filter(pattern => 
      text.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  private identifyPotentialChallenges(text: string): string[] {
    const challenges = [
      'Scalability limitations',
      'Gas cost optimization',
      'Security vulnerabilities',
      'Regulatory compliance',
      'Cross-chain interoperability'
    ];

    return challenges.filter(challenge => 
      text.toLowerCase().includes(challenge.toLowerCase())
    );
  }
}

export default new AIEnhancedContractSpecification();