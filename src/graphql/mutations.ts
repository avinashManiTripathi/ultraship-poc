/**
 * GraphQL Mutations
 * All mutations are centralized here for easy maintenance
 */

// ============================================================================
// Authentication Mutations
// ============================================================================

export const REQUEST_OTP = `
  mutation RequestOTP($email: String!) {
    requestOTP(email: $email) {
      success
      message
      otp
    }
  }
`;

export const VERIFY_OTP = `
  mutation VerifyOTP($email: String!, $otp: String!) {
    verifyOTP(email: $email, otp: $otp) {
      user {
        id
        username
        email
        role
      }
      message
    }
  }
`;

export const LOGOUT = `
  mutation {
    logout
  }
`;

// ============================================================================
// Employee Mutations
// ============================================================================

export const ADD_EMPLOYEE = `
  mutation AddEmployee($input: EmployeeInput!) {
    addEmployee(input: $input) {
      id
      name
      email
      department
      position
    }
  }
`;

export const UPDATE_EMPLOYEE = `
  mutation UpdateEmployee($id: ID!, $input: UpdateEmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      id
      name
      age
      class
      subjects
      attendance
      email
      phone
      department
      position
      joinDate
      salary
      address
      status
    }
  }
`;

export const DELETE_EMPLOYEE = `
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

// ============================================================================
// Department Mutations
// ============================================================================

export const ADD_DEPARTMENT = `
  mutation AddDepartment($input: DepartmentInput!) {
    addDepartment(input: $input) {
      id
      name
      description
    }
  }
`;

export const UPDATE_DEPARTMENT = `
  mutation UpdateDepartment($id: ID!, $input: DepartmentInput!) {
    updateDepartment(id: $id, input: $input) {
      id
      name
      description
    }
  }
`;

export const DELETE_DEPARTMENT = `
  mutation DeleteDepartment($id: ID!) {
    deleteDepartment(id: $id)
  }
`;

