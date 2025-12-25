import mongoose, { Document, Schema } from 'mongoose';

export interface ICitizen extends Document {
  mykadNumber: string;
  fullName: string;
  householdIncome: number;
  category: 'B40' | 'M40' | 'T20';
  currentSessionToken: string | null;
  linkedAccount: {
    hasAccount: boolean;
    bankName?: string;
    accountNumber?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CitizenSchema = new Schema<ICitizen>(
  {
    mykadNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    householdIncome: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: ['B40', 'M40', 'T20'],
      required: true,
    },
    currentSessionToken: {
      type: String,
      default: null,
    },
    linkedAccount: {
      hasAccount: {
        type: Boolean,
        default: false,
      },
      bankName: {
        type: String,
        default: '',
      },
      accountNumber: {
        type: String,
        default: '',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster token lookups
CitizenSchema.index({ currentSessionToken: 1 });

export default mongoose.model<ICitizen>('Citizen', CitizenSchema);
