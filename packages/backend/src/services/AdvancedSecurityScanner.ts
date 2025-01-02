import { ethers } from 'ethers';
import solc from 'solc';

enum SecuritySeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

interface SecurityVulnerability {
  type: string;
  description: string;
  severity: SecuritySeverity;
  line?: number;
  recommendation: string;
}

class AdvancedSecurityScanner {
  // Comprehensive contract vulnerability analysis
  analyzeContract(sourceCode: string): {
    overallSecurityScore: number;
    vulnerabilities: SecurityVulnerability[];
  } {
    const compilationResult = this.compileContract(sourceCode);
    const vulnerabilities = [
      ...this.detectReentrancyVulnerabilities(sourceCode),
      ...this.detectAccessControlIssues(sourceCode),
      ...this.findExternalCallRisks(sourceCode),
      ...this.checkForIntegerOverflow(sourceCode),
      ...this.validateInputChecks(sourceCode)
    ];

    return {
      overallSecurityScore: this.calculateSecurityScore(vulnerabilities),
      vulnerabilities
    };
  }

  // Compile contract and capture potential compilation errors
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
      return solc.compile(JSON.stringify(input));
    } catch (error) {
      return { errors: [error.message] };
    }
  }

  // Detect reentrancy vulnerabilities
  private detectReentrancyVulnerabilities(sourceCode: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];

    // Check for unchecked external calls
    if (/\.call\.value\s*\(/.test(sourceCode)) {
      vulnerabilities.push({
        type: 'Reentrancy',
        description: 'Potential reentrancy vulnerability detected',
        severity: SecuritySeverity.CRITICAL,
        recommendation: 'Implement checks-effects-interactions pattern or use ReentrancyGuard'
      });
    }

    return vulnerabilities;
  }

  // Check for access control issues
  private detectAccessControlIssues(sourceCode: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];

    if (!/onlyOwner/.test(sourceCode)) {
      vulnerabilities.push({
        type: 'Access Control',
        description: 'Missing access control mechanisms',
        severity: SecuritySeverity.HIGH,
        recommendation: 'Implement role-based access control using Ownable or AccessControl patterns'
      });
    }

    return vulnerabilities;
  }

  // Find external call risks
  private findExternalCallRisks(sourceCode: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];

    if (/\.call\s*\(/.test(sourceCode) && !/require\s*\(/.test(sourceCode)) {
      vulnerabilities.push({
        type: 'External Call',
        description: 'Unchecked external call without proper validation',
        severity: SecuritySeverity.HIGH,
        recommendation: 'Add explicit require statements to validate external calls'
      });
    }

    return vulnerabilities;
  }

  // Check for integer overflow potential
  private checkForIntegerOverflow(sourceCode: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];

    if (/\+\+\s*\w+/.test(sourceCode) && !/SafeMath/.test(sourceCode)) {
      vulnerabilities.push({
        type: 'Integer Overflow',
        description: 'Potential integer overflow risk',
        severity: SecuritySeverity.MEDIUM,
        recommendation: 'Use SafeMath library or Solidity 0.8+ for automatic overflow checks'
      });
    }

    return vulnerabilities;
  }

  // Validate input parameter checks
  private validateInputChecks(sourceCode: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];

    if (!/require\s*\(.*\)/.test(sourceCode)) {
      vulnerabilities.push({
        type: 'Input Validation',
        description: 'Lack of comprehensive input parameter validation',
        severity: SecuritySeverity.MEDIUM,
        recommendation: 'Add require statements to validate input parameters'
      });
    }

    return vulnerabilities;
  }

  // Calculate overall security score
  private calculateSecurityScore(vulnerabilities: SecurityVulnerability[]): number {
    const severityWeights = {
      [SecuritySeverity.CRITICAL]: 40,
      [SecuritySeverity.HIGH]: 25,
      [SecuritySeverity.MEDIUM]: 10,
      [SecuritySeverity.LOW]: 5
    };

    const totalDeduction = vulnerabilities.reduce((total, vuln) => {
      return total + (severityWeights[vuln.severity] || 0);
    }, 0);

    return Math.max(0, 100 - totalDeduction);
  }
}

export default new AdvancedSecurityScanner();