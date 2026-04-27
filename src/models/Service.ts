import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  category?: string;
  price?: number;
  duration?: string;
  location?: string;
  tags: string[];
  isPublished: boolean;
  artisan: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    artisan: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model<IService>('Service', serviceSchema);

export default Service;
