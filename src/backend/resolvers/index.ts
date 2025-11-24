import { GraphQLError } from 'graphql';
import User from '../models/User';
import Employee from '../models/Employee';
import Department from '../models/Department';
import OTP from '../models/OTP';
import { generateOTP, sendOTPEmail } from '../utils/email';
import { isAdmin, isAdminOrEmployee } from '../middleware/auth';
import {
  IContext,
  EmployeeFilter,
  EmployeeInput,
  DepartmentInput,
  EmployeeConnection,
  AuthPayload,
  OTPResponse
} from '../types';

interface EmployeesArgs {
  filter?: EmployeeFilter;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

interface EmployeeArgs {
  id: string;
}

interface RequestOTPArgs {
  email: string;
}

interface VerifyOTPArgs {
  email: string;
  otp: string;
}

interface AddEmployeeArgs {
  input: EmployeeInput;
}

interface UpdateEmployeeArgs {
  id: string;
  input: Partial<EmployeeInput>;
}

interface DeleteEmployeeArgs {
  id: string;
}

interface AddDepartmentArgs {
  input: DepartmentInput;
}

interface UpdateDepartmentArgs {
  id: string;
  input: DepartmentInput;
}

interface DeleteDepartmentArgs {
  id: string;
}

interface DepartmentArgs {
  id: string;
}

const resolvers = {
  Query: {
    // Get employees with filtering, pagination, and sorting
    employees: async (_: any, args: EmployeesArgs, context: IContext): Promise<EmployeeConnection> => {
      const { filter, page = 1, pageSize = 10, sortBy = 'name', sortOrder = 'ASC' } = args;
      isAdminOrEmployee(context);

      try {
        // Build filter query
        const query: any = { status: 'Active' }; // Default to active employees

        if (filter) {
          if (filter.name) {
            query.name = { $regex: filter.name, $options: 'i' }; // Case-insensitive search
          }
          if (filter.department) {
            query.department = filter.department;
          }
          if (filter.class) {
            query.class = filter.class;
          }
          if (filter.status) {
            query.status = filter.status;
          }
          if (filter.minAge || filter.maxAge) {
            query.age = {};
            if (filter.minAge) query.age.$gte = filter.minAge;
            if (filter.maxAge) query.age.$lte = filter.maxAge;
          }
        }

        // Build sort object
        const sort: any = {};
        sort[sortBy] = sortOrder === 'ASC' ? 1 : -1;

        // Get total count
        const totalCount = await Employee.countDocuments(query);

        // Calculate pagination
        const totalPages = Math.ceil(totalCount / pageSize);
        const skip = (page - 1) * pageSize;

        // Get paginated results
        const employees = await Employee.find(query)
          .sort(sort)
          .skip(skip)
          .limit(pageSize)
          .lean();

        // Format dates to ISO strings
        const formattedEmployees = employees.map(emp => ({
          ...emp,
          id: emp._id.toString(),
          joinDate: emp.joinDate.toISOString().split('T')[0]
        }));

        return {
          employees: formattedEmployees as any[],
          totalCount,
          pageInfo: {
            currentPage: page,
            pageSize,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
        };
      } catch (error) {
        console.error('Error fetching employees:', error);
        throw new GraphQLError('Failed to fetch employees', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    // Get single employee by ID
    employee: async (_: any, { id }: EmployeeArgs, context: IContext) => {
      isAdminOrEmployee(context);

      try {
        const employee = await Employee.findById(id).lean();
        
        if (!employee) {
          throw new GraphQLError('Employee not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        return {
          ...employee,
          id: employee._id.toString(),
          joinDate: employee.joinDate.toISOString().split('T')[0]
        };
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError('Failed to fetch employee', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    // Get current user (returns null if not authenticated - no error thrown)
    me: async (_: any, __: any, context: IContext) => {
      // Return null silently if not authenticated (used for session checking)
      if (!context.user) {
        return null;
      }

      try {
        const user = await User.findById(context.user.id).select('-password').lean();
        
        if (!user) {
          return null;
        }

        return {
          ...user,
          id: user._id.toString()
        };
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    },

    // Get all departments
    departments: async (_: any, __: any, context: IContext) => {
      isAdminOrEmployee(context);

      try {
        const departments = await Department.find().sort({ name: 1 }).lean();
        
        return departments.map(dept => ({
          ...dept,
          id: dept._id.toString(),
          createdAt: dept.createdAt.toISOString()
        }));
      } catch (error) {
        throw new GraphQLError('Failed to fetch departments', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    // Get single department by ID
    department: async (_: any, { id }: DepartmentArgs, context: IContext) => {
      isAdminOrEmployee(context);

      try {
        const department = await Department.findById(id).lean();
        
        if (!department) {
          throw new GraphQLError('Department not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        return {
          ...department,
          id: department._id.toString(),
          createdAt: department.createdAt.toISOString()
        };
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError('Failed to fetch department', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
  },

  Mutation: {
    // Request OTP
    requestOTP: async (_: any, { email }: RequestOTPArgs): Promise<OTPResponse> => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
          // Don't reveal if user exists or not
          return {
            success: true,
            message: 'If an account exists with this email, an OTP has been sent.'
          };
        }

        // Delete any existing OTP for this email
        await OTP.deleteMany({ email: email.toLowerCase() });

        // Generate new OTP
        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save OTP to database
        await OTP.create({
          email: email.toLowerCase(),
          otp: otpCode,
          attempts: 0,
          expiresAt
        });

        // Send email
        await sendOTPEmail(email, otpCode);

        // Return OTP in response (useful for development/testing)
        // In production, you may want to remove this or make it conditional
        return {
          success: true,
          message: 'OTP sent to your email. It will expire in 5 minutes.',
          otp: otpCode // Include OTP in response for testing
        };
      } catch (error) {
        console.error('Request OTP error:', error);
        throw new GraphQLError('Failed to send OTP', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    // Verify OTP and login
    verifyOTP: async (_: any, { email, otp }: VerifyOTPArgs, context: IContext): Promise<AuthPayload> => {
      try {
        const otpRecord = await OTP.findOne({ email: email.toLowerCase() });

        if (!otpRecord) {
          throw new GraphQLError('No OTP requested for this email', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Check expiration
        if (new Date() > otpRecord.expiresAt) {
          await OTP.deleteOne({ _id: otpRecord._id });
          throw new GraphQLError('OTP has expired. Please request a new one.', {
            extensions: { code: 'OTP_EXPIRED' },
          });
        }

        // Check attempts
        if (otpRecord.attempts >= 3) {
          await OTP.deleteOne({ _id: otpRecord._id });
          throw new GraphQLError('Too many failed attempts. Please request a new OTP.', {
            extensions: { code: 'TOO_MANY_ATTEMPTS' },
          });
        }

        // Verify OTP
        if (otpRecord.otp !== otp) {
          otpRecord.attempts += 1;
          await otpRecord.save();
          throw new GraphQLError(`Invalid OTP. ${3 - otpRecord.attempts} attempts remaining.`, {
            extensions: { code: 'INVALID_OTP' },
          });
        }

        // OTP is valid - get user
        const user = await User.findOne({ email: email.toLowerCase() }).select('-password').lean();
        
        if (!user) {
          throw new GraphQLError('User not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        // Delete OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        // Create session
        context.session.user = {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role
        };

        // Save session
        await new Promise<void>((resolve, reject) => {
          context.session.save((err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        return {
          user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role,
          },
          message: 'Login successful'
        };
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        console.error('Verify OTP error:', error);
        throw new GraphQLError('Failed to verify OTP', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    // Logout
    logout: async (_: any, __: any, context: IContext): Promise<boolean> => {
      try {
        await new Promise<void>((resolve, reject) => {
          context.session.destroy((err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        return true;
      } catch (error) {
        throw new GraphQLError('Failed to logout', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    // Add employee (Admin only)
    addEmployee: async (_: any, { input }: AddEmployeeArgs, context: IContext) => {
      isAdmin(context);

      try {
        const employee = await Employee.create(input);
        
        return {
          ...employee.toObject(),
          id: employee._id.toString(),
          joinDate: employee.joinDate.toISOString().split('T')[0]
        };
      } catch (error: any) {
        if (error.code === 11000) {
          throw new GraphQLError('Employee with this email already exists', {
            extensions: { code: 'DUPLICATE_EMAIL' },
          });
        }
        console.error('Add employee error:', error);
        throw new GraphQLError('Failed to add employee', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    // Update employee (Admin only)
    updateEmployee: async (_: any, { id, input }: UpdateEmployeeArgs, context: IContext) => {
      isAdmin(context);

      try {
        const employee = await Employee.findByIdAndUpdate(
          id,
          input,
          { new: true, runValidators: true }
        ).lean();

        if (!employee) {
          throw new GraphQLError('Employee not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        return {
          ...employee,
          id: employee._id.toString(),
          joinDate: employee.joinDate.toISOString().split('T')[0]
        };
      } catch (error: any) {
        if (error instanceof GraphQLError) throw error;
        if (error.code === 11000) {
          throw new GraphQLError('Employee with this email already exists', {
            extensions: { code: 'DUPLICATE_EMAIL' },
          });
        }
        console.error('Update employee error:', error);
        throw new GraphQLError('Failed to update employee', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    // Delete employee (Admin only)
    deleteEmployee: async (_: any, { id }: DeleteEmployeeArgs, context: IContext): Promise<boolean> => {
      isAdmin(context);

      try {
        const employee = await Employee.findByIdAndDelete(id);

        if (!employee) {
          throw new GraphQLError('Employee not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        return true;
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        console.error('Delete employee error:', error);
        throw new GraphQLError('Failed to delete employee', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    // Add department (Admin only)
    addDepartment: async (_: any, { input }: AddDepartmentArgs, context: IContext) => {
      isAdmin(context);

      try {
        const department = await Department.create(input);
        
        return {
          ...department.toObject(),
          id: department._id.toString(),
          createdAt: department.createdAt.toISOString()
        };
      } catch (error: any) {
        if (error.code === 11000) {
          throw new GraphQLError('Department already exists', {
            extensions: { code: 'DUPLICATE_DEPARTMENT' },
          });
        }
        console.error('Add department error:', error);
        throw new GraphQLError('Failed to add department', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    // Update department (Admin only)
    updateDepartment: async (_: any, { id, input }: UpdateDepartmentArgs, context: IContext) => {
      isAdmin(context);

      try {
        const department = await Department.findByIdAndUpdate(
          id,
          input,
          { new: true, runValidators: true }
        ).lean();

        if (!department) {
          throw new GraphQLError('Department not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        return {
          ...department,
          id: department._id.toString(),
          createdAt: department.createdAt.toISOString()
        };
      } catch (error: any) {
        if (error instanceof GraphQLError) throw error;
        if (error.code === 11000) {
          throw new GraphQLError('Department with this name already exists', {
            extensions: { code: 'DUPLICATE_DEPARTMENT' },
          });
        }
        console.error('Update department error:', error);
        throw new GraphQLError('Failed to update department', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    // Delete department (Admin only)
    deleteDepartment: async (_: any, { id }: DeleteDepartmentArgs, context: IContext): Promise<boolean> => {
      isAdmin(context);

      try {
        const department = await Department.findById(id);

        if (!department) {
          throw new GraphQLError('Department not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        // Check if any employees are in this department
        const employeeCount = await Employee.countDocuments({ department: department.name });
        
        if (employeeCount > 0) {
          throw new GraphQLError(`Cannot delete department. ${employeeCount} employee(s) are assigned to this department.`, {
            extensions: { code: 'DEPARTMENT_IN_USE' },
          });
        }

        await Department.findByIdAndDelete(id);
        return true;
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        console.error('Delete department error:', error);
        throw new GraphQLError('Failed to delete department', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
  },
};

export default resolvers;

