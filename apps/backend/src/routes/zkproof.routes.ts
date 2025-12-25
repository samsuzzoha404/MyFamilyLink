import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// TODO: Implement ZK proof routes
router.post('/generate', (req, res) => {
  res.json({ message: 'Generate ZK proof endpoint - to be implemented' });
});

router.post('/verify', (req, res) => {
  res.json({ message: 'Verify ZK proof endpoint - to be implemented' });
});

router.get('/eligibility/:userId', (req, res) => {
  res.json({ message: 'Check eligibility endpoint - to be implemented' });
});

export default router;
