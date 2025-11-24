import mongoose, { Schema } from 'mongoose';
import { IDepartment } from '../types';

const departmentSchema = new Schema<IDepartment>({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model<IDepartment>('Department', departmentSchema);

