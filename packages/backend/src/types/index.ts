export interface FeatureUsage {
  featureId: string;
  userId: string;
  usageCount: number;
  duration: number;
  lastUsed: Date;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface Resource {
  id: string;
  type: string;
  ownerId: string;
}

export interface Tier {
  id: string;
  name: string;
  features: string[];
  usageQuotas: Record<string, number>;
  pricing: {
    base: number;
    usageBased: Record<string, number>;
  };
}

export interface TestConfig {
  id: string;
  name: string;
  variants: string[];
  metrics: string[];
  targetAudience: Record<string, any>;
  duration: number;
}

export interface TestResult {
  testId: string;
  variantPerformance: Record<string, number>;
  conversionRates: Record<string, number>;
  significance: number;
}