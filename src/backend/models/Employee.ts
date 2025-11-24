import mongoose, { Schema } from 'mongoose';
import { IEmployee } from '../types';

const employeeSchema = new Schema<IEmployee>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    index: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: 18,
    max: 100
  },
  class: {
    type: String,
    required: [true, 'Class is required'],
    enum: ['Junior', 'Mid-Level', 'Senior', 'Lead', 'Manager'],
    index: true
  },
  subjects: [{
    type: String,
    required: true
  }],
  attendance: {
    type: Number,
    required: [true, 'Attendance is required'],
    min: 0,
    max: 100
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    index: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    index: true
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true
  },
  joinDate: {
    type: Date,
    required: [true, 'Join date is required']
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: 0
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active',
    index: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IEmployee>('Employee', employeeSchema);

