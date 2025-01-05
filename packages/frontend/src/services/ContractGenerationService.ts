import axios from 'axios';
import { 
  AIProvider, 
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
      const response = await axios.post<GeneratedContractResponse>(
        `${this.baseURL}/contracts/generate`, 
        request,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getAuthToken()}`
          }
        }
      );

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async downloadContract(contractId: string): Promise<Blob> {
    try {
      const response = await axios.get(`${this.baseURL}/contracts/${contractId}/download`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        responseType: 'blob'
      });

      return response.data;
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
      const response = await axios.post(
        `${this.baseURL}/contracts/analyze`, 
        { sourceCode, blockchain },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getAuthToken()}`
          }
        }
      );

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }

  private handleError(error: any): void {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

export default new ContractGenerationService();