import React, { useState } from 'react';
import axios from 'axios';

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

const SecurityAnalysisDashboard: React.FC = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [scanResult, setScanResult] = useState<SecurityScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScanContract = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<SecurityScanResult>(
        '/api/security/scan', 
        { sourceCode },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setScanResult(response.data);
    } catch (err) {
      setError('Failed to scan contract');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSeverityBadge = (severity: SecuritySeverity) => {
    const colorMap = {
      [SecuritySeverity.CRITICAL]: 'bg-red-600',
      [SecuritySeverity.HIGH]: 'bg-orange-600',
      [SecuritySeverity.MEDIUM]: 'bg-yellow-600',
      [SecuritySeverity.LOW]: 'bg-green-600'
    };

    return (
      <span className={`px-2 py-1 rounded text-white text-xs ${colorMap[severity]}`}>
        {severity.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="security-analysis-dashboard">
      <h2>Smart Contract Security Scanner</h2>

      <div className="contract-input">
        <textarea
          placeholder="Paste your smart contract source code here"
          value={sourceCode}
          onChange={(e) => setSourceCode(e.target.value)}
          rows={10}
          className="w-full p-2 border rounded"
        />
        <button 
          onClick={handleScanContract}
          disabled={!sourceCode || isLoading}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isLoading ? 'Scanning...' : 'Scan Contract'}
        </button>
      </div>

      {error && (
        <div className="error-message text-red-500 mt-2">
          {error}
        </div>
      )}

      {scanResult && (
        <div className="scan-results mt-4">
          <h3>Security Analysis Results</h3>

          <div className="overall-score">
            <h4>Overall Security Score</h4>
            <div 
              className={`text-4xl font-bold ${
                scanResult.overallSecurityScore > 80 ? 'text-green-600' :
                scanResult.overallSecurityScore > 50 ? 'text-yellow-600' :
                'text-red-600'
              }`}
            >
              {scanResult.overallSecurityScore}%
            </div>
          </div>

          <section className="vulnerabilities mt-4">
            <h4>Detected Vulnerabilities</h4>
            {scanResult.vulnerabilities.length === 0 ? (
              <p className="text-green-600">No vulnerabilities detected</p>
            ) : (
              <ul>
                {scanResult.vulnerabilities.map((vuln, index) => (
                  <li key={index} className="mb-2 p-2 border rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{vuln.type}</span>
                      {renderSeverityBadge(vuln.severity)}
                    </div>
                    <p>{vuln.description}</p>
                    <p className="text-sm text-gray-600">
                      <strong>Recommendation:</strong> {vuln.recommendation}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="compliance-checks mt-4">
            <h4>Compliance Checks</h4>
            <ul>
              {scanResult.complianceChecks.map((check, index) => (
                <li key={index} className="flex justify-between items-center mb-2">
                  <span>{check.standard}</span>
                  <span 
                    className={`px-2 py-1 rounded text-white text-xs ${
                      check.passed ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  >
                    {check.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="optimization-suggestions mt-4">
            <h4>Optimization Suggestions</h4>
            <ul>
              {scanResult.optimizationSuggestions.map((suggestion, index) => (
                <li key={index} className="mb-2 p-2 border rounded bg-gray-50">
                  {suggestion}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
};

export default SecurityAnalysisDashboard;