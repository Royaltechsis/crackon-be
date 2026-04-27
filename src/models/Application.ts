import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IApplication extends Document {
  listing: Types.ObjectId;
  artisan: Types.ObjectId;
  proposedBudget: number;
  coverLetter: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    listing: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'Listing ID is required'],
    },
    artisan: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Artisan ID is required'],
    },
    proposedBudget: {
      type: Number,
      required: [true, 'Proposed budget is required'],
      min: 0,
    },
    coverLetter: {
      type: String,
      required: [true, 'Cover letter is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Ensure one application per artisan per listing
applicationSchema.index({ listing: 1, artisan: 1 }, { unique: true });

export default mongoose.model<IApplication>('Application', applicationSchema);
