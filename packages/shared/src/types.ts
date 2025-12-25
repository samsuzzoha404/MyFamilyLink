// User types
export interface User {
  id: string;
  email: string;
  role: 'citizen' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Application types
export interface Application {
  id: string;
  userId: string;
  programType: AidProgram;
  status: ApplicationStatus;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  zkProof?: string;
  eligibilityScore?: number;
}

export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DISBURSED = 'DISBURSED',
}

export enum AidProgram {
  STR = 'STR',
  BSH = 'BSH',
  BTR = 'BTR',
  BANTUAN_PRIHATIN = 'BANTUAN_PRIHATIN',
}

// Disbursement types
export interface Disbursement {
  id: string;
  batchId: string;
  applicationId: string;
  amount: number;
  status: DisbursementStatus;
  disbursedAt?: Date;
  referenceNumber?: string;
}

export enum DisbursementStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// MyKad types
export interface MyKadData {
  icNumber: string;
  name: string;
  address: string;
  dateOfBirth: Date;
  gender: 'M' | 'F';
  citizenship: string;
  religion?: string;
}

// ZK Proof types
export interface ZKProof {
  proof: string;
  publicSignals: string[];
  verificationKey: string;
}

export interface EligibilityCheck {
  isEligible: boolean;
  programType: AidProgram;
  score: number;
  factors: {
    income: boolean;
    familySize: boolean;
    dependents: boolean;
    location: boolean;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
