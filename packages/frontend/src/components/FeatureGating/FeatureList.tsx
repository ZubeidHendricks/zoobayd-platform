import React, { useState, useEffect } from 'react';
import { FeatureCard } from './FeatureCard';
import { MLMetrics } from './MLMetrics';
import { getFeatures } from '../../api/features';
import { AccessControl } from './AccessSettings';

interface Feature {
  id: string;
  name: string;
  description: string;
  access: AccessControl;
  enabled: boolean;
}

interface FeatureMetrics {
  adoption: number;
  retention: number;
  satisfaction: number;
}

export const FeatureList: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [metrics, setMetrics] = useState<Record<string, FeatureMetrics>>({});

  useEffect(() => {
    const fetchFeatures = async () => {
      const data = await getFeatures();
      setFeatures(data);
    };

    fetchFeatures();
  }, []);

  return (
    <div className="space-y-6">
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