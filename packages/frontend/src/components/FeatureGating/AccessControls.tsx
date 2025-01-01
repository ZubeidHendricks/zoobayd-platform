import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { updateAccess } from '../../api/features';
import { AccessSettings } from './AccessSettings';

interface Props {
  featureId: string;
  currentAccess: {
    type: 'trial' | 'full' | 'none';
    expiresAt?: Date;
  };
}

export const AccessControls: React.FC<Props> = ({ featureId, currentAccess }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleAccessUpdate = async (settings: any) => {
    try {
      setUpdating(true);
      await updateAccess(featureId, settings);
    } catch (error) {
      console.error('Failed to update access:', error);
    } finally {
      setUpdating(false);
      setShowSettings(false);
    }
  };

  return (
    <div>
      <div className="flex space-x-2">
        <Button
          onClick={() => setShowSettings(true)}
          disabled={updating}
        >
          Configure Access
        </Button>
        
        {currentAccess.type === 'trial' && (
          <p className="text-sm text-gray-500">
            Trial expires: {new Date(currentAccess.expiresAt!).toLocaleDateString()}
          </p>
        )}
      </div>

      {showSettings && (
        <AccessSettings
          onSubmit={handleAccessUpdate}
          onCancel={() => setShowSettings(false)}
          currentSettings={currentAccess}
        />
      )}
    </div>
  );
};