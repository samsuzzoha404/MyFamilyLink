import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
  action: string;
  performedBy: 'System' | 'Admin';
  hashId: string;
  details: string;
  applicationId?: mongoose.Types.ObjectId;
  metadata?: any;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },
    performedBy: {
      type: String,
      enum: ['System', 'Admin'],
      required: true,
    },
    hashId: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      default: '',
    },
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ action: 1 });

export default mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
