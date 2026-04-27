import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProject extends Document {
  listing: Types.ObjectId;
  customer: Types.ObjectId;
  artisan: Types.ObjectId;
  application: Types.ObjectId;
  agreementBudget: number;
  status: 'active' | 'in-progress' | 'completed' | 'cancelled' | 'disputed';
  progress: number; // percentage 0-100
  startDate: Date;
  dueDate: Date;
  completionDate?: Date;
  milestones?: {
    title: string;
    description: string;
    dueDate: Date;
    status: 'pending' | 'completed';
    completedDate?: Date;
  }[];
  updates: {
    artisan: Types.ObjectId;
    message: string;
    attachments?: string[];
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    listing: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'Listing ID is required'],
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer ID is required'],
    },
    artisan: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Artisan ID is required'],
    },
    application: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Application ID is required'],
    },
    agreementBudget: {
      type: Number,
      required: [true, 'Agreement budget is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'in-progress', 'completed', 'cancelled', 'disputed'],
      default: 'active',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    completionDate: Date,
    milestones: [
      {
        title: String,
        description: String,
        dueDate: Date,
        status: {
          type: String,
          enum: ['pending', 'completed'],
          default: 'pending',
        },
        completedDate: Date,
      },
    ],
    updates: [
      {
        artisan: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        message: String,
        attachments: [String],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IProject>('Project', projectSchema);
