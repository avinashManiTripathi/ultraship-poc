const { GraphQLError } = require('graphql');
const { employees, users, departments, otpStore } = require('../models/data');
const { generateOTP, sendOTPEmail } = require('../utils/email');
const { isAdmin, isAdminOrEmployee } = require('../middleware/auth');

// In-memory counters for new IDs
let employeeIdCounter = employees.length + 1;
let userIdCounter = users.length + 1;
let departmentIdCounter = departments.length + 1;

const resolvers = {
  Query: {
    // Get employees with filtering, pagination, and sorting
    employees: (_, { filter, page = 1, pageSize = 10, sortBy = 'name', sortOrder = 'ASC' }, context) => {
      // Anyone can view employees (adjust based on requirements)
      isAdminOrEmployee(context);

      let filteredEmployees = [...employees];

      // Apply filters
      if (filter) {
        if (filter.name) {
          filteredEmployees = filteredEmployees.filter(emp =>
            emp.name.toLowerCase().includes(filter.name.toLowerCase())
          );
        }
        if (filter.department) {
          filteredEmployees = filteredEmployees.filter(emp =>
            emp.department.toLowerCase() === filter.department.toLowerCase()
          );
        }
        if (filter.class) {
          filteredEmployees = filteredEmployees.filter(emp =>
            emp.class.toLowerCase() === filter.class.toLowerCase()
          );
        }
        if (filter.status) {
          filteredEmployees = filteredEmployees.filter(emp =>
            emp.status.toLowerCase() === filter.status.toLowerCase()
          );
        }
        if (filter.minAge) {
          filteredEmployees = filteredEmployees.filter(emp => emp.age >= filter.minAge);
        }
        if (filter.maxAge) {
          filteredEmployees = filteredEmployees.filter(emp => emp.age <= filter.maxAge);
        }
      }

      // Apply sorting
      filteredEmployees.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        // Handle different types
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (sortOrder === 'ASC') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      // Calculate pagination
      const totalCount = filteredEmployees.length;
      const totalPages = Math.ceil(totalCount / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

      return {
        employees: paginatedEmployees,
        totalCount,
        pageInfo: {
          currentPage: page,
          pageSize,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    },

    // Get single employee by ID
    employee: (_, { id }, context) => {
      isAdminOrEmployee(context);
      const employee = employees.find(emp => emp.id === id);
      if (!employee) {
        throw new GraphQLError('Employee not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return employee;
    },

    // Get current user
    me: (_, __, context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      const user = users.find(u => u.id === context.user.id);
      return user;
    },

    // Get all departments
    departments: (_, __, context) => {
      isAdminOrEmployee(context);
      return departments;
    },

    // Get single department by ID
    department: (_, { id }, context) => {
      isAdminOrEmployee(context);
      const department = departments.find(dept => dept.id === id);
      if (!department) {
        throw new GraphQLError('Department not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return department;
    },
  },

  Mutation: {
    // Request OTP
    requestOTP: async (_, { email }) => {
      const user = users.find(u => u.email === email);
      
      if (!user) {
        // Don't reveal if user exists or not
        return {
          success: true,
          message: 'If an account exists with this email, an OTP has been sent.'
        };
      }

      // Generate OTP
      const otp = generateOTP();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

      // Store OTP
      otpStore.set(email, {
        otp,
        expiresAt,
        attempts: 0
      });

      // Send email
      await sendOTPEmail(email, otp);

      return {
        success: true,
        message: 'OTP sent to your email. It will expire in 5 minutes.'
      };
    },

    // Verify OTP and login
    verifyOTP: async (_, { email, otp }, context) => {
      const otpData = otpStore.get(email);

      if (!otpData) {
        throw new GraphQLError('No OTP requested for this email', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Check expiration
      if (Date.now() > otpData.expiresAt) {
        otpStore.delete(email);
        throw new GraphQLError('OTP has expired. Please request a new one.', {
          extensions: { code: 'OTP_EXPIRED' },
        });
      }

      // Check attempts
      if (otpData.attempts >= 3) {
        otpStore.delete(email);
        throw new GraphQLError('Too many failed attempts. Please request a new OTP.', {
          extensions: { code: 'TOO_MANY_ATTEMPTS' },
        });
      }

      // Verify OTP
      if (otpData.otp !== otp) {
        otpData.attempts++;
        throw new GraphQLError(`Invalid OTP. ${3 - otpData.attempts} attempts remaining.`, {
          extensions: { code: 'INVALID_OTP' },
        });
      }

      // OTP is valid - get user
      const user = users.find(u => u.email === email);
      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Clear OTP
      otpStore.delete(email);

      // Create session
      context.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      };

      // Save session
      await new Promise((resolve, reject) => {
        context.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        message: 'Login successful'
      };
    },

    // Logout
    logout: async (_, __, context) => {
      await new Promise((resolve, reject) => {
        context.session.destroy((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      return true;
    },

    // Add employee (Admin only)
    addEmployee: (_, { input }, context) => {
      isAdmin(context);

      const newEmployee = {
        id: String(employeeIdCounter++),
        ...input,
      };

      employees.push(newEmployee);
      return newEmployee;
    },

    // Update employee (Admin only)
    updateEmployee: (_, { id, input }, context) => {
      isAdmin(context);

      const index = employees.findIndex(emp => emp.id === id);
      if (index === -1) {
        throw new GraphQLError('Employee not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      employees[index] = {
        ...employees[index],
        ...input,
      };

      return employees[index];
    },

    // Delete employee (Admin only)
    deleteEmployee: (_, { id }, context) => {
      isAdmin(context);

      const index = employees.findIndex(emp => emp.id === id);
      if (index === -1) {
        throw new GraphQLError('Employee not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      employees.splice(index, 1);
      return true;
    },

    // Add department (Admin only)
    addDepartment: (_, { input }, context) => {
      isAdmin(context);

      // Check if department already exists
      const existing = departments.find(dept => dept.name.toLowerCase() === input.name.toLowerCase());
      if (existing) {
        throw new GraphQLError('Department already exists', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const newDepartment = {
        id: String(departmentIdCounter++),
        name: input.name,
        description: input.description || '',
        createdAt: new Date().toISOString(),
      };

      departments.push(newDepartment);
      return newDepartment;
    },

    // Update department (Admin only)
    updateDepartment: (_, { id, input }, context) => {
      isAdmin(context);

      const index = departments.findIndex(dept => dept.id === id);
      if (index === -1) {
        throw new GraphQLError('Department not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      departments[index] = {
        ...departments[index],
        ...input,
      };

      return departments[index];
    },

    // Delete department (Admin only)
    deleteDepartment: (_, { id }, context) => {
      isAdmin(context);

      const index = departments.findIndex(dept => dept.id === id);
      if (index === -1) {
        throw new GraphQLError('Department not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const deptName = departments[index].name;
      
      // Check if any employees are in this department
      const employeesInDept = employees.filter(emp => emp.department === deptName);
      if (employeesInDept.length > 0) {
        throw new GraphQLError(`Cannot delete department. ${employeesInDept.length} employee(s) are assigned to this department.`, {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      departments.splice(index, 1);
      return true;
    },
  },
};

module.exports = resolvers;
