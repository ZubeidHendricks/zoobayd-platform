import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

interface SecurityVulnerability {
  type: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
}

const SecurityScannerDashboard: React.FC = () => {
  const [contractCode, setContractCode] = useState('');
  const [scanResults, setScanResults] = useState<{
    overallSecurityScore: number;
    vulnerabilities: SecurityVulnerability[];
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const performSecurityScan = async () => {
    setIsScanning(true);
    try {
      const response = await fetch('/api/security/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sourceCode: contractCode })
      });

      const results = await response.json();
      setScanResults(results);
    } catch (error) {
      console.error('Security scan failed', error);
    } finally {
      setIsScanning(false);
    }
  };

  const renderSecurityScore = () => {
    if (!scanResults) return null;

    const scoreClass = 
      scanResults.overallSecurityScore > 80 ? 'text-green-600' :
      scanResults.overallSecurityScore > 50 ? 'text-yellow-600' :
      'text-red-600';

    return (
      <div className="security-score">
        <h3>Overall Security Score</h3>
        <div className={`text-4xl font-bold ${scoreClass}`}>
          {scanResults.overallSecurityScore}%
        </div>
      </div>
    );
  };

  const renderVulnerabilities = () => {
    if (!scanResults?.vulnerabilities?.length) return null;

    const severityColors = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };

    return (
      <div className="vulnerabilities-list">
        <h3>Detected Vulnerabilities</h3>
        {scanResults.vulnerabilities.map((vuln, index) => (
          <div 
            key={index} 
            className="vulnerability-item border rounded p-3 mb-2"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold">{vuln.type}</h4>
              <span 
                className={`px-2 py-1 rounded text-white text-xs ${
                  severityColors[vuln.severity]
                }`}
              >
                {vuln.severity.toUpperCase()}
              </span>
            </div>
            <p className="mb-2">{vuln.description}</p>
            <div className="recommendation bg-gray-100 p-2 rounded">
              <strong>Recommendation:</strong> {vuln.recommendation}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="security-scanner-dashboard">
      <h2>Smart Contract Security Scanner</h2>

      <div className="code-editor-section">
        <MonacoEditor
          width="100%"
          height="400"
          language="solidity"
          theme="vs-dark"
          value={contractCode}
          onChange={setContractCode}
          options={{
            selectOnLineNumbers: true,
            automaticLayout: true
          }}
        />

        <button 
          onClick={performSecurityScan}
          disabled={isScanning || !contractCode}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isScanning ? 'Scanning...' : 'Perform Security Scan'}
        </button>
      </div>

      {scanResults && (
        <div className="scan-results mt-4">
          {renderSecurityScore()}
          {renderVulnerabilities()}
        </div>
      )}
    </div>
  );
};

export default SecurityScannerDashboard;