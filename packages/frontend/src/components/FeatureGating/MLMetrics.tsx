import React, { useEffect, useState } from 'react';
import { getMLPredictions } from '../../api/ml';
import { Chart } from '../ui/Chart';

interface Props {
  onMetricsUpdate: (metrics: any) => void;
}

export const MLMetrics: React.FC<Props> = ({ onMetricsUpdate }) => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const data = await getMLPredictions();
      setPredictions(data);
      onMetricsUpdate(data.metrics);
    } catch (error) {
      console.error('Failed to fetch ML predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading predictions...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">ML Insights</h3>
      
      {predictions && (
        <>
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500">Churn Risk</h4>
            <div className="mt-1">
              <Chart 
                data={predictions.churnData}
                type="line"
                height={200}
              />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Feature Recommendations</h4>
            <ul className="mt-2 space-y-2">
              {predictions.recommendations.map((rec: any) => (
                <li key={rec.feature} className="flex justify-between">
                  <span>{rec.feature}</span>
                  <span className="text-blue-600">{rec.score}%</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};