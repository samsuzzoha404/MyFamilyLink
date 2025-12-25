import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

// TODO: Implement disbursement routes
router.post('/batches', (req, res) => {
  res.json({ message: 'Create disbursement batch endpoint - to be implemented' });
});

router.get('/batches', (req, res) => {
  res.json({ message: 'Get disbursement batches endpoint - to be implemented' });
});

router.get('/batches/:id', (req, res) => {
  res.json({ message: 'Get batch by ID endpoint - to be implemented' });
});

router.post('/batches/:id/execute', (req, res) => {
  res.json({ message: 'Execute disbursement endpoint - to be implemented' });
});

export default router;
