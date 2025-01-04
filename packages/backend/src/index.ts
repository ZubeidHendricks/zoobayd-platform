import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

// Monitoring and Tracing
import MonitoringService from './services/monitoring-service';

// Database Connection
import MongoDBConnection from './utils/mongodb';

// Routes
import createAuthRoutes from './routes/auth-routes';

// Advanced Services
import ContractGeneratorService from './services/advanced-contract-generator';
import BlockchainIntegrator from './services/multi-chain-integrator';
import MLContractOptimizer from './services/ml-contract-optimizer';

class ZoobayPlatformServer {
    private app: express.Application;
    private port: number;

    constructor() {
        // Load environment variables
        dotenv.config();

        // Initialize Express
        this.app = express();
        this.port = parseInt(process.env.PORT || '3001');

        // Middleware setup
        this.setupMiddleware();

        // Database connection
        this.connectDatabase();

        // Route setup
        this.setupRoutes();

        // Initialize advanced services
        this.initializeServices();
    }

    private setupMiddleware() {
        // Security middleware
        this.app.use(helmet());

        // CORS configuration
        this.app.use(cors({
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true
        }));

        // JSON parsing
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private async connectDatabase() {
        try {
            const mongoConnection = MongoDBConnection.getInstance();
            await mongoConnection.connect();
        } catch (error) {
            console.error('Database connection failed', error);
            process.exit(1);
        }
    }

    private setupRoutes() {
        const mongoConnection = MongoDBConnection.getInstance();
        const { router: authRouter, authMiddleware } = createAuthRoutes(
            mongoConnection.getClient()
        );

        // Authentication routes
        this.app.use('/api/auth', authRouter);

        // Contract Generation Route
        this.app.post('/api/contracts/generate', authMiddleware, async (req, res) => {
            try {
                const { blockchain, specifications } = req.body;
                const result = await ContractGeneratorService.generateAdvancedContract(
                    blockchain, 
                    specifications
                );

                res.json(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Blockchain Status Route
        this.app.get('/api/blockchain/status', authMiddleware, async (req, res) => {
            try {
                const { blockchain } = req.query;
                const status = await BlockchainIntegrator.getNetworkStatus(
                    blockchain as string
                );
                res.json(status);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // ML Contract Optimization Route
        this.app.post('/api/contracts/optimize', authMiddleware, async (req, res) => {
            try {
                const { contractCode } = req.body;
                const optimizationResult = await MLContractOptimizer.optimizeContract(
                    contractCode
                );
                res.json(optimizationResult);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Monitoring metrics endpoint
        this.app.get('/metrics', async (req, res) => {
            try {
                const metrics = await MonitoringService.getPrometheusMetrics();
                res.contentType('text/plain');
                res.send(metrics);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }

    private initializeServices() {
        // Any additional service initialization can be added here
        console.log('Initializing Zoobayd Platform Services...');
    }

    public start() {
        const server = this.app.listen(this.port, () => {
            console.log(`
            ╔══════════════════════════════════════╗
            ║     Zoobayd Platform Running        ║
            ║     Port: ${this.port}               ║
            ╚══════════════════════════════════════╝
            `);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully');
            server.close(() => {
                MongoDBConnection.getInstance().disconnect();
                process.exit(0);
            });
        });
    }
}

// Start the server
const server = new ZoobayPlatformServer();
server.start();