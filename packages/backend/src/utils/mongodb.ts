import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class MongoDBConnection {
    private static instance: MongoDBConnection;
    private client: MongoClient;
    private db: Db | null = null;

    private constructor() {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/zoobayd';
        this.client = new MongoClient(mongoUri);
    }

    public static getInstance(): MongoDBConnection {
        if (!MongoDBConnection.instance) {
            MongoDBConnection.instance = new MongoDBConnection();
        }
        return MongoDBConnection.instance;
    }

    public async connect(): Promise<Db> {
        if (this.db) return this.db;

        try {
            await this.client.connect();
            this.db = this.client.db();
            console.log('Successfully connected to MongoDB');
            return this.db;
        } catch (error) {
            console.error('Failed to connect to MongoDB', error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.close();
            console.log('MongoDB connection closed');
        }
    }

    public getClient(): MongoClient {
        return this.client;
    }
}

export default MongoDBConnection;