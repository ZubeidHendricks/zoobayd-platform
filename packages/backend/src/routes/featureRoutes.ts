import express from 'express';
import { FeatureController } from '../controllers/FeatureController';
import { auth, rbac } from '../middleware';

const router = express.Router();
const controller = new FeatureController();

router.get('/:featureId/access', auth, controller.checkAccess);
router.post('/:featureId/track', auth, controller.trackUsage);
router.get('/:featureId/metrics', auth, rbac('analytics'), controller.getMetrics);
router.post('/:featureId/test', auth, rbac('admin'), controller.createTest);

export default router;