import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Application validation schemas
export const applicationSchema = z.object({
  programType: z.enum(['STR', 'BSH', 'BTR', 'BANTUAN_PRIHATIN']),
  icNumber: z.string().regex(/^\d{6}-\d{2}-\d{4}$/, 'Invalid IC number format'),
  monthlyIncome: z.number().min(0, 'Income must be positive'),
  familySize: z.number().int().min(1, 'Family size must be at least 1'),
  dependents: z.number().int().min(0, 'Dependents must be non-negative'),
});

// MyKad validation
export const myKadSchema = z.object({
  icNumber: z.string().regex(/^\d{6}-\d{2}-\d{4}$/, 'Invalid IC number format'),
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  dateOfBirth: z.date(),
  gender: z.enum(['M', 'F']),
  citizenship: z.string().min(1, 'Citizenship is required'),
});

// Disbursement validation
export const disbursementSchema = z.object({
  applicationId: z.string().uuid('Invalid application ID'),
  amount: z.number().positive('Amount must be positive'),
});

// Settings validation
export const settingsSchema = z.object({
  incomeThreshold: z.number().positive().optional(),
  maxDisbursementAmount: z.number().positive().optional(),
  eligibilityScoreThreshold: z.number().min(0).max(100).optional(),
});
