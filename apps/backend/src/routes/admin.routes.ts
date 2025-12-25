import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as adminController from '../controllers/admin.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

// Dashboard & Statistics
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/metrics', adminController.getAdminMetrics);

// Applications Management
router.get('/applications', adminController.getAllApplications);
router.get('/applications/:id', adminController.getApplicationById);
router.patch('/applications/:id/approve', adminController.approveApplication);
router.patch('/applications/:id/reject', adminController.rejectApplication);

// Bulk Actions
router.post('/applications/bulk-approve', adminController.bulkApproveApplications);
router.post('/applications/bulk-reject', adminController.bulkRejectApplications);

// Activity & Monitoring
router.get('/activity-feed', adminController.getActivityFeed);
router.post('/verify-hash', adminController.verifyHashId);

// Tools
router.post('/simulate-eligibility', adminController.simulateEligibility);

export default router;
