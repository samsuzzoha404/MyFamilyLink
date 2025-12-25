import { Router } from 'express';
import { verifyEligibility, submitApplication } from '../controllers/citizen.controller';
import {
  getAllApplications,
  approveApplication,
  getApplicationById,
  rejectApplication,
  getDashboardStats,
  bulkApproveApplications,
  bulkRejectApplications,
  getActivityFeed,
  verifyHashId,
  simulateEligibility,
  getAdminMetrics,
} from '../controllers/admin.controller';
import zkproofRoutes from './zkproof.routes';

const router = Router();

// ============================================
// CITIZEN ROUTES (Privacy-Preserving Flow)
// ============================================

/**
 * POST /citizen/verify
 * Step 1: Verify MyKad and generate zkProofToken
 * Body: { mykadNumber: string }
 * Returns: { zkProofToken, isEligible, fullName }
 */
router.post('/citizen/verify', verifyEligibility);

/**
 * POST /citizen/submit
 * Step 2: Submit application using zkProofToken (not MyKad)
 * Body: { zkProofToken: string, programName: string, accountDetails: object }
 * Returns: { application, status, secretCode }
 */
router.post('/citizen/submit', submitApplication);

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * GET /admin/dashboard/stats
 * Get dashboard statistics
 * Returns: { stats: {...} }
 */
router.get('/admin/dashboard/stats', getDashboardStats);

/**
 * GET /admin/applications
 * Get all applications (sorted by date)
 * Returns: { applications: [...] }
 */
router.get('/admin/applications', getAllApplications);

/**
 * GET /admin/applications/:id
 * Get single application details
 * Returns: { application: {...} }
 */
router.get('/admin/applications/:id', getApplicationById);

/**
 * PATCH /admin/applications/:id/approve
 * Manually approve a pending application
 * Returns: { application, secretCode }
 */
router.patch('/admin/applications/:id/approve', approveApplication);

/**
 * PATCH /admin/applications/:id/reject
 * Reject an application
 * Body: { reason: string }
 * Returns: { application }
 */
router.patch('/admin/applications/:id/reject', rejectApplication);

/**
 * POST /admin/applications/bulk-approve
 * Bulk approve multiple applications
 * Body: { applicationIds: string[] }
 */
router.post('/admin/applications/bulk-approve', bulkApproveApplications);

/**
 * POST /admin/applications/bulk-reject
 * Bulk reject multiple applications
 * Body: { applicationIds: string[], reason?: string }
 */
router.post('/admin/applications/bulk-reject', bulkRejectApplications);

/**
 * GET /admin/activity-feed
 * Get recent activity logs
 * Query: { limit?: number }
 */
router.get('/admin/activity-feed', getActivityFeed);

/**
 * POST /admin/verify-hash
 * Verify a hash ID
 * Body: { hashId: string }
 */
router.post('/admin/verify-hash', verifyHashId);

/**
 * POST /admin/simulate-eligibility
 * Simulate eligibility for testing
 * Body: { householdIncome: number, householdSize: number, programName: string }
 */
router.post('/admin/simulate-eligibility', simulateEligibility);

/**
 * GET /admin/metrics
 * Get admin performance metrics
 */
router.get('/admin/metrics', getAdminMetrics);

// ============================================
// ZK PROOF ROUTES
// ============================================

/**
 * Zero-Knowledge Proof routes for advanced cryptographic operations
 */
router.use('/zkproof', zkproofRoutes);

export default router;
