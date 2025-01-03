import { OpenAI } from 'openai';
import axios from 'axios';
import { BlockchainType } from '../types/blockchain';

interface ContractSpecification {
    domain: string;
    purpose: string;
    complexityLevel: 'simple' | 'moderate' | 'complex';
    complianceRequirements: string[];
    additionalConstraints?: string;
}

interface ContractAnalysisResult {
    securityScore: number;
    potentialVulnerabilities: string[];
    optimizationSuggestions: string[];
    complianceRisks: string[];
}

class AdvancedContractGeneratorService {
    private openai: OpenAI;
    private mlModelEndpoint: string;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.mlModelEndpoint = process.env.ML_MODEL_ENDPOINT || 'https://ml-api.zoobayd.com/contract-analysis';
    }

    async generateAdvancedContract(
        blockchain: BlockchainType, 
        specification: ContractSpecification
    ): Promise<{
        contractCode: string;
        analysis: ContractAnalysisResult;
    }> {
        try {
            // Enhanced prompt with more context
            const prompt = `
                Generate a ${specification.complexityLevel} smart contract for ${blockchain} blockchain 
                in the ${specification.domain} domain with the following requirements:
                - Purpose: ${specification.purpose}
                - Compliance Requirements: ${specification.complianceRequirements.join(', ')}
                ${specification.additionalConstraints ? `- Additional Constraints: ${specification.additionalConstraints}` : ''}
                
                Provide a production-ready implementation with extensive comments explaining 
                the rationale behind each critical section of the contract.
            `;

            // Generate contract using advanced AI
            const contractResponse = await this.openai.chat.completions.create({
                model: "gpt-4-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert smart contract generator with deep knowledge of blockchain security and best practices."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 2000
            });

            const contractCode = contractResponse.choices[0].message.content || '';

            // Perform multi-layered analysis
            const analysisResult = await this.analyzeContract(contractCode, blockchain);

            return {
                contractCode,
                analysis: analysisResult
            };
        } catch (error) {
            console.error('Advanced contract generation failed:', error);
            throw new Error('Failed to generate advanced smart contract');
        }
    }

    private async analyzeContract(
        contractCode: string, 
        blockchain: BlockchainType
    ): Promise<ContractAnalysisResult> {
        try {
            // Local AI-powered analysis
            const localAnalysis = this.performLocalAnalysis(contractCode);

            // ML Model external analysis
            const mlAnalysis = await this.callMLContractAnalysis(contractCode, blockchain);

            // Combine analyses
            return {
                securityScore: Math.min(
                    localAnalysis.securityScore, 
                    mlAnalysis.securityScore
                ),
                potentialVulnerabilities: [
                    ...localAnalysis.potentialVulnerabilities,
                    ...mlAnalysis.potentialVulnerabilities
                ],
                optimizationSuggestions: [
                    ...localAnalysis.optimizationSuggestions,
                    ...mlAnalysis.optimizationSuggestions
                ],
                complianceRisks: [
                    ...localAnalysis.complianceRisks,
                    ...mlAnalysis.complianceRisks
                ]
            };
        } catch (error) {
            console.error('Contract analysis failed:', error);
            return this.performLocalAnalysis(contractCode);
        }
    }

    private performLocalAnalysis(contractCode: string): ContractAnalysisResult {
        const vulnerabilities: string[] = [];
        const optimizations: string[] = [];
        const complianceRisks: string[] = [];

        // Basic pattern matching for common vulnerabilities
        if (contractCode.includes('transfer(')) {
            vulnerabilities.push('Potential Reentrancy Risk');
        }

        if (contractCode.includes('selfdestruct(')) {
            vulnerabilities.push('Potential Self-Destruction Vulnerability');
        }

        if (!contractCode.includes('require(')) {
            optimizations.push('Add input validation with require statements');
        }

        if (!contractCode.includes('modifier onlyOwner()')) {
            optimizations.push('Implement access control with onlyOwner modifier');
        }

        return {
            securityScore: Math.max(0, 100 - (vulnerabilities.length * 20)),
            potentialVulnerabilities: vulnerabilities,
            optimizationSuggestions: optimizations,
            complianceRisks: complianceRisks
        };
    }

    private async callMLContractAnalysis(
        contractCode: string, 
        blockchain: BlockchainType
    ): Promise<ContractAnalysisResult> {
        try {
            const response = await axios.post(this.mlModelEndpoint, {
                contract: contractCode,
                blockchain,
                analysisType: 'comprehensive'
            });

            return response.data;
        } catch (error) {
            console.error('ML Contract Analysis failed:', error);
            return {
                securityScore: 70,
                potentialVulnerabilities: [],
                optimizationSuggestions: [],
                complianceRisks: []
            };
        }
    }
}

export default new AdvancedContractGeneratorService();