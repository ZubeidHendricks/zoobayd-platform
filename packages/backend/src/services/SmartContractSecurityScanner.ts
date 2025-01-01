import { ethers } from 'ethers';
import solc from 'solc';

interface SecurityIssue {
  type: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
}

interface SecurityScanResult {
  overallSecurityScore: number;
  vulnerabilities: SecurityIssue[];
  optimizationSuggestions: string[];
}

class SmartContractSecurityScanner {
  // Comprehensive security checks for Solidity smart contracts
  async scanContract(sourceCode: string): Promise<SecurityScanResult> {
    const issues: SecurityIssue[] = [];
    const optimizationSuggestions: string[] = [];

    // Compilation check
    const compilationResult = this.compileContract(sourceCode);
    if (!compilationResult.success) {
      issues.push({
        type: 'critical',
        description: 'Contract compilation failed',
        recommendation: 'Fix compilation errors before deployment'
      });
    }

    // Reentrancy vulnerability check
    if (this.detectReentrancy(sourceCode)) {
      issues.push({
        type: 'high',
        description: 'Potential Reentrancy Vulnerability',
        recommendation: 'Implement checks-effects-interactions pattern or use reentrancy guard'
      });
    }

    // Integer overflow/underflow check
    if (this.detectIntegerOverflow(sourceCode)) {
      issues.push({
        type: 'high',
        description: 'Potential Integer Overflow/Underflow',
        recommendation: 'Use SafeMath library or Solidity 0.8+ for automatic overflow checks'
      });
    }

    // Access control checks
    const accessControlIssues = this.checkAccessControl(sourceCode);
    issues.push(...accessControlIssues);

    // Gas optimization suggestions
    optimizationSuggestions.push(...this.suggestGasOptimizations(sourceCode));

    // Calculate overall security score
    const overallSecurityScore = this.calculateSecurityScore(issues);

    return {
      overallSecurityScore,
      vulnerabilities: issues,
      optimizationSuggestions
    };
  }

  private compileContract(sourceCode: string): { success: boolean, errors?: string[] } {
    try {
      const input = {
        language: 'Solidity',
        sources: { 'contract.sol': { content: sourceCode } },
        settings: { outputSelection: { '*': { '*': ['*'] } } }
      };

      const output = JSON.parse(solc.compile(JSON.stringify(input)));
      
      return {
        success: !output.errors,
        errors: output.errors
      };
    } catch (error) {
      return { success: false };
    }
  }

  private detectReentrancy(sourceCode: string): boolean {
    const reentrancyPatterns = [
      /external\.call/,
      /\.transfer\(/,
      /send\(/
    ];

    return reentrancyPatterns.some(pattern => pattern.test(sourceCode));
  }

  private detectIntegerOverflow(sourceCode: string): boolean {
    const overflowPatterns = [
      /unchecked\s*{/,
      /\+=/,
      /\-=/
    ];

    return overflowPatterns.some(pattern => pattern.test(sourceCode));
  }

  private checkAccessControl(sourceCode: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    // Check for missing access controls
    if (!/onlyOwner/.test(sourceCode)) {
      issues.push({
        type: 'medium',
        description: 'No explicit owner access control',
        recommendation: 'Implement Ownable pattern or role-based access control'
      });
    }

    return issues;
  }

  private suggestGasOptimizations(sourceCode: string): string[] {
    const suggestions: string[] = [];

    // Storage vs Memory usage
    if (/storage\s+\w+/.test(sourceCode)) {
      suggestions.push('Consider using memory instead of storage for temporary variables');
    }

    // Loop optimization
    if (/for\s*\(/.test(sourceCode)) {
      suggestions.push('Use for loops efficiently, consider breaking large loops');
    }

    return suggestions;
  }

  private calculateSecurityScore(issues: SecurityIssue[]): number {
    const weightMap = {
      'critical': 0,
      'high': 25,
      'medium': 50,
      'low': 75
    };

    const totalWeight = issues.reduce((score, issue) => {
      return score + weightMap[issue.type];
    }, 100);

    return Math.max(0, totalWeight);
  }
}

export default new SmartContractSecurityScanner();