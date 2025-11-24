import { Document } from 'mongoose';
import { Request, Response } from 'express';
import { Session } from 'express-session';

// User Types
export interface IUser extends Document {
  _id: any;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'employee';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Employee Types
export interface IEmployee extends Document {
  _id: any;
  name: string;
  age: number;
  class: 'Junior' | 'Mid-Level' | 'Senior' | 'Lead' | 'Manager';
  subjects: string[];
  attendance: number;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: Date;
  salary: number;
  address: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  createdAt: Date;
  updatedAt: Date;
}

// Department Types
export interface IDepartment extends Document {
  _id: any;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// OTP Types
export interface IOTP extends Document {
  _id: any;
  email: string;
  otp: string;
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// GraphQL Context
export interface SessionUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'employee';
}

export interface ISession extends Session {
  user?: SessionUser;
}

export interface IContext {
  user: SessionUser | null;
  session: ISession;
  req: Request;
  res: Response;
}

// GraphQL Input Types
export interface EmployeeInput {
  name: string;
  age: number;
  class: 'Junior' | 'Mid-Level' | 'Senior' | 'Lead' | 'Manager';
  subjects: string[];
  attendance: number;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  salary: number;
  address: string;
  status?: 'Active' | 'Inactive' | 'On Leave';
}

export interface DepartmentInput {
  name: string;
  description?: string;
}

export interface EmployeeFilter {
  name?: string;
  department?: string;
  class?: string;
  status?: string;
  minAge?: number;
  maxAge?: number;
}

// GraphQL Response Types
export interface PageInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface EmployeeConnection {
  employees: IEmployee[];
  totalCount: number;
  pageInfo: PageInfo;
}

export interface AuthPayload {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  message: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  otp?: string;
}

