// Feature Gating Service
// Comprehensive tier-based feature management system

import { PRICING_TIERS } from '../config/PricingTiers';

class FeatureGatingService {
  // Check if a feature is accessible
  canAccessFeature(user, featureName) {
    const tier = user.subscriptionTier || 'free';
    const tierConfig = PRICING_TIERS[tier];
    
    return tierConfig.features[featureName]?.allowed || false;
  }

  // Get feature limitations
  getFeatureLimitations(user, featureName) {
    const tier = user.subscriptionTier || 'free';
    const tierConfig = PRICING_TIERS[tier];
    
    return {
      limit: tierConfig.features[featureName]?.limitPerMonth,
      complexity: tierConfig.features[featureName]?.complexity,
      supportedNetworks: tierConfig.features[featureName]?.supportedNetworks
    };
  }

  // Check if user has reached feature limit
  hasReachedFeatureLimit(user, featureName) {
    const limitations = this.getFeatureLimitations(user, featureName);
    
    if (limitations.limit === 'unlimited') return false;
    
    // Track user's usage (would be implemented with database tracking)
    const currentUsage = this.getCurrentUsage(user, featureName);
    
    return currentUsage >= limitations.limit;
  }

  // Placeholder for usage tracking
  private getCurrentUsage(user, featureName) {
    // This would be implemented with actual usage tracking
    return 0;
  }
}

export default FeatureGatingService;