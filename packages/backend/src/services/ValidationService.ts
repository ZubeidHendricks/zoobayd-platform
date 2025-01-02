import { z } from 'zod';
import { ContractType, BlockchainNetwork } from '../types/ContractTypes';

class ValidationService {
  // Contract Requirements Validation Schema
  private contractRequirementsSchema = z.object({
    projectName: z.string().min(3, "Project name must be at least 3 characters"),
    contractType: z.nativeEnum(ContractType),
    targetNetwork: z.nativeEnum(BlockchainNetwork),
    requirements: z.object({
      tokenName: z.string().optional(),
      symbol: z.string().optional().refine(
        (symbol) => symbol ? symbol.length <= 5 : true, 
        { message: "Symbol must be 5 characters or less" }
      ),
      initialSupply: z.number().positive().optional(),
      mintable: z.boolean().optional(),
      burnable: z.boolean().optional(),
      pausable: z.boolean().optional()
    }).optional()
  });

  // Validate Contract Generation Request
  validateContractRequest(request: any) {
    try {
      return this.contractRequirementsSchema.parse(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }));
        
        throw new ValidationError('Invalid contract request', formattedErrors);
      }
      throw error;
    }
  }

  // Smart Contract Code Validation
  validateSmartContractCode(code: string) {
    const validationRules = [
      this.checkContractStructure(code),
      this.checkSecurityPatterns(code),
      this.checkGasOptimization(code)
    ];

    const validationResults = validationRules.filter(result => !result.passed);

    return {
      isValid: validationResults.length === 0,
      errors: validationResults
    };
  }

  private checkContractStructure(code: string) {
    const hasConstructor = /constructor\s*\(/.test(code);
    const hasMainFunction = /function\s+\w+\s*\(/.test(code);

    return {
      passed: hasConstructor && hasMainFunction,
      message: 'Invalid contract structure'
    };
  }

  private checkSecurityPatterns(code: string) {
    const potentialVulnerabilities = [
      { pattern: /\.call\.value\s*\(/, message: 'Potential reentrancy vulnerability' },
      { pattern: /transfer\s*\(\s*msg\.sender\s*,/, message: 'Possible external call without checks' }
    ];

    const foundVulnerabilities = potentialVulnerabilities.filter(vuln => vuln.pattern.test(code));

    return {
      passed: foundVulnerabilities.length === 0,
      vulnerabilities: foundVulnerabilities
    };
  }

  private checkGasOptimization(code: string) {
    const gasIntensiveOperations = [
      { pattern: /storage\s+\w+/, message: 'Excessive storage operations' },
      { pattern: /for\s*\(\s*uint\s+i\s*=\s*0\s*;\s*i\s*<\s*array\.length\s*;\s*i\+\+/, message: 'Potential gas-intensive loop' }
    ];

    const foundIssues = gasIntensiveOperations.filter(op => op.pattern.test(code));

    return {
      passed: foundIssues.length === 0,
      gasOptimizationIssues: foundIssues
    };
  }
}

class ValidationError extends Error {
  public details: any[];

  constructor(message: string, details: any[]) {
    super(message);
    this.details = details;
    this.name = 'ValidationError';
  }
}

export { 
  ValidationService, 
  ValidationError 
};