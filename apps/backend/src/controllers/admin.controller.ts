import { Request, Response } from 'express';
import crypto from 'crypto';
import Application from '../models/Application';
import Citizen from '../models/Citizen';
import ActivityLog from '../models/ActivityLog';
import { calculateRiskScore, generateHashId, checkEligibility } from '../utils/riskScoring';

/**
 * Generate a secret code for disbursement tracking
 */
const generateSecretCode = (): string => {
  return `STR-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
};

/**
 * Mock bank transfer logging
 */
const mockBankTransfer = (
  applicantName: string,
  amount: number,
  bankDetails: any,
  secretCode: string
): void => {
  console.log('\n🏦 ════════════════════════════════════════════════════════');
  console.log('💰 MOCK BANK TRANSFER INITIATED (ADMIN APPROVAL)');
  console.log('════════════════════════════════════════════════════════');
  console.log(`📋 Reference Code: ${secretCode}`);
  console.log(`👤 Recipient: ${applicantName}`);
  console.log(`💵 Amount: RM ${amount.toFixed(2)}`);
  console.log(`🏦 Bank: ${bankDetails.bankName || 'N/A'}`);
  console.log(`🔢 Account: ${bankDetails.accountNumber || 'N/A'}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  console.log('✅ Status: TRANSFER SUCCESSFUL (SIMULATED)');
  console.log('════════════════════════════════════════════════════════\n');
};

/**
 * Get dashboard statistics with enhanced metrics
 */
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalApplications = await Application.countDocuments();
    const autoApproved = await Application.countDocuments({ isAutoApproved: true });
    const manualApproved = await Application.countDocuments({ isAutoApproved: false, status: { $in: ['Approved', 'Disbursed'] } });
    const disbursed = await Application.countDocuments({ status: 'Disbursed' });
    const pendingReview = await Application.countDocuments({ status: 'Pending' });
    const rejected = await Application.countDocuments({ status: 'Rejected' });

    // Calculate total funds distributed
    const disbursedApps = await Application.find({ status: 'Disbursed' });
    const fundsDistributed = disbursedApps.reduce((sum, app) => sum + app.amount, 0);

    // Get applications by aid type
    const applicationsByAidType = await Application.aggregate([
      { $group: { _id: '$programName', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const aidTypeData = applicationsByAidType.map((item, index) => {
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
      return {
        name: item._id,
        value: item.count,
        color: colors[index % colors.length]
      };
    });

    // Regional breakdown
    const regionalData = await Application.aggregate([
      { $group: { _id: '$region', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Average approval time
    const reviewedApps = await Application.find({ approvalDuration: { $ne: null } });
    const avgApprovalTime = reviewedApps.length > 0
      ? reviewedApps.reduce((sum, app) => sum + (app.approvalDuration || 0), 0) / reviewedApps.length
      : 0;

    // Risk distribution
    const highRisk = await Application.countDocuments({ riskScore: { $gte: 70 } });
    const mediumRisk = await Application.countDocuments({ riskScore: { $gte: 30, $lt: 70 } });
    const lowRisk = await Application.countDocuments({ riskScore: { $lt: 30 } });

    res.status(200).json({
      success: true,
      stats: {
        totalApplications,
        autoApproved: autoApproved,
        manualApproved: manualApproved,
        pendingReview,
        rejected,
        disbursed,
        fundsDistributed,
        applicationsByAidType: aidTypeData,
        approvalStatus: [
          { name: 'Auto-Approved', value: autoApproved, color: '#10b981' },
          { name: 'Manual Approved', value: manualApproved, color: '#3b82f6' },
          { name: 'Disbursed', value: disbursed, color: '#8b5cf6' },
          { name: 'Pending Review', value: pendingReview, color: '#f59e0b' },
          { name: 'Rejected', value: rejected, color: '#ef4444' },
        ].filter(item => item.value > 0),
        regionalData: regionalData.map(r => ({ region: r._id, count: r.count })),
        metrics: {
          avgApprovalTime: Math.round(avgApprovalTime),
          highRiskApplications: highRisk,
          mediumRiskApplications: mediumRisk,
          lowRiskApplications: lowRisk,
          autoApprovalRate: totalApplications > 0 ? Math.round((autoApproved / totalApplications) * 100) : 0,
        }
      }
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard stats',
    });
  }
};

/**
 * Get all applications (sorted by date, newest first)
 */
export const getAllApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await Application.find()
      .populate('citizenId', 'fullName mykadNumber householdIncome category')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error('Error in getAllApplications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching applications',
    });
  }
};

/**
 * Approve an application (manual admin approval)
 * Updates status to 'Disbursed', generates secret code, triggers mock bank transfer
 */
export const approveApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const startTime = Date.now();

    const application = await Application.findById(id).populate('citizenId');

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found',
      });
      return;
    }

    if (application.status === 'Disbursed') {
      res.status(400).json({
        success: false,
        message: 'Application already disbursed',
      });
      return;
    }

    // Generate secret code
    const secretCode = generateSecretCode();

    // Calculate approval duration
    const approvalDuration = Math.round((Date.now() - new Date(application.createdAt).getTime()) / 1000);

    // Update application
    application.status = 'Disbursed';
    application.secretCode = secretCode;
    application.reviewedBy = 'Admin User';
    application.reviewedAt = new Date();
    application.approvalDuration = approvalDuration;
    await application.save();

    // Log activity
    const citizen = application.citizenId as any;
    const hashId = generateHashId(citizen.mykadNumber);
    await ActivityLog.create({
      action: 'Admin-approved',
      performedBy: 'Admin',
      hashId,
      details: `${application.programName} - RM ${application.amount}`,
      applicationId: application._id,
      metadata: { secretCode, approvalDuration },
    });

    // Trigger mock bank transfer
    mockBankTransfer(
      application.applicantName,
      application.amount,
      application.accountDetails,
      secretCode
    );

    console.log(`✅ Admin approved: ${application.applicantName} - ${application.programName}`);

    res.status(200).json({
      success: true,
      message: 'Application approved and disbursed successfully',
      application: {
        id: application._id,
        applicantName: application.applicantName,
        programName: application.programName,
        amount: application.amount,
        status: application.status,
        secretCode: application.secretCode,
        approvalDuration,
      },
    });
  } catch (error) {
    console.error('Error in approveApplication:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during approval',
    });
  }
};

/**
 * Get a single application by ID
 */
export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id).populate(
      'citizenId',
      'fullName mykadNumber householdIncome category'
    );

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('Error in getApplicationById:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching application',
    });
  }
};

/**
 * Bulk approve applications
 */
export const bulkApproveApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { applicationIds } = req.body;

    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Please provide an array of application IDs',
      });
      return;
    }

    const results = {
      approved: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const id of applicationIds) {
      try {
        const application = await Application.findById(id).populate('citizenId');
        
        if (!application || application.status === 'Disbursed') {
          results.failed++;
          results.errors.push(`${id}: Already processed or not found`);
          continue;
        }

        const secretCode = generateSecretCode();
        const approvalDuration = Math.round((Date.now() - new Date(application.createdAt).getTime()) / 1000);

        application.status = 'Disbursed';
        application.secretCode = secretCode;
        application.reviewedBy = 'Admin User (Bulk)';
        application.reviewedAt = new Date();
        application.approvalDuration = approvalDuration;
        await application.save();

        // Log activity
        const citizen = application.citizenId as any;
        const hashId = generateHashId(citizen.mykadNumber);
        await ActivityLog.create({
          action: 'Batch Approved',
          performedBy: 'Admin',
          hashId,
          details: `${application.programName} - RM ${application.amount} (Bulk action)`,
          applicationId: application._id,
        });

        mockBankTransfer(application.applicantName, application.amount, application.accountDetails, secretCode);
        results.approved++;
      } catch (err) {
        results.failed++;
        results.errors.push(`${id}: Processing error`);
      }
    }

    res.status(200).json({
      success: true,
      message: `Bulk approval completed: ${results.approved} approved, ${results.failed} failed`,
      results,
    });
  } catch (error) {
    console.error('Error in bulkApproveApplications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during bulk approval',
    });
  }
};

/**
 * Bulk reject applications
 */
export const bulkRejectApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { applicationIds, reason } = req.body;

    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Please provide an array of application IDs',
      });
      return;
    }

    const results = {
      rejected: 0,
      failed: 0,
    };

    for (const id of applicationIds) {
      try {
        const application = await Application.findById(id).populate('citizenId');
        
        if (!application || application.status === 'Disbursed') {
          results.failed++;
          continue;
        }

        application.status = 'Rejected';
        application.reviewedBy = 'Admin User (Bulk)';
        application.reviewedAt = new Date();
        await application.save();

        // Log activity
        const citizen = application.citizenId as any;
        const hashId = generateHashId(citizen.mykadNumber);
        await ActivityLog.create({
          action: 'Batch Rejected',
          performedBy: 'Admin',
          hashId,
          details: reason || `${application.programName} - Bulk rejection`,
          applicationId: application._id,
        });

        results.rejected++;
      } catch (err) {
        results.failed++;
      }
    }

    res.status(200).json({
      success: true,
      message: `Bulk rejection completed: ${results.rejected} rejected, ${results.failed} failed`,
      results,
    });
  } catch (error) {
    console.error('Error in bulkRejectApplications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during bulk rejection',
    });
  }
};

/**
 * Get activity feed (recent system activities)
 */
export const getActivityFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    
    const activities = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error('Error in getActivityFeed:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching activity feed',
    });
  }
};

/**
 * Verify hash ID
 */
export const verifyHashId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hashId } = req.body;

    if (!hashId) {
      res.status(400).json({
        success: false,
        message: 'Hash ID is required',
      });
      return;
    }

    // Find recent activities with this hash
    const activities = await ActivityLog.find({ hashId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    if (activities.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Hash ID not found in system',
        valid: false,
      });
      return;
    }

    // Check for suspicious patterns
    const recentCount = activities.filter(a => 
      new Date(a.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length;

    const suspicious = recentCount > 5;

    res.status(200).json({
      success: true,
      valid: true,
      hashId,
      lastActivity: activities[0].createdAt,
      totalActivities: activities.length,
      recentActivities: recentCount,
      suspicious,
      suspiciousReason: suspicious ? 'High activity frequency detected' : null,
      recentActions: activities.slice(0, 5).map(a => ({
        action: a.action,
        timestamp: a.createdAt,
        details: a.details,
      })),
    });
  } catch (error) {
    console.error('Error in verifyHashId:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during hash verification',
    });
  }
};

/**
 * Eligibility simulator
 */
export const simulateEligibility = async (req: Request, res: Response): Promise<void> => {
  try {
    const { householdIncome, householdSize, programName } = req.body;

    if (!householdIncome || !programName) {
      res.status(400).json({
        success: false,
        message: 'Household income and program name are required',
      });
      return;
    }

    // Determine category based on income
    let category = 'B40';
    if (householdIncome > 10970) {
      category = 'T20';
    } else if (householdIncome > 4850) {
      category = 'M40';
    }

    // Check eligibility
    const eligibilityResult = checkEligibility(category, householdIncome, programName);

    res.status(200).json({
      success: true,
      simulation: {
        input: {
          householdIncome,
          householdSize,
          programName,
        },
        result: {
          category,
          eligible: eligibilityResult.eligible,
          reason: eligibilityResult.reason,
          recommendation: eligibilityResult.eligible 
            ? `Applicant qualifies for ${programName} under ${category} category`
            : `Applicant does not qualify: ${eligibilityResult.reason}`,
        },
      },
    });
  } catch (error) {
    console.error('Error in simulateEligibility:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during eligibility simulation',
    });
  }
};

/**
 * Get admin performance metrics
 */
export const getAdminMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's admin actions
    const todayReviewed = await Application.countDocuments({
      reviewedAt: { $gte: today },
      reviewedBy: { $ne: null },
    });

    const todayApproved = await Application.countDocuments({
      reviewedAt: { $gte: today },
      reviewedBy: { $ne: null },
      status: 'Disbursed',
    });

    const todayRejected = await Application.countDocuments({
      reviewedAt: { $gte: today },
      reviewedBy: { $ne: null },
      status: 'Rejected',
    });

    // Average review time today
    const todayApps = await Application.find({
      reviewedAt: { $gte: today },
      approvalDuration: { $ne: null },
    });

    const avgReviewTime = todayApps.length > 0
      ? todayApps.reduce((sum, app) => sum + (app.approvalDuration || 0), 0) / todayApps.length
      : 0;

    // Accuracy score (approved vs total reviewed)
    const accuracyScore = todayReviewed > 0 
      ? Math.round((todayApproved / todayReviewed) * 100)
      : 0;

    res.status(200).json({
      success: true,
      metrics: {
        todayReviewed,
        todayApproved,
        todayRejected,
        avgReviewTime: Math.round(avgReviewTime),
        accuracyScore,
      },
    });
  } catch (error) {
    console.error('Error in getAdminMetrics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching admin metrics',
    });
  }
};

/**
 * Reject an application
 */
export const rejectApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const application = await Application.findById(id).populate('citizenId');

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found',
      });
      return;
    }

    if (application.status === 'Disbursed') {
      res.status(400).json({
        success: false,
        message: 'Cannot reject a disbursed application',
      });
      return;
    }

    application.status = 'Rejected';
    application.reviewedBy = 'Admin User';
    application.reviewedAt = new Date();
    await application.save();

    // Log activity
    const citizen = application.citizenId as any;
    const hashId = generateHashId(citizen.mykadNumber);
    await ActivityLog.create({
      action: 'Rejected',
      performedBy: 'Admin',
      hashId,
      details: reason || `${application.programName} - Application rejected`,
      applicationId: application._id,
    });

    console.log(`❌ Admin rejected: ${application.applicantName} - ${application.programName}`);

    res.status(200).json({
      success: true,
      message: 'Application rejected',
      application: {
        id: application._id,
        status: application.status,
      },
    });
  } catch (error) {
    console.error('Error in rejectApplication:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during rejection',
    });
  }
};
