export enum FeatureTier {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

export interface FeatureFlag {
  name: string;
  enabledTiers: FeatureTier[];
  description: string;
}

export const FEATURE_FLAGS: FeatureFlag[] = [
  {
    name: 'AI_CONTRACT_GENERATOR',
    enabledTiers: [FeatureTier.PRO, FeatureTier.ENTERPRISE],
    description: 'Advanced AI-powered contract generation'
  },
  {
    name: 'MULTI_CHAIN_DEPLOYMENT',
    enabledTiers: [FeatureTier.ENTERPRISE],
    description: 'Deploy contracts across multiple blockchain networks'
  },
  {
    name: 'SECURITY_ANALYSIS',
    enabledTiers: [FeatureTier.PRO, FeatureTier.ENTERPRISE],
    description: 'Comprehensive blockchain security analysis'
  },
  {
    name: 'TEAM_MANAGEMENT',
    enabledTiers: [FeatureTier.PRO, FeatureTier.ENTERPRISE],
    description: 'Advanced team collaboration and role management'
  }
];

export function isFeatureEnabled(feature: string, userTier: FeatureTier): boolean {
  const featureConfig = FEATURE_FLAGS.find(f => f.name === feature);
  return !!featureConfig?.enabledTiers.includes(userTier);
}