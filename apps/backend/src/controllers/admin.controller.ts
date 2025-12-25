import { Request, Response } from 'express';
import crypto from 'crypto';
import Application from '../models/Application';
import Citizen from '../models/Citizen';

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
 * Get dashboard statistics
 */
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalApplications = await Application.countDocuments();
    const autoApproved = await Application.countDocuments({ status: 'Auto-Approved' });
    const manualApproved = await Application.countDocuments({ status: 'Approved' });
    const disbursed = await Application.countDocuments({ status: 'Disbursed' });
    const pendingReview = await Application.countDocuments({ status: 'Pending Review' });
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

    res.status(200).json({
      success: true,
      stats: {
        totalApplications,
        autoApproved: autoApproved + manualApproved,
        pendingReview,
        rejected,
        disbursed,
        fundsDistributed,
        applicationsByAidType: aidTypeData,
        approvalStatus: [
          { name: 'Auto-Approved', value: autoApproved, color: '#10b981' },
          { name: 'Approved', value: manualApproved, color: '#3b82f6' },
          { name: 'Disbursed', value: disbursed, color: '#8b5cf6' },
          { name: 'Pending Review', value: pendingReview, color: '#f59e0b' },
          { name: 'Rejected', value: rejected, color: '#ef4444' },
        ].filter(item => item.value > 0)
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

    // Update application
    application.status = 'Disbursed';
    application.secretCode = secretCode;
    await application.save();

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
 * Reject an application
 */
export const rejectApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const application = await Application.findById(id);

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
    await application.save();

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
