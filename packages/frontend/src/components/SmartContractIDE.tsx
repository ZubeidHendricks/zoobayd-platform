import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

const SmartContractIDE: React.FC = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [compilationResult, setCompilationResult] = useState<{
    success: boolean;
    bytecode?: string;
    abi?: any[];
    errors?: string[];
    gasEstimate?: number;
    bestPractices?: string[];
  } | null>(null);

  const handleCompile = async () => {
    try {
      const response = await fetch('/api/contract/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceCode })
      });

      const result = await response.json();
      setCompilationResult(result);
    } catch (error) {
      console.error('Compilation failed', error);
    }
  };

  return (
    <div className="smart-contract-ide">
      <div className="editor-container">
        <MonacoEditor
          width="100%"
          height="500"
          language="solidity"
          theme="vs-dark"
          value={sourceCode}
          onChange={setSourceCode}
          options={{
            selectOnLineNumbers: true,
            automaticLayout: true
          }}
        />
        <button 
          onClick={handleCompile}
          className="compile-button"
        >
          Compile Contract
        </button>
      </div>

      {compilationResult && (
        <div className="compilation-results">
          <h3>Compilation Results</h3>
          {compilationResult.success ? (
            <div className="success-result">
              <p>Compilation Successful</p>
              <div className="contract-details">
                <h4>Contract Bytecode</h4>
                <pre>{compilationResult.bytecode?.slice(0, 100)}...</pre>
                
                {compilationResult.gasEstimate && (
                  <p>
                    <strong>Estimated Deployment Gas:</strong> 
                    {compilationResult.gasEstimate}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="error-result">
              <h4>Compilation Errors</h4>
              {compilationResult.errors?.map((error, index) => (
                <pre key={index} className="error-message">
                  {error}
                </pre>
              ))}
            </div>
          )}

          {compilationResult.bestPractices && (
            <div className="best-practices">
              <h4>Best Practice Recommendations</h4>
              <ul>
                {compilationResult.bestPractices.map((practice, index) => (
                  <li key={index} className="recommendation">
                    {practice}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartContractIDE;