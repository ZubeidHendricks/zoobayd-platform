import React from 'react';
import { Dialog } from './ui/Dialog';

interface UpgradeIncentiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  missingFeature: keyof typeof upgradeReasons;
}

const upgradeReasons = {
  contractGeneration: [
    'Access advanced smart contract generation capabilities',
    'Generate contracts for multiple blockchains',
    'Priority support and customization options'
  ],
  securityAnalysis: [
    'Comprehensive security analysis and auditing',
    'Custom security rule configuration',
    'Detailed vulnerability reports and remediation suggestions'
  ]
} as const;

export const UpgradeIncentiveModal: React.FC<UpgradeIncentiveModalProps> = ({
  isOpen,
  onClose,
  missingFeature
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-2">Upgrade Your Plan</h2>
          <p className="text-gray-600">
            Unlock more features by upgrading to our premium plan
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold">Why Upgrade?</h3>
          <ul className="list-disc list-inside text-gray-700">
            {upgradeReasons[missingFeature]?.map((reason: string, index: number) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Maybe Later
          </button>
          <button
            onClick={() => {/* Handle upgrade */}}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </Dialog>
  );
};