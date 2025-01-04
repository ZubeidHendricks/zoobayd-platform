import express from 'express';
import { MongoClient } from 'mongodb';
import ContractTemplateService from '../services/marketplace/contract-template-service';
import MonitoringService from '../services/monitoring-service';

const createMarketplaceRoutes = (mongoClient: MongoClient) => {
    const router = express.Router();
    const templateService = new ContractTemplateService(mongoClient);

    // Create New Contract Template
    router.post('/templates', async (req, res) => {
        const monitoringSpan = MonitoringService.startTrace('create_contract_template');

        try {
            const userId = req.user.id; // Assumes authentication middleware
            const template = await templateService.createTemplate(userId, req.body);
            
            MonitoringService.recordRequest('marketplace', 'create_template');
            monitoringSpan.end();

            res.status(201).json(template);
        } catch (error) {
            MonitoringService.recordError('marketplace', 'template_creation_failed');
            monitoringSpan.recordException(error);
            monitoringSpan.end();

            res.status(400).json({ 
                message: error instanceof Error ? error.message : 'Template creation failed' 
            });
        }
    });

    // Search Contract Templates
    router.get('/templates/search', async (req, res) => {
        const monitoringSpan = MonitoringService.startTrace('search_contract_templates');

        try {
            const { 
                blockchainType, 
                domain, 
                complexity, 
                tags, 
                minPrice, 
                maxPrice 
            } = req.query;

            const templates = await templateService.searchTemplates({
                blockchainType: blockchainType as string,
                domain: domain as string,
                complexity: complexity as string,
                tags: tags ? (tags as string).split(',') : undefined,
                minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined
            });
            
            MonitoringService.recordRequest('marketplace', 'search_templates');
            monitoringSpan.end();

            res.json(templates);
        } catch (error) {
            MonitoringService.recordError('marketplace', 'template_search_failed');
            monitoringSpan.recordException(error);
            monitoringSpan.end();

            res.status(400).json({ 
                message: error instanceof Error ? error.message : 'Template search failed' 
            });
        }
    });

    // Get Specific Template
    router.get('/templates/:id', async (req, res) => {
        const monitoringSpan = MonitoringService.startTrace('get_contract_template');

        try {
            const template = await templateService.getTemplateById(req.params.id);
            
            if (!template) {
                return res.status(404).json({ message: 'Template not found' });
            }

            MonitoringService.recordRequest('marketplace', 'get_template');
            monitoringSpan.end();

            res.json(template);
        } catch (error) {
            MonitoringService.recordError('marketplace', 'get_template_failed');
            monitoringSpan.recordException(error);
            monitoringSpan.end();

            res.status(400).json({ 
                message: error instanceof Error ? error.message : 'Failed to retrieve template' 
            });
        }
    });

    // Download Template
    router.post('/templates/:id/download', async (req, res) => {
        const monitoringSpan = MonitoringService.startTrace('download_contract_template');

        try {
            const template = await templateService.downloadTemplate(req.params.id);
            
            if (!template) {
                return res.status(404).json({ message: 'Template not found' });
            }

            MonitoringService.recordRequest('marketplace', 'download_template');
            monitoringSpan.end();

            res.json(template);
        } catch (error) {
            MonitoringService.recordError('marketplace', 'download_template_failed');
            monitoringSpan.recordException(error);
            monitoringSpan.end();

            res.status(400).json({ 
                message: error instanceof Error ? error.message : 'Failed to download template' 
            });
        }
    });

    // Rate Template
    router.post('/templates/:id/rate', async (req, res) => {
        const monitoringSpan = MonitoringService.startTrace('rate_contract_template');

        try {
            const { rating } = req.body;
            const template = await templateService.rateTemplate(req.params.id, rating);
            
            if (!template) {
                return res.status(404).json({ message: 'Template not found' });
            }

            MonitoringService.recordRequest('marketplace', 'rate_template');
            monitoringSpan.end();

            res.json(template);
        } catch (error) {
            MonitoringService.recordError('marketplace', 'rate_template_failed');
            monitoringSpan.recordException(error);
            monitoringSpan.end();

            res.status(400).json({ 
                message: error instanceof Error ? error.message : 'Failed to rate template' 
            });
        }
    });

    return router;
};

export default createMarketplaceRoutes;