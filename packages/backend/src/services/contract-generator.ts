import { OpenAI } from 'openai';
import { BlockchainType } from '../types/blockchain';

class ContractGeneratorService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async generateContract(
        blockchain: BlockchainType, 
        specifications: string
    ): Promise<string> {
        try {
            const prompt = `Generate a smart contract for ${blockchain} blockchain with the following specifications: ${specifications}`;
            
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert smart contract generator. Create secure, optimized contracts based on given specifications."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            });

            return response.choices[0].message.content || '';
        } catch (error) {
            console.error('Contract generation failed:', error);
            throw new Error('Failed to generate smart contract');
        }
    }

    // Security analysis of generated contract
    async analyzeContractSecurity(contract: string): Promise<{
        securityScore: number,
        potentialVulnerabilities: string[]
    }> {
        // Placeholder for AI-driven security analysis
        const vulnerabilities: string[] = [];
        
        // Basic checks (to be expanded)
        if (contract.includes('transfer(')) {
            vulnerabilities.push('Potential reentrancy risk');
        }

        return {
            securityScore: vulnerabilities.length > 0 ? 50 : 100,
            potentialVulnerabilities: vulnerabilities
        };
    }
}

export default new ContractGeneratorService();