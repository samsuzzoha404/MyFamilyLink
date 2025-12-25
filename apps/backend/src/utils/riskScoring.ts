import Application from '../models/Application';
import Citizen from '../models/Citizen';
import crypto from 'crypto';

/**
 * Calculate risk score for an application (0-100)
 * Lower score = safer, Higher score = more suspicious
 */
export const calculateRiskScore = async (
  citizenId: string,
  programName: string,
  amount: number
): Promise<{ score: number; factors: string[] }> => {
  const factors: string[] = [];
  let score = 0;

  try {
    const citizen = await Citizen.findById(citizenId);
    if (!citizen) {
      return { score: 50, factors: ['Citizen not found'] };
    }

    // Check 1: Multiple applications in short time
    const recentApps = await Application.countDocuments({
      citizenId,
      createdAt: { $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) }, // Last 14 days
    });

    if (recentApps >= 3) {
      score += 25;
      factors.push(`Applied ${recentApps}x in 2 weeks`);
    } else if (recentApps === 2) {
      score += 10;
      factors.push('Multiple recent applications');
    }

    // Check 2: Income category vs amount requested
    const incomeThresholds: any = {
      'Cash Subsidy (STR)': { B40: 1000, M40: 500, T20: 0 },
      'Scholarship': { B40: 5000, M40: 3000, T20: 1000 },
      'Health Aid': { B40: 3000, M40: 2000, T20: 1000 },
      'Utility Subsidy': { B40: 500, M40: 300, T20: 0 },
    };

    const maxAmount = incomeThresholds[programName]?.[citizen.category];
    if (maxAmount !== undefined && amount > maxAmount) {
      score += 20;
      factors.push('Amount exceeds category limit');
    }

    // Check 3: T20 applying for B40 programs
    if (citizen.category === 'T20' && ['Cash Subsidy (STR)', 'Utility Subsidy'].includes(programName)) {
      score += 30;
      factors.push('T20 applying for B40-only aid');
    }

    // Check 4: No linked bank account
    if (!citizen.linkedAccount.hasAccount) {
      score += 15;
      factors.push('No linked bank account');
    }

    // Check 5: Check for duplicate household members (simplified)
    const sameIncome = await Citizen.countDocuments({
      householdIncome: citizen.householdIncome,
      category: citizen.category,
      _id: { $ne: citizenId },
    });

    if (sameIncome >= 3) {
      score += 15;
      factors.push('Potential duplicate household');
    }

    // Check 6: Previously rejected applications
    const rejectedCount = await Application.countDocuments({
      citizenId,
      status: 'Rejected',
    });

    if (rejectedCount > 0) {
      score += rejectedCount * 10;
      factors.push(`${rejectedCount} previous rejection(s)`);
    }

    // Cap at 100
    score = Math.min(score, 100);

    // Add positive factors if score is low
    if (score <= 20) {
      if (recentApps === 0) {
        factors.push('First-time applicant');
      }
      if (citizen.linkedAccount.hasAccount) {
        factors.push('Verified bank account');
      }
      factors.push('Income verified');
    }

    return { score, factors };
  } catch (error) {
    console.error('Error calculating risk score:', error);
    return { score: 50, factors: ['Error calculating risk'] };
  }
};

/**
 * Generate hash ID from IC number (simulated)
 */
export const generateHashId = (icNumber: string): string => {
  const hash = crypto.createHash('sha256').update(icNumber + 'salt-key').digest('hex');
  return `Hx${hash.substring(0, 10)}`;
};

/**
 * Determine region from IC number (simplified - first 2 digits)
 */
export const determineRegion = (icNumber: string): string => {
  const regions: any = {
    '01': 'Johor',
    '02': 'Kedah',
    '03': 'Kelantan',
    '04': 'Melaka',
    '05': 'Negeri Sembilan',
    '06': 'Pahang',
    '07': 'Penang',
    '08': 'Perak',
    '09': 'Perlis',
    '10': 'Selangor',
    '11': 'Terengganu',
    '12': 'Sabah',
    '13': 'Sarawak',
    '14': 'Kuala Lumpur',
    '15': 'Labuan',
    '16': 'Putrajaya',
  };

  const stateCode = icNumber.substring(6, 8);
  return regions[stateCode] || 'Selangor';
};

/**
 * Check eligibility based on rules
 */
export const checkEligibility = (
  category: string,
  householdIncome: number,
  programName: string
): { eligible: boolean; reason: string } => {
  const rules: any = {
    'Cash Subsidy (STR)': {
      B40: { maxIncome: 4850, amount: 500 },
      M40: { maxIncome: 10970, amount: 300 },
      T20: { maxIncome: Infinity, amount: 0 },
    },
    'Scholarship': {
      B40: { maxIncome: 4850, amount: 3000 },
      M40: { maxIncome: 10970, amount: 2000 },
      T20: { maxIncome: Infinity, amount: 1000 },
    },
    'Health Aid': {
      B40: { maxIncome: 4850, amount: 2000 },
      M40: { maxIncome: 10970, amount: 1500 },
      T20: { maxIncome: Infinity, amount: 500 },
    },
    'Utility Subsidy': {
      B40: { maxIncome: 4850, amount: 200 },
      M40: { maxIncome: 10970, amount: 100 },
      T20: { maxIncome: Infinity, amount: 0 },
    },
  };

  const rule = rules[programName]?.[category];
  if (!rule) {
    return { eligible: false, reason: 'Program not found' };
  }

  if (rule.amount === 0) {
    return { eligible: false, reason: `${category} not eligible for this program` };
  }

  if (householdIncome > rule.maxIncome) {
    return { eligible: false, reason: 'Income exceeds limit' };
  }

  return { eligible: true, reason: 'Meets eligibility criteria' };
};
