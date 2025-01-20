import React, { useEffect, useState } from 'react';
import { getMLPredictions } from '../../api/ml';
import { Chart } from '../ui/Chart';
import type { MLPrediction } from '../../api/ml';

interface Props {
  onMetricsUpdate: (metrics: MLPrediction['metrics']) => void;
}

export const MLMetrics: React.FC<Props> = ({ onMetricsUpdate }) => {
  const [predictions, setPredictions] = useState<MLPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        const data = await getMLPredictions();
        setPredictions(data);
        onMetricsUpdate(data.metrics);
      } catch (error) {
        console.error('Failed to fetch ML predictions:', error);
        setError('Failed to load predictions');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [onMetricsUpdate]);

  if (loading) return <div>Loading predictions...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!predictions) return null;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="text-sm font-medium text-gray-500">Churn Prediction</h4>
            <div className="mt-1">
              <Chart 
                data={predictions.churnData}
                type="line"
                height={200}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Feature Recommendations</h4>
            <ul className="mt-2 space-y-2">
              {predictions.recommendations.map((rec) => (
                <li key={rec.feature} className="flex justify-between">
                  <span>{rec.feature}</span>
                  <span className="text-blue-600">{rec.score}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};