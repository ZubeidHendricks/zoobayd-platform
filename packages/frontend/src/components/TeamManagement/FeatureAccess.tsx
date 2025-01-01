import React, { useState, useEffect } from 'react';
import { getTeamFeatures, updateFeatureAccess } from '../../api/team';
import { Switch } from '../ui/Switch';

export const FeatureAccess: React.FC = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    const data = await getTeamFeatures();
    setFeatures(data);
  };

  const handleAccessToggle = async (featureId: string, enabled: boolean) => {
    setLoading(true);
    try {
      await updateFeatureAccess(featureId, { enabled });
      fetchFeatures();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Feature Access</h3>
      </div>
      <div className="p-4">
        {features.map(feature => (
          <div key={feature.id} className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">{feature.name}</p>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
            <Switch
              checked={feature.enabled}
              onChange={enabled => handleAccessToggle(feature.id, enabled)}
              disabled={loading}
            />
          </div>
        ))}
      </div>
    </div>
  );
};