import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { WebSocket } from 'ws';
import { z } from 'zod';
import MLContractOptimizer from '../ml-contract-optimizer';
import SecurityScanner from '../advanced-security-scanner';

// Validation Schemas
const CollaborativeContractSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    blockchainType: z.enum(['ethereum', 'polygon', 'solana', 'cardano', 'binanceSmartChain']),
    domain: z.enum(['defi', 'nft', 'gaming', 'insurance', 'general']),
    currentVersion: z.number().default(1),
    isPublic: z.boolean().default(false)
});

const ContractVersionSchema = z.object({
    versionNumber: z.number(),
    code: z.string(),
    author: z.string(),
    createdAt: z.date(),
    optimizationScore: z.number().optional(),
    securityScore: z.number().optional(),
    comments: z.array(z.object({
        author: z.string(),
        text: z.string(),
        createdAt: z.date()
    })).optional()
});

interface CollaborativeContract {
    _id?: ObjectId;
    title: string;
    description?: string;
    blockchainType: string;
    domain: string;
    currentVersion: number;
    isPublic: boolean;
    owners: string[];
    collaborators: string[];
    versions: ContractVersion[];
    createdAt: Date;
    updatedAt: Date;
}

interface ContractVersion {
    versionNumber: number;
    code: string;
    author: string;
    createdAt: Date;
    optimizationScore?: number;
    securityScore?: number;
    comments?: {
        author: string;
        text: string;
        createdAt: Date;
    }[];
}

class CollaborativeContractService {
    private db: Db;
    private contractsCollection: Collection;
    private activeConnections: Map<string, Set<WebSocket>>;

    constructor(mongoClient: MongoClient) {
        this.db = mongoClient.db('zoobayd');
        this.contractsCollection = this.db.collection('collaborative_contracts');
        this.activeConnections = new Map();

        // Create indexes
        this.contractsCollection.createIndexes([
            { key: { blockchainType: 1 } },
            { key: { domain: 1 } },
            { key: { isPublic: 1 } }
        ]);
    }

    async createContract(
        userId: string, 
        contractData: z.infer<typeof CollaborativeContractSchema>
    ): Promise<CollaborativeContract> {
        const validatedData = CollaborativeContractSchema.parse(contractData);

        const newContract: CollaborativeContract = {
            ...validatedData,
            owners: [userId],
            collaborators: [],
            versions: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await this.contractsCollection.insertOne(newContract);
        return { ...newContract, _id: result.insertedId };
    }

    async addVersion(
        contractId: string, 
        userId: string, 
        code: string
    ): Promise<CollaborativeContract | null> {
        // Perform ML optimization and security scanning
        const optimizationResult = await MLContractOptimizer.optimizeContract(code);
        const securityScanResult = await SecurityScanner.performComprehensiveScan(code);

        const versionToAdd: ContractVersion = {
            versionNumber: 0, // Will be set dynamically
            code,
            author: userId,
            createdAt: new Date(),
            optimizationScore: optimizationResult.score,
            securityScore: securityScanResult.overallScore,
            comments: []
        };

        const result = await this.contractsCollection.findOneAndUpdate(
            { _id: new ObjectId(contractId) },
            { 
                $push: { 
                    versions: { 
                        ...versionToAdd, 
                        versionNumber: (this.currentContract.versions?.length || 0) + 1 
                    } 
                },
                $set: { 
                    updatedAt: new Date(),
                    currentVersion: (this.currentContract.versions?.length || 0) + 1
                }
            },
            { returnDocument: 'after' }
        );

        // Broadcast version update to collaborators
        this.broadcastVersionUpdate(contractId, versionToAdd);

        return result;
    }

    async addCollaborator(
        contractId: string, 
        ownerId: string, 
        collaboratorEmail: string
    ): Promise<CollaborativeContract | null> {
        // In a real-world scenario, you'd validate the collaborator's existence
        return this.contractsCollection.findOneAndUpdate(
            { 
                _id: new ObjectId(contractId), 
                owners: ownerId 
            },
            { 
                $addToSet: { collaborators: collaboratorEmail },
                $set: { updatedAt: new Date() }
            },
            { returnDocument: 'after' }
        );
    }

    private broadcastVersionUpdate(contractId: string, version: ContractVersion) {
        const websockets = this.activeConnections.get(contractId);
        if (websockets) {
            websockets.forEach(ws => {
                ws.send(JSON.stringify({
                    type: 'version_update',
                    version
                }));
            });
        }
    }

    async getContractVersionHistory(contractId: string): Promise<ContractVersion[]> {
        const contract = await this.contractsCollection.findOne({ 
            _id: new ObjectId(contractId) 
        });

        return contract?.versions || [];
    }

    async addComment(
        contractId: string, 
        userId: string, 
        versionNumber: number, 
        commentText: string
    ): Promise<CollaborativeContract | null> {
        const comment = {
            author: userId,
            text: commentText,
            createdAt: new Date()
        };

        return this.contractsCollection.findOneAndUpdate(
            { 
                _id: new ObjectId(contractId),
                'versions.versionNumber': versionNumber 
            },
            { 
                $push: { 'versions.$.comments': comment },
                $set: { updatedAt: new Date() }
            },
            { returnDocument: 'after' }
        );
    }

    // WebSocket connection management
    registerWebSocketConnection(contractId: string, websocket: WebSocket) {
        if (!this.activeConnections.has(contractId)) {
            this.activeConnections.set(contractId, new Set());
        }
        this.activeConnections.get(contractId)!.add(websocket);
    }

    removeWebSocketConnection(contractId: string, websocket: WebSocket) {
        const connections = this.activeConnections.get(contractId);
        if (connections) {
            connections.delete(websocket);
        }
    }
}

export default CollaborativeContractService;