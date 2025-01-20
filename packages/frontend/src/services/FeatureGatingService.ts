interface User {
  id: string;
  tier: keyof typeof PRICING_TIERS;
}

interface BaseFeatureConfig {
  allowed: boolean;
  limitPerMonth: number;
}

interface ContractGenerationConfig extends BaseFeatureConfig {
  complexity: 'basic' | 'advanced' | 'custom';
  supportedBlockchains: readonly string[];
}

interface SecurityAnalysisConfig extends BaseFeatureConfig {
  depth: 'none' | 'standard' | 'deep';
}

type FeatureConfig = ContractGenerationConfig | SecurityAnalysisConfig;

interface Features {
  contractGeneration: ContractGenerationConfig;
  securityAnalysis: SecurityAnalysisConfig;
}

interface TierConfig {
  features: Features;
  price: number;
}

const PRICING_TIERS = {
  free: {
    features: {
      contractGeneration: {
        allowed: true,
        limitPerMonth: 5,
        complexity: 'basic' as const,
        supportedBlockchains: ['ethereum'] as const
      },
      securityAnalysis: {
        allowed: false,
        limitPerMonth: 0,
        depth: 'none' as const
      }
    },
    price: 0
  },
  pro: {
    features: {
      contractGeneration: {
        allowed: true,
        limitPerMonth: 20,
        complexity: 'advanced' as const,
        supportedBlockchains: ['ethereum', 'polygon', 'binance'] as const
      },
      securityAnalysis: {
        allowed: true,
        limitPerMonth: 10,
        depth: 'standard' as const
      }
    },
    price: 49
  },
  enterprise: {
    features: {
      contractGeneration: {
        allowed: true,
        limitPerMonth: -1,
        complexity: 'custom' as const,
        supportedBlockchains: ['all'] as const
      },
      securityAnalysis: {
        allowed: true,
        limitPerMonth: -1,
        depth: 'deep' as const
      }
    },
    price: 499
  }
} as const;

function isContractGenerationConfig(
  config: FeatureConfig
): config is ContractGenerationConfig {
  return 'complexity' in config && 'supportedBlockchains' in config;
}

function isSecurityAnalysisConfig(
  config: FeatureConfig
): config is SecurityAnalysisConfig {
  return 'depth' in config;
}

export class FeatureGatingService {
  canAccessFeature(user: User, featureName: keyof Features): boolean {
    const tier = user.tier;
    const tierConfig = PRICING_TIERS[tier];
    
    return tierConfig.features[featureName]?.allowed || false;
  }

  getFeatureLimitations(user: User, featureName: keyof Features) {
    const tier = user.tier;
    const tierConfig = PRICING_TIERS[tier];
    const feature = tierConfig.features[featureName];
    
    const result = {
      limit: feature.limitPerMonth
    };

    if (isContractGenerationConfig(feature)) {
      return {
        ...result,
        complexity: feature.complexity
      };
    }

    return result;
  }

  getSupportedBlockchains(user: User): string[] {
    const tier = user.tier;
    const tierConfig = PRICING_TIERS[tier];
    const blockchains = tierConfig.features.contractGeneration.supportedBlockchains;
    // Create a new array to convert from readonly to mutable
    return [...blockchains];
  }

  getSecurityAnalysisDepth(user: User): SecurityAnalysisConfig['depth'] {
    const tier = user.tier;
    const tierConfig = PRICING_TIERS[tier];
    
    return tierConfig.features.securityAnalysis.depth;
  }
}