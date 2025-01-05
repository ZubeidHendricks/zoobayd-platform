import { 
  BlockchainNetwork, 
  ContractGenerationRequest 
} from '../types/ContractTypes';

interface GeneratedContractResponse {
  sourceCode: string;
  language: string;
  blockchain: BlockchainNetwork;
  optimizationScore: number;
  securityRecommendations: string[];
}

class ContractGenerationService {
  private baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

  async generateContract(request: ContractGenerationRequest): Promise<GeneratedContractResponse> {
    try {
      const response = await fetch(`${this.baseURL}/contracts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async downloadContract(contractId: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseURL}/contracts/${contractId}/download`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async analyzeExistingContract(sourceCode: string, blockchain: BlockchainNetwork): Promise<{
    securityScore: number;
    recommendations: string[];
  }> {
    try {
      const response = await fetch(`${this.baseURL}/contracts/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ sourceCode, blockchain })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }

  private handleError(error: any): void {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

export default new ContractGenerationService();