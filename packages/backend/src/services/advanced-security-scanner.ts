import crypto from 'crypto';
import { execSync } from 'child_process';

interface SecurityScanResult {
    overallScore: number;
    vulnerabilities: Vulnerability[];
    recommendations: string[];
}

interface Vulnerability {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    mitigation: string;
}

class AdvancedSecurityScannerService {
    private securityRules = [
        this.checkReentrancyVulnerability,
        this.checkUnprotectedSelfDestruct,
        this.checkAccessControlIssues,
        this.checkIntegerOverflow,
        this.checkExternalContractCalls
    ];

    async performComprehensiveScan(contractCode: string): Promise<SecurityScanResult> {
        const vulnerabilities: Vulnerability[] = [];
        const recommendations: string[] = [];

        // Run all security checks
        for (const rule of this.securityRules) {
            const result = rule(contractCode);
            if (result) {
                vulnerabilities.push(result);
            }
        }

        // Additional static analysis using external tools
        const staticAnalysisResults = await this.runStaticAnalysisTools(contractCode);
        vulnerabilities.push(...staticAnalysisResults);

        // Generate recommendations
        vulnerabilities.forEach(vuln => {
            recommendations.push(vuln.mitigation);
        });

        // Calculate overall security score
        const overallScore = this.calculateSecurityScore(vulnerabilities);

        return {
            overallScore,
            vulnerabilities,
            recommendations
        };
    }

    private checkReentrancyVulnerability(contractCode: string): Vulnerability | null {
        const reentrancyPatterns = [
            /transfer\s*\(\s*msg\.sender/,
            /call\.value\s*\(/,
            /transfer\s*\(\s*address\(this\)/
        ];

        const hasReentrancyRisk = reentrancyPatterns.some(pattern => pattern.test(contractCode));

        return hasReentrancyRisk ? {
            type: 'Reentrancy',
            severity: 'high',
            description: 'Potential reentrancy vulnerability detected',
            mitigation: 'Implement checks-effects-interactions pattern and use ReentrancyGuard'
        } : null;
    }

    private checkUnprotectedSelfDestruct(contractCode: string): Vulnerability | null {
        const selfDestructPattern = /selfdestruct\s*\(/;
        
        return selfDestructPattern.test(contractCode) ? {
            type: 'Unprotected Self-Destruct',
            severity: 'critical',
            description: 'Unprotected selfdestruct method can compromise contract',
            mitigation: 'Add onlyOwner modifier to selfdestruct method'
        } : null;
    }

    private checkAccessControlIssues(contractCode: string): Vulnerability | null {
        const missingAccessControlPatterns = [
            /function\s+\w+\s*\(\s*\)\s*public\s*{/,
            /function\s+\w+\s*\(\s*\)\s*external\s*{/
        ];

        const hasAccessControlIssues = missingAccessControlPatterns.some(
            pattern => pattern.test(contractCode)
        );

        return hasAccessControlIssues ? {
            type: 'Access Control',
            severity: 'medium',
            description: 'Missing access control on critical functions',
            mitigation: 'Implement role-based access control (RBAC)'
        } : null;
    }

    private checkIntegerOverflow(contractCode: string): Vulnerability | null {
        const overflowRiskPatterns = [
            /\+\+\s*\w+/,
            /\w+\s*\+=\s*\w+/
        ];

        const hasOverflowRisk = overflowRiskPatterns.some(
            pattern => pattern.test(contractCode)
        );

        return hasOverflowRisk ? {
            type: 'Integer Overflow',
            severity: 'high',
            description: 'Potential integer overflow vulnerability',
            mitigation: 'Use SafeMath library or Solidity 0.8+ arithmetic checks'
        } : null;
    }

    private checkExternalContractCalls(contractCode: string): Vulnerability | null {
        const externalCallPatterns = [
            /\.call\s*\(/,
            /\.delegatecall\s*\(/
        ];

        const hasUnsafeExternalCalls = externalCallPatterns.some(
            pattern => pattern.test(contractCode)
        );

        return hasUnsafeExternalCalls ? {
            type: 'External Contract Call',
            severity: 'medium',
            description: 'Potential risks with external contract calls',
            mitigation: 'Validate external contract addresses, use interface-based interactions'
        } : null;
    }

    private async runStaticAnalysisTools(contractCode: string): Promise<Vulnerability[]> {
        const vulnerabilities: Vulnerability[] = [];

        try {
            // Simulate running Slither (Solidity static analysis tool)
            const tempFile = this.createTempContractFile(contractCode);
            
            try {
                const slitherOutput = execSync(`slither ${tempFile}`).toString();
                
                // Parse Slither output for additional vulnerabilities
                if (slitherOutput.includes('high')) {
                    vulnerabilities.push({
                        type: 'Static Analysis',
                        severity: 'high',
                        description: 'Potential vulnerabilities detected by static analysis',
                        mitigation: 'Review and address issues reported by Slither'
                    });
            }
            } catch (toolError) {
                console.warn('Static analysis tool execution failed');
            }
        } catch (error) {
            console.error('Static analysis failed:', error);
        }

        return vulnerabilities;
    }

    private createTempContractFile(contractCode: string): string {
        const tempFileName = `contract_${crypto.randomBytes(16).toString('hex')}.sol`;
        const tempFilePath = `/tmp/${tempFileName}`;

        try {
            // Write contract to temp file
            execSync(`echo "${contractCode}" > ${tempFilePath}`);
            return tempFilePath;
        } catch (error) {
            console.error('Failed to create temp contract file:', error);
            throw error;
        }
    }

    private calculateSecurityScore(vulnerabilities: Vulnerability[]): number {
        const severityWeights = {
            'low': 10,
            'medium': 30,
            'high': 50,
            'critical': 70
        };

        const totalPenalty = vulnerabilities.reduce((penalty, vuln) => {
            return penalty + (severityWeights[vuln.severity] || 0);
        }, 0);

        return Math.max(0, 100 - totalPenalty);
    }
}

export default new AdvancedSecurityScannerService();