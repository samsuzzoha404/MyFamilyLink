import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

// TODO: Implement admin routes
router.get('/dashboard/stats', (req, res) => {
  res.json({ message: 'Dashboard stats endpoint - to be implemented' });
});

router.get('/applications/pending', (req, res) => {
  res.json({ message: 'Pending applications endpoint - to be implemented' });
});

router.get('/audit-logs', (req, res) => {
  res.json({ message: 'Audit logs endpoint - to be implemented' });
});

router.get('/settings', (req, res) => {
  res.json({ message: 'System settings endpoint - to be implemented' });
});

router.patch('/settings', (req, res) => {
  res.json({ message: 'Update settings endpoint - to be implemented' });
});

export default router;
