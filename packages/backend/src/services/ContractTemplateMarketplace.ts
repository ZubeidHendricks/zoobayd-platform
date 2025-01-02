import { v4 as uuidv4 } from 'uuid';
import { AdvancedBlockchainType } from './ExtendedBlockchainIntegration';

enum ContractTemplateType {
  TOKEN = 'token',
  NFT = 'nft',
  DEFI = 'defi',
  STAKING = 'staking',
  GOVERNANCE = 'governance'
}

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  type: ContractTemplateType;
  blockchain: AdvancedBlockchainType;
  sourceCode: string;
  author: string;
  rating: number;
  downloads: number;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  price?: number;
}

class ContractTemplateMarketplace {
  private templates: Map<string, ContractTemplate> = new Map();

  // Add a new contract template to the marketplace
  addTemplate(
    templateData: Omit<ContractTemplate, 'id' | 'rating' | 'downloads'>
  ): ContractTemplate {
    const template: ContractTemplate = {
      id: uuidv4(),
      rating: 0,
      downloads: 0,
      ...templateData
    };

    this.templates.set(template.id, template);
    return template;
  }

  // Search and filter templates
  searchTemplates(filters?: {
    type?: ContractTemplateType;
    blockchain?: AdvancedBlockchainType;
    complexity?: 'beginner' | 'intermediate' | 'advanced';
    minRating?: number;
    tags?: string[];
  }): ContractTemplate[] {
    return Array.from(this.templates.values())
      .filter(template => {
        if (filters?.type && template.type !== filters.type) return false;
        if (filters?.blockchain && template.blockchain !== filters.blockchain) return false;
        if (filters?.complexity && template.complexity !== filters.complexity) return false;
        if (filters?.minRating && template.rating < filters.minRating) return false;
        if (filters?.tags && !filters.tags.every(tag => template.tags.includes(tag))) return false;
        return true;
      })
      .sort((a, b) => b.rating - a.rating);
  }

  // Download a template
  downloadTemplate(templateId: string): ContractTemplate {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    template.downloads += 1;
    return template;
  }

  // Rate a template
  rateTemplate(
    templateId: string, 
    rating: number
  ): ContractTemplate {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Simple average rating calculation
    template.rating = (template.rating + rating) / 2;
    return template;
  }
}

export { 
  ContractTemplateMarketplace, 
  ContractTemplateType,
  ContractTemplate 
};