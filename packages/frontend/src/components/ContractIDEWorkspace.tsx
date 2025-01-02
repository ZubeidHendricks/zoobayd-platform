import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

const ContractIDEWorkspace: React.FC = () => {
  const [code, setCode] = useState('');
  const [analysisResults, setAnalysisResults] = useState<{
    gasEstimation?: number;
    securityIssues?: string[];
    optimizationSuggestions?: string[];
  }>({});

  const handleCodeAnalysis = async () => {
    try {
      const response = await fetch('/api/contracts/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const results = await response.json();
      setAnalysisResults(results);
    } catch (error) {
      console.error('Contract analysis failed', error);
    }
  };

  return (
    <div className="contract-ide-workspace">
      <div className="code-editor">
        <MonacoEditor
          width="100%"
          height="500"
          language="solidity"
          theme="vs-dark"
          value={code}
          onChange={setCode}
        />
        <button onClick={handleCodeAnalysis}>
          Analyze Contract
        </button>
      </div>

      {analysisResults.securityIssues && (
        <div className="analysis-results">
          <h3>Analysis Insights</h3>
          <div className="gas-estimation">
            <strong>Estimated Gas Cost:</strong> 
            {analysisResults.gasEstimation?.toFixed(2)} ETH
          </div>

          {analysisResults.securityIssues.length > 0 && (
            <div className="security-issues">
              <h4>Security Issues</h4>
              <ul>
                {analysisResults.securityIssues.map((issue, index) => (
                  <li key={index} className="security-issue">
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysisResults.optimizationSuggestions && (
            <div className="optimization-suggestions">
              <h4>Optimization Suggestions</h4>
              <ul>
                {analysisResults.optimizationSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContractIDEWorkspace;