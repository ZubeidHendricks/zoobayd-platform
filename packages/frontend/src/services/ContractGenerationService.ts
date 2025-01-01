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
    // Retrieve authentication token from localStorage or state management
    return localStorage.getItem('auth_token') || '';
  }

  private handleError(error: any): void {
    if (axios.isAxiosError(error)) {
      // Handle specific axios error types
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Error response:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', error.message);
      }
    } else {
      // Handle non-axios errors
      console.error('Unexpected error:', error);
    }
  }
}

export default new ContractGenerationService();