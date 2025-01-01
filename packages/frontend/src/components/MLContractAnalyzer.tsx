import React, { useState } from 'react';
import axios from 'axios';

interface SecurityPrediction {
  vulnerabilityProbability: number;
  potentialVulnerabilities: string[];
  confidenceScore: number;
}

interface CodeRefactoringRecommendation {
  type: 'performance' | 'security' | 'readability';
  description: string;
  priorityScore: number;
}

const MLContractAnalyzer: React.FC = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [analysisResult, setAnalysisResult] = useState<{
    securityInsights?: SecurityPrediction;
    refactoringRecommendations?: CodeRefactoringRecommendation[];
  }>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeContract = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await axios.post('/api/ml/analyze-contract', { 
        sourceCode 
      });

      setAnalysisResult({
        securityInsights: response.data.securityInsights,
        refactoringRecommendations: response.data.refactoringRecommendations
      });
    } catch (err) {
      setError('Contract analysis failed');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderSecurityRiskVisualization = () => {
    const { securityInsights } = analysisResult;
    if (!securityInsights) return null;

    const riskColor = securityInsights.vulnerabilityProbability > 0.7 
      ? 'text-red-600' 
      : securityInsights.vulnerabilityProbability > 0.3 
        ? 'text-yellow-600' 
        : 'text-green-600';

    return (
      <div className="security-risk-visualization">
        <h3>Security Risk Assessment</h3>
        <div className={`text-4xl font-bold ${riskColor}`}>
          {(securityInsights.vulnerabilityProbability * 100).toFixed(2)}%
        </div>
        <div className="mt-2">
          <strong>Potential Vulnerabilities:</strong>
          <ul>
            {securityInsights.potentialVulnerabilities.map((vuln, index) => (
              <li key={index} className="text-red-500">{vuln}</li>
            ))}
          </ul>
        </div>
        <div className="mt-2">
          <strong>Confidence Score:</strong> {(securityInsights.confidenceScore * 100).toFixed(2)}%
        </div>
      </div>
    );
  };

  const renderRefactoringRecommendations = () => {
    const { refactoringRecommendations } = analysisResult;
    if (!refactoringRecommendations) return null;

    return (
      <div className="refactoring-recommendations">
        <h3>Code Optimization Suggestions</h3>
        {refactoringRecommendations.map((rec, index) => (
          <div 
            key={index} 
            className={`recommendation ${
              rec.priorityScore > 0.7 ? 'bg-red-100' : 
              rec.priorityScore > 0.4 ? 'bg-yellow-100' : 
              'bg-green-100'
            } p-3 mb-2 rounded`}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold capitalize">{rec.type}</span>
              <span className="text-sm">
                Priority: {(rec.priorityScore * 100).toFixed(0)}%
              </span>
            </div>
            <p>{rec.description}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="ml-contract-analyzer">
      <h2>AI-Powered Smart Contract Analysis</h2>

      <div className="source-code-input">
        <textarea
          placeholder="Paste your smart contract source code here"
          value={sourceCode}
          onChange={(e) => setSourceCode(e.target.value)}
          rows={10}
          className="w-full p-2 border rounded"
        />
        <button 
          onClick={handleAnalyzeContract}
          disabled={!sourceCode || isAnalyzing}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Contract'}
        </button>
      </div>

      {error && (
        <div className="error-message text-red-500 mt-2">
          {error}
        </div>
      )}

      <div className="analysis-results mt-4 flex">
        {renderSecurityRiskVisualization()}
        {renderRefactoringRecommendations()}
      </div>
    </div>
  );
};

export default MLContractAnalyzer;