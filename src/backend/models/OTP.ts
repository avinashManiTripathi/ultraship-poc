import mongoose, { Schema } from 'mongoose';
import { IOTP } from '../types';

const otpSchema = new Schema<IOTP>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index - MongoDB will automatically delete expired documents
  }
}, {
  timestamps: true
});

// Index for faster lookups
otpSchema.index({ email: 1 });

export default mongoose.model<IOTP>('OTP', otpSchema);

