import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AccessControls } from './AccessControls';
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

interface Props {
  feature: Feature;
  metrics?: FeatureMetrics;
}

export const FeatureCard: React.FC<Props> = ({ feature, metrics }) => {
  return (
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{feature.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
          </div>
          <Badge variant={feature.enabled ? 'success' : 'error'}>
            {feature.enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>

        {metrics && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">Adoption</p>
              <p className="text-2xl font-semibold">{metrics.adoption}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Retention</p>
              <p className="text-2xl font-semibold">{metrics.retention}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Satisfaction</p>
              <p className="text-2xl font-semibold">{metrics.satisfaction}%</p>
            </div>
          </div>
        )}

        <AccessControls 
          featureId={feature.id}
          currentAccess={feature.access}
        />
      </div>
    </Card>
  );
};