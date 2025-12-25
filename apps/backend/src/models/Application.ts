import mongoose, { Document, Schema } from 'mongoose';
import { ICitizen } from './Citizen';

export interface IApplication extends Document {
  citizenId: mongoose.Types.ObjectId | ICitizen;
  applicantName: string;
  programName: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Disbursed';
  secretCode: string | null;
  disbursementMethod: string;
  accountDetails: {
    bankName?: string;
    accountNumber?: string;
    recipientName?: string;
  };
  // Risk & Fraud Detection
  riskScore: number;
  riskFactors: string[];
  isAutoApproved: boolean;
  reviewedBy?: string;
  reviewedAt?: Date;
  approvalDuration?: number; // in seconds
  // Regional & Tracking
  region?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    citizenId: {
      type: Schema.Types.ObjectId,
      ref: 'Citizen',
      required: true,
    },
    applicantName: {
      type: String,
      required: true,
      trim: true,
    },
    programName: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Disbursed'],
      default: 'Pending',
    },
    secretCode: {
      type: String,
      default: null,
    },
    disbursementMethod: {
      type: String,
      required: true,
      default: 'Bank Transfer',
    },
    accountDetails: {
      bankName: String,
      accountNumber: String,
      recipientName: String,
    },
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    riskFactors: {
      type: [String],
      default: [],
    },
    isAutoApproved: {
      type: Boolean,
      default: false,
    },
    reviewedBy: {
      type: String,
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    approvalDuration: {
      type: Number,
      default: null,
    },
    region: {
      type: String,
      default: 'Selangor',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ApplicationSchema.index({ status: 1, createdAt: -1 });
ApplicationSchema.index({ citizenId: 1 });

export default mongoose.model<IApplication>('Application', ApplicationSchema);
