// Upgrade Incentive Modal
// Provides contextual upgrade recommendations

import React from 'react';
import { PRICING_TIERS } from '../config/PricingTiers';

interface UpgradeIncentiveModalProps {
  missingFeature: string;
  currentTier: string;
  onUpgrade: (tier: string) => void;
  onClose: () => void;
}

const UpgradeIncentiveModal: React.FC<UpgradeIncentiveModalProps> = ({
  missingFeature,
  currentTier,
  onUpgrade,
  onClose
}) => {
  const upgradeReasons = {
    contractGeneration: [
      'Generate contracts on more blockchains',
      'Access advanced contract complexity',
      'Unlimited monthly generations'
    ],
    securityAnalysis: [
      'Comprehensive security scanning',
      'Advanced risk scoring',
      'Unlimited security checks'
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">
          Unlock {missingFeature} Features
        </h2>
        
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold">Why Upgrade?</h3>
          <ul className="list-disc list-inside text-gray-700">
            {upgradeReasons[missingFeature]?.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(PRICING_TIERS)
            .filter(([tier]) => tier !== currentTier && tier !== 'free')
            .map(([tier, config]) => (
              <div 
                key={tier} 
                className="border rounded p-4 hover:bg-gray-50"
              >
                <h4 className="font-bold capitalize mb-2">{tier} Plan</h4>
                <p className="text-xl mb-4">${config.price}/month</p>
                <button 
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  onClick={() => onUpgrade(tier)}
                >
                  Upgrade
                </button>
              </div>
            ))}
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-4 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpgradeIncentiveModal;