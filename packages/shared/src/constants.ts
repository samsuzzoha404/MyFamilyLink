// Application constants
export const APP_NAME = 'MyFamilyLink';
export const APP_VERSION = '1.0.0';

// Aid program constants
export const AID_PROGRAMS = {
  STR: {
    name: 'Sumbangan Tunai Rahmah (STR)',
    maxAmount: 2400,
    description: 'Cash assistance for low-income households',
  },
  BSH: {
    name: 'Bantuan Sara Hidup (BSH)',
    maxAmount: 3000,
    description: 'Cost of living assistance',
  },
  BTR: {
    name: 'Bantuan Tekun Rakyat (BTR)',
    maxAmount: 1500,
    description: 'Support for small businesses',
  },
  BANTUAN_PRIHATIN: {
    name: 'Bantuan Prihatin',
    maxAmount: 5000,
    description: 'Special relief assistance',
  },
} as const;

// Income thresholds (monthly, in RM)
export const INCOME_THRESHOLDS = {
  STR: 2500,
  BSH: 4000,
  BTR: 5000,
  BANTUAN_PRIHATIN: 3000,
} as const;

// Application statuses
export const APPLICATION_STATUS_LABELS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  DISBURSED: 'Disbursed',
} as const;

// Disbursement statuses
export const DISBURSEMENT_STATUS_LABELS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
} as const;

// Error codes
export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DUPLICATE_APPLICATION: 'DUPLICATE_APPLICATION',
  INELIGIBLE: 'INELIGIBLE',
  INVALID_MYKAD: 'INVALID_MYKAD',
  ZK_PROOF_FAILED: 'ZK_PROOF_FAILED',
} as const;

// Regex patterns
export const PATTERNS = {
  IC_NUMBER: /^\d{6}-\d{2}-\d{4}$/,
  PHONE_NUMBER: /^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
