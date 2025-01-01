import React, { useEffect, useState } from 'react';
import { getFeatures } from '../../api/features';
import { FeatureCard } from './FeatureCard';
import { MLMetrics } from './MLMetrics';

export const FeatureList: React.FC = () => {
  const [features, setFeatures] = useState([]);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    const data = await getFeatures();
    setFeatures(data);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map(feature => (
        <FeatureCard 
          key={feature.id} 
          feature={feature}
          metrics={metrics?.[feature.id]}
        />
      ))}
      <MLMetrics onMetricsUpdate={setMetrics} />
    </div>
  );
};