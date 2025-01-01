import React, { useState, useRef, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios';

interface CodeAssistanceFeatures {
  autocompletion: boolean;
  linting: boolean;
  refactoring: boolean;
  performanceAnalysis: boolean;
}

interface LintingError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

const IDEAssistant: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'solidity' | 'typescript'>('solidity');
  const [assistanceFeatures, setAssistanceFeatures] = useState<CodeAssistanceFeatures>({
    autocompletion: true,
    linting: true,
    refactoring: true,
    performanceAnalysis: true
  });

  const [lintingErrors, setLintingErrors] = useState<LintingError[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    estimatedGasCost?: number;
    complexityScore?: number;
  }>({});

  const editorRef = useRef<any>(null);

  const languageOptions = [
    { value: 'solidity', label: 'Solidity' },
    { value: 'typescript', label: 'TypeScript' }
  ];

  const handleCodeChange = async (newCode: string) => {
    setCode(newCode);

    if (assistanceFeatures.linting) {
      await performLinting(newCode);
    }

    if (assistanceFeatures.performanceAnalysis) {
      await analyzePerformance(newCode);
    }
  };

  const performLinting = async (codeToLint: string) => {
    try {
      const response = await axios.post('/api/ide/lint', {
        code: codeToLint,
        language
      });

      setLintingErrors(response.data.errors);
    } catch (error) {
      console.error('Linting failed', error);
    }
  };

  const analyzePerformance = async (codeToAnalyze: string) => {
    try {
      const response = await axios.post('/api/ide/performance', {
        code: codeToAnalyze,
        language
      });

      setPerformanceMetrics(response.data);
    } catch (error) {
      console.error('Performance analysis failed', error);
    }
  };

  const handleRefactoring = async (type: 'extract-method' | 'rename' | 'optimize') => {
    try {
      const response = await axios.post('/api/ide/refactor', {
        code,
        language,
        refactoringType: type
      });

      setCode(response.data);
    } catch (error) {
      console.error('Refactoring failed', error);
    }
  };

  const renderLintingErrors = () => {
    return lintingErrors.map((error, index) => (
      <div 
        key={index} 
        className={`linting-error ${error.severity}`}
      >
        Line {error.line}, Column {error.column}: {error.message}
      </div>
    ));
  };

  const renderPerformanceMetrics = () => {
    return (
      <div className="performance-metrics">
        {performanceMetrics.estimatedGasCost && (
          <div>
            Estimated Gas Cost: {performanceMetrics.estimatedGasCost}
          </div>
        )}
        {performanceMetrics.complexityScore && (
          <div>
            Complexity Score: {performanceMetrics.complexityScore.toFixed(2)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="ide-assistant">
      <div className="ide-controls">
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value as 'solidity' | 'typescript')}
        >
          {languageOptions.map(lang => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>

        <div className="assistance-toggles">
          {Object.keys(assistanceFeatures).map((feature) => (
            <label key={feature}>
              <input
                type="checkbox"
                checked={assistanceFeatures[feature as keyof CodeAssistanceFeatures]}
                onChange={() => setAssistanceFeatures(prev => ({
                  ...prev,
                  [feature]: !prev[feature as keyof CodeAssistanceFeatures]
                }))}
              />
              {feature.charAt(0).toUpperCase() + feature.slice(1)}
            </label>
          ))}
        </div>

        <div className="refactoring-actions">
          <button onClick={() => handleRefactoring('extract-method')}>
            Extract Method
          </button>
          <button onClick={() => handleRefactoring('optimize')}>
            Optimize
          </button>
        </div>
      </div>

      <div className="editor-container">
        <MonacoEditor
          width="100%"
          height="400"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          editorDidMount={(editor) => {
            editorRef.current = editor;
          }}
          options={{
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: true
          }}
        />
      </div>

      <div className="ide-feedback">
        <div className="linting-errors">
          {renderLintingErrors()}
        </div>
        <div className="performance-analysis">
          {renderPerformanceMetrics()}
        </div>
      </div>
    </div>
  );
};

export default IDEAssistant;