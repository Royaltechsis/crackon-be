import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IListing extends Document {
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
  };
  duration?: string;
  location: string;
  skills: string[];
  customer: Types.ObjectId;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new Schema<IListing>(
  {
    title: {
      type: String,
      required: [true, 'Listing title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Listing description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    budget: {
      min: {
        type: Number,
        required: [true, 'Minimum budget is required'],
        min: 0,
      },
      max: {
        type: Number,
        required: [true, 'Maximum budget is required'],
        min: 0,
      },
    },
    duration: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer ID is required'],
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed', 'cancelled'],
      default: 'open',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IListing>('Listing', listingSchema);
