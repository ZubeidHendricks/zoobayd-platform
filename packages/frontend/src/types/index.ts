export interface Feature {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'beta';
  access: {
    type: 'trial' | 'full' | 'none';
    expiresAt?: Date;
  };
}

export interface Metrics {
  usage: number;
  conversion: number;
  engagement: number;
}

export interface MLPredictions {
  churnData: {
    date: string;
    value: number;
  }[];
  recommendations: {
    feature: string;
    score: number;
  }[];
  metrics: Record<string, Metrics>;
}