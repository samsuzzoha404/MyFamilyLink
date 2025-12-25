import { Request, Response } from 'express';
import crypto from 'crypto';
import Citizen from '../models/Citizen';
import Application from '../models/Application';

/**
 * Generate a random session token (simulating ZK-proof token)
 */
const generateSessionToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

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
  console.log('💰 MOCK BANK TRANSFER INITIATED');
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
 * Step 1: Verify Eligibility
 * Takes MyKad number, generates session token, returns eligibility WITHOUT exposing income
 */
export const verifyEligibility = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mykadNumber } = req.body;

    if (!mykadNumber) {
      res.status(400).json({
        success: false,
        message: 'MyKad number is required',
      });
      return;
    }

    // Find citizen by MyKad
    const citizen = await Citizen.findOne({ mykadNumber: mykadNumber.trim() });

    if (!citizen) {
      res.status(404).json({
        success: false,
        message: 'MyKad not found in system',
      });
      return;
    }

    // Generate a new session token (simulating ZK-proof generation)
    const zkProofToken = generateSessionToken();

    // Update citizen with the session token
    citizen.currentSessionToken = zkProofToken;
    await citizen.save();

    console.log(`✅ Verification: ${citizen.fullName} (${citizen.category}) - Token Generated`);

    // Determine eligibility status based on income/category
    // Ali (B40, 1500): Eligible
    // Chong (M40, 4500): Review (borderline)
    // Subra (T20, 15000): Not Eligible
    let isEligible = true;
    let requiresReview = false;
    
    if (citizen.householdIncome > 5000) {
      // High income - Not eligible
      isEligible = false;
    } else if (citizen.householdIncome > 2500 && citizen.householdIncome <= 5000) {
      // Borderline - Requires manual review
      isEligible = true;
      requiresReview = true;
    } else {
      // Low income - Auto eligible
      isEligible = true;
      requiresReview = false;
    }

    // Return ONLY token and eligibility status (no income data exposed)
    res.status(200).json({
      success: true,
      zkProofToken,
      isEligible,
      requiresReview,
      fullName: citizen.fullName,
      category: citizen.category,
      // Intentionally NOT exposing householdIncome here
    });
  } catch (error) {
    console.error('Error in verifyEligibility:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification',
    });
  }
};

/**
 * Step 2: Submit Application
 * Uses zkProofToken (not MyKad), applies auto-approval logic
 */
export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { zkProofToken, programName, accountDetails } = req.body;

    if (!zkProofToken || !programName) {
      res.status(400).json({
        success: false,
        message: 'zkProofToken and programName are required',
      });
      return;
    }

    // Find citizen by session token (not MyKad!)
    const citizen = await Citizen.findOne({ currentSessionToken: zkProofToken });

    if (!citizen) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired session token',
      });
      return;
    }

    // Determine aid amount based on program name
    let aidAmount = 0;
    if (programName.toLowerCase().includes('str') || programName.toLowerCase().includes('rahmah')) {
      aidAmount = 100; // STR/Rahmah = RM100
    } else if (programName.toLowerCase().includes('sara')) {
      aidAmount = 350; // Sara Hidup = RM350
    } else {
      aidAmount = 500; // Default
    }

    // APPROVAL LOGIC BASED ON INCOME
    // Ali (income <= 2500): Auto-Approve & Disburse
    // Chong (2500 < income <= 5000): Pending manual review
    // Subra (income > 5000): Rejected
    let status: 'Pending' | 'Disbursed' | 'Rejected' = 'Pending';
    let secretCode: string | null = null;

    if (citizen.householdIncome > 5000) {
      // High income - Reject
      status = 'Rejected';
    } else if (citizen.householdIncome > 2500 && citizen.householdIncome <= 5000) {
      // Borderline - Pending manual review
      status = 'Pending';
    } else {
      // Low income - Auto-approve and disburse
      status = 'Disbursed';
      secretCode = generateSecretCode();
      mockBankTransfer(citizen.fullName, aidAmount, accountDetails || {}, secretCode);
    }

    // Create application
    const application = await Application.create({
      citizenId: citizen._id,
      applicantName: citizen.fullName,
      programName,
      amount: aidAmount,
      status,
      secretCode,
      disbursementMethod: 'Bank Transfer',
      accountDetails: accountDetails || {},
    });

    console.log(`📝 Application submitted: ${citizen.fullName} - ${programName} (${status})`);

    // Clear session token after use (one-time use)
    citizen.currentSessionToken = null;
    await citizen.save();

    // Different messages based on status
    let message = '';
    if (status === 'Disbursed') {
      message = 'Application auto-approved and disbursed!';
    } else if (status === 'Rejected') {
      message = 'Application rejected - Income exceeds eligibility threshold';
    } else {
      message = 'Application submitted for manual review';
    }

    res.status(201).json({
      success: true,
      message,
      application: {
        _id: application._id,
        status: application.status,
        secretCode: application.secretCode,
        amount: application.amount,
        programName: application.programName,
        createdAt: application.createdAt,
      },
    });
  } catch (error) {
    console.error('Error in submitApplication:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during application submission',
    });
  }
};
