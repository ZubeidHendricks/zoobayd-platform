import { ethers } from 'ethers';
import solc from 'solc';

enum SecuritySeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

interface SecurityIssue {
  type: string;
  description: string;
  severity: SecuritySeverity;
  recommendation: string;
  line?: number;
}

interface ComplianceCheck {
  standard: string;
  passed: boolean;
  details?: string;
}

interface SecurityScanResult {
  overallSecurityScore: number;
  vulnerabilities: SecurityIssue[];
  complianceChecks: ComplianceCheck[];
  optimizationSuggestions: string[];
}

class ComprehensiveSecurityScanner {
  // Main security scanning method
  async scanSmartContract(sourceCode: string): Promise<SecurityScanResult> {
    const compilationResult = this.compileContract(sourceCode);
    
    return {
      overallSecurityScore: this.calculateSecurityScore(sourceCode),
      vulnerabilities: [
        ...this.detectVulnerabilities(sourceCode),
        ...this.checkCompilerWarnings(compilationResult)
      ],
      complianceChecks: this.performComplianceChecks(sourceCode),
      optimizationSuggestions: this.suggestOptimizations(sourceCode)
    };
  }

  // Compile contract and capture warnings
  private compileContract(sourceCode: string) {
    const input = {
      language: 'Solidity',
      sources: { 'contract.sol': { content: sourceCode } },
      settings: { 
        outputSelection: { '*': { '*': ['*'] } },
        optimizer: { enabled: true, runs: 200 }
      }
    };

    try {
      return JSON.parse(solc.compile(JSON.stringify(input)));
    } catch (error) {
      return { errors: [error.message] };
    }
  }

  // Vulnerability Detection Techniques
  private detectVulnerabilities(sourceCode: string): SecurityIssue[] {
    const vulnerabilities: SecurityIssue[] = [];

    // Reentrancy Check
    if (/\.call\.value\s*\(/.test(sourceCode)) {
      vulnerabilities.push({
        type: 'Reentrancy',
        description: 'Potential reentrancy vulnerability detected',
        severity: SecuritySeverity.CRITICAL,
        recommendation: 'Implement checks-effects-interactions pattern or use ReentrancyGuard'
      });
    }

    // Unchecked External Calls
    if (/\.call\s*\(/.test(sourceCode) && !/require\s*\(/.test(sourceCode)) {
      vulnerabilities.push({
        type: 'External Call',
        description: 'Unchecked external call without proper validation',
        severity: SecuritySeverity.HIGH,
        recommendation: 'Add explicit require statements to validate external calls'
      });
    }

    // Integer Overflow/Underflow
    if (/\+\+\s*\w+/.test(sourceCode) && !/SafeMath/.test(sourceCode)) {
      vulnerabilities.push({
        type: 'Integer Overflow',
        description: 'Potential integer overflow risk',
        severity: SecuritySeverity.HIGH,
        recommendation: 'Use SafeMath library or Solidity 0.8+ for automatic overflow checks'
      });
    }

    return vulnerabilities;
  }

  // Compiler Warning Analysis
  private checkCompilerWarnings(compilationResult: any): SecurityIssue[] {
    if (!compilationResult.errors) return [];

    return compilationResult.errors.map((error: string) => ({
      type: 'Compiler Warning',
      description: error,
      severity: SecuritySeverity.MEDIUM,
      recommendation: 'Review and address compiler warnings'
    }));
  }

  // Compliance Checks
  private performComplianceChecks(sourceCode: string): ComplianceCheck[] {
    const checks: ComplianceCheck[] = [
      {
        standard: 'ERC20',
        passed: /balanceOf/.test(sourceCode) && 
                /transfer/.test(sourceCode) && 
                /approve/.test(sourceCode),
        details: 'Check ERC20 standard method implementations'
      },
      {
        standard: 'Ownership',
        passed: /onlyOwner/.test(sourceCode),
        details: 'Verify access control mechanisms'
      },
      {
        standard: 'Pausable',
        passed: /whenNotPaused/.test(sourceCode),
        details: 'Check emergency stop functionality'
      }
    ];

    return checks;
  }

  // Gas Optimization Suggestions
  private suggestOptimizations(sourceCode: string): string[] {
    const suggestions: string[] = [];

    // Storage vs Memory usage
    if (/storage\s+\w+/.test(sourceCode)) {
      suggestions.push('Consider using memory instead of storage for temporary variables');
    }

    // Loop optimization
    if (/for\s*\(/.test(sourceCode)) {
      suggestions.push('Optimize loop iterations, consider breaking large loops');
    }

    // Unnecessary storage reads
    if (/(storage\.[a-zA-Z]+)/.test(sourceCode)) {
      suggestions.push('Minimize storage reads by caching values in memory');
    }

    return suggestions;
  }

  // Overall Security Score Calculation
  private calculateSecurityScore(sourceCode: string): number {
    const baseScore = 100;
    const vulnerabilities = this.detectVulnerabilities(sourceCode);

    // Deduct points based on vulnerability severity
    const deductionMap = {
      [SecuritySeverity.CRITICAL]: 40,
      [SecuritySeverity.HIGH]: 25,
      [SecuritySeverity.MEDIUM]: 10,
      [SecuritySeverity.LOW]: 5
    };

    const totalDeduction = vulnerabilities.reduce((total, vuln) => {
      return total + (deductionMap[vuln.severity] || 0);
    }, 0);

    return Math.max(0, baseScore - totalDeduction);
  }
}

export default new ComprehensiveSecurityScanner();