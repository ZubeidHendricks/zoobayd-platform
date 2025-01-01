import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AccessControls } from './AccessControls';
import { Feature, Metrics } from '../../types';

interface Props {
  feature: Feature;
  metrics?: Metrics;
}

export const FeatureCard: React.FC<Props> = ({ feature, metrics }) => {
  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{feature.name}</h3>
          <Badge>{feature.status}</Badge>
        </div>
        
        <p className="text-gray-600 mb-4">{feature.description}</p>
        
        {metrics && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <p className="text-sm text-gray-500">Usage</p>
              <p className="font-medium">{metrics.usage}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Conversion</p>
              <p className="font-medium">{metrics.conversion}%</p>
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