import { Router } from 'express';
import { verifyEligibility, submitApplication } from '../controllers/citizen.controller';
import {
  getAllApplications,
  approveApplication,
  getApplicationById,
  rejectApplication,
  getDashboardStats,
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
 * GET /admin/application/:id
 * Get single application details
 * Returns: { application: {...} }
 */
router.get('/admin/application/:id', getApplicationById);

/**
 * PATCH /admin/application/:id/approve
 * Manually approve a pending application
 * Returns: { application, secretCode }
 */
router.patch('/admin/application/:id/approve', approveApplication);

/**
 * PATCH /admin/application/:id/reject
 * Reject an application
 * Body: { reason: string }
 * Returns: { application }
 */
router.patch('/admin/application/:id/reject', rejectApplication);

// ============================================
// ZK PROOF ROUTES
// ============================================

/**
 * Zero-Knowledge Proof routes for advanced cryptographic operations
 */
router.use('/zkproof', zkproofRoutes);

export default router;
