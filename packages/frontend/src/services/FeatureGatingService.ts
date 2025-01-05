export interface Feature {
  id: string;
  name: string;
  status: 'enabled' | 'disabled' | 'beta';
  rolloutPercentage?: number;
  metadata?: Record<string, any>;
}

class FeatureGatingService {
  private baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
  private features: Map<string, Feature> = new Map();

  async initialize(): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/features`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const features: Feature[] = await response.json();
      features.forEach(feature => {
        this.features.set(feature.id, feature);
      });
    } catch (error) {
      console.error('Failed to initialize feature flags:', error);
      throw error;
    }
  }

  isFeatureEnabled(featureId: string): boolean {
    const feature = this.features.get(featureId);
    if (!feature) {
      return false;
    }

    if (feature.status === 'disabled') {
      return false;
    }

    if (feature.status === 'enabled') {
      return true;
    }

    // Handle beta features with rollout percentage
    if (feature.status === 'beta' && feature.rolloutPercentage) {
      const userRolloutValue = this.getUserRolloutValue(featureId);
      return userRolloutValue <= feature.rolloutPercentage;
    }

    return false;
  }

  private getUserRolloutValue(featureId: string): number {
    const userId = this.getUserId();
    const hash = this.hashString(`${userId}-${featureId}`);
    return (hash % 100) + 1; // Returns 1-100
  }

  private getUserId(): string {
    return localStorage.getItem('user_id') || 'anonymous';
  }

  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}

export default new FeatureGatingService();