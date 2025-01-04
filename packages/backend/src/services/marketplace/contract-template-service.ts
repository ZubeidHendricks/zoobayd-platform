import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { z } from 'zod';

// Validation Schema
const ContractTemplateSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    blockchainType: z.enum(['ethereum', 'polygon', 'solana', 'cardano', 'binanceSmartChain']),
    domain: z.enum(['defi', 'nft', 'gaming', 'insurance', 'general']),
    complexity: z.enum(['beginner', 'intermediate', 'advanced']),
    code: z.string(),
    author: z.string(),
    tags: z.array(z.string()).optional(),
    price: z.number().min(0).optional(),
    isPublic: z.boolean().default(true)
});

interface ContractTemplate {
    _id?: ObjectId;
    title: string;
    description?: string;
    blockchainType: string;
    domain: string;
    complexity: string;
    code: string;
    author: string;
    tags?: string[];
    price?: number;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    downloads: number;
    ratings: {
        average: number;
        count: number;
    };
}

class ContractTemplateService {
    private db: Db;
    private templatesCollection: Collection;

    constructor(mongoClient: MongoClient) {
        this.db = mongoClient.db('zoobayd');
        this.templatesCollection = this.db.collection('contract_templates');

        // Create indexes for efficient querying
        this.templatesCollection.createIndexes([
            { key: { blockchainType: 1 } },
            { key: { domain: 1 } },
            { key: { complexity: 1 } },
            { key: { author: 1 } }
        ]);
    }

    async createTemplate(
        userId: string, 
        templateData: z.infer<typeof ContractTemplateSchema>
    ): Promise<ContractTemplate> {
        // Validate input
        const validatedData = ContractTemplateSchema.parse({
            ...templateData,
            author: userId
        });

        const template: ContractTemplate = {
            ...validatedData,
            author: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
            downloads: 0,
            ratings: {
                average: 0,
                count: 0
            }
        };

        const result = await this.templatesCollection.insertOne(template);
        return { ...template, _id: result.insertedId };
    }

    async updateTemplate(
        templateId: string, 
        userId: string, 
        updateData: Partial<z.infer<typeof ContractTemplateSchema>>
    ): Promise<ContractTemplate | null> {
        const template = await this.templatesCollection.findOne({ 
            _id: new ObjectId(templateId), 
            author: userId 
        });

        if (!template) {
            throw new Error('Template not found or unauthorized');
        }

        const validatedData = ContractTemplateSchema.partial().parse(updateData);

        const result = await this.templatesCollection.findOneAndUpdate(
            { _id: new ObjectId(templateId) },
            { 
                $set: {
                    ...validatedData,
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );

        return result;
    }

    async searchTemplates(filters: {
        blockchainType?: string;
        domain?: string;
        complexity?: string;
        tags?: string[];
        minPrice?: number;
        maxPrice?: number;
    }): Promise<ContractTemplate[]> {
        const query: any = { isPublic: true };

        if (filters.blockchainType) {
            query.blockchainType = filters.blockchainType;
        }

        if (filters.domain) {
            query.domain = filters.domain;
        }

        if (filters.complexity) {
            query.complexity = filters.complexity;
        }

        if (filters.tags && filters.tags.length > 0) {
            query.tags = { $in: filters.tags };
        }

        if (filters.minPrice !== undefined) {
            query.price = { $gte: filters.minPrice };
        }

        if (filters.maxPrice !== undefined) {
            query.price = { 
                ...(query.price || {}), 
                $lte: filters.maxPrice 
            };
        }

        return this.templatesCollection.find(query).toArray();
    }

    async getTemplateById(templateId: string): Promise<ContractTemplate | null> {
        return this.templatesCollection.findOne({ _id: new ObjectId(templateId) });
    }

    async downloadTemplate(templateId: string): Promise<ContractTemplate | null> {
        return this.templatesCollection.findOneAndUpdate(
            { _id: new ObjectId(templateId) },
            { $inc: { downloads: 1 } },
            { returnDocument: 'after' }
        );
    }

    async rateTemplate(
        templateId: string, 
        rating: number
    ): Promise<ContractTemplate | null> {
        const template = await this.templatesCollection.findOne({ 
            _id: new ObjectId(templateId) 
        });

        if (!template) {
            return null;
        }

        const currentAverage = template.ratings.average;
        const currentCount = template.ratings.count;

        const newCount = currentCount + 1;
        const newAverage = ((currentAverage * currentCount) + rating) / newCount;

        return this.templatesCollection.findOneAndUpdate(
            { _id: new ObjectId(templateId) },
            { 
                $set: { 
                    ratings: {
                        average: newAverage,
                        count: newCount
                    }
                }
            },
            { returnDocument: 'after' }
        );
    }
}

export default ContractTemplateService;