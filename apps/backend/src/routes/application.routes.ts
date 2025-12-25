import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// TODO: Implement application routes
router.post('/', (req, res) => {
  res.json({ message: 'Create application endpoint - to be implemented' });
});

router.get('/', (req, res) => {
  res.json({ message: 'Get applications endpoint - to be implemented' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get application by ID endpoint - to be implemented' });
});

router.patch('/:id', (req, res) => {
  res.json({ message: 'Update application endpoint - to be implemented' });
});

export default router;
