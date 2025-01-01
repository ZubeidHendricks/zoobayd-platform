import express from 'express';
import { register } from '../metrics';
import { auth, rbac } from '../middleware';

const router = express.Router();

router.get('/metrics', auth, rbac('admin'), async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

export default router;