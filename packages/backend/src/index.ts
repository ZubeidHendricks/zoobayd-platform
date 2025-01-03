import express from 'express';
import dotenv from 'dotenv';

import ContractGeneratorService from './services/contract-generator';
import BlockchainIntegrationService from './services/blockchain-integrator';
import ComplianceMonitorService from './services/compliance-monitor';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Contract Generation Endpoint
app.post('/api/contracts/generate', async (req, res) => {
    try {
        const { blockchain, specifications } = req.body;
        
        const contract = await ContractGeneratorService.generateContract(
            blockchain, 
            specifications
        );

        const securityAnalysis = await ContractGeneratorService.analyzeContractSecurity(contract);

        res.json({
            contract,
            securityAnalysis
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Blockchain Network Status Endpoint
app.get('/api/blockchain/status', async (req, res) => {
    try {
        const { blockchain } = req.query;
        
        const status = await BlockchainIntegrationService.getNetworkStatus(
            blockchain as string
        );

        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Compliance Check Endpoint
app.post('/api/compliance/check', async (req, res) => {
    try {
        const { userDetails, transaction } = req.body;
        
        const kycCheck = await ComplianceMonitorService.performKYCCheck(userDetails);
        const transactionCheck = await ComplianceMonitorService.checkTransactionCompliance(transaction);

        const complianceReport = ComplianceMonitorService.generateComplianceReport([
            kycCheck, 
            transactionCheck
        ]);

        res.json({
            kycCheck,
            transactionCheck,
            complianceReport
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Zoobayd Backend running on port ${PORT}`);
});