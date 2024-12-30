// Pricing Tiers Configuration
// Defines feature access and limitations for different subscription levels

export const PRICING_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    features: {
      contractGeneration: {
        allowed: true,
        limitPerMonth: 3,
        complexity: 'basic',
        supportedBlockchains: ['Ethereum']
      },
      securityAnalysis: {
        allowed: false,
        limitPerMonth: 0,
        depth: 'basic'
      }
    }
  },
  pro: {
    name: 'Pro',
    price: 49.99,
    features: {
      contractGeneration: {
        allowed: true,
        limitPerMonth: 20,
        complexity: 'advanced',
        supportedBlockchains: [
          'Ethereum', 
          'Binance Smart Chain', 
          'Polygon'
        ]
      },
      securityAnalysis: {
        allowed: true,
        limitPerMonth: 10,
        depth: 'comprehensive'
      }
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 199.99,
    features: {
      contractGeneration: {
        allowed: true,
        limitPerMonth: 'unlimited',
        complexity: 'expert',
        supportedBlockchains: [
          'Ethereum', 
          'Binance Smart Chain', 
          'Polygon', 
          'Avalanche', 
          'Solana'
        ]
      },
      securityAnalysis: {
        allowed: true,
        limitPerMonth: 'unlimited',
        depth: 'enterprise-grade'
      }
    }
  }
};