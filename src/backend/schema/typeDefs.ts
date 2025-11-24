import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Employee {
    id: ID!
    name: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: Float!
    email: String!
    phone: String!
    department: String!
    position: String!
    joinDate: String!
    salary: Float!
    address: String!
    status: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    token: String
  }

  type AuthPayload {
    user: User!
    message: String
  }

  type OTPResponse {
    success: Boolean!
    message: String!
  }

  type Department {
    id: ID!
    name: String!
    description: String
    createdAt: String!
  }

  input DepartmentInput {
    name: String!
    description: String
  }

  input EmployeeFilterInput {
    name: String
    department: String
    class: String
    status: String
    minAge: Int
    maxAge: Int
  }

  input EmployeeInput {
    name: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: Float!
    email: String!
    phone: String!
    department: String!
    position: String!
    joinDate: String!
    salary: Float!
    address: String!
    status: String!
  }

  input UpdateEmployeeInput {
    name: String
    age: Int
    class: String
    subjects: [String]
    attendance: Float
    email: String
    phone: String
    department: String
    position: String
    joinDate: String
    salary: Float
    address: String
    status: String
  }

  type EmployeeConnection {
    employees: [Employee!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  type PageInfo {
    currentPage: Int!
    pageSize: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  enum SortOrder {
    ASC
    DESC
  }

  enum EmployeeSortField {
    name
    age
    department
    attendance
    joinDate
    salary
  }

  type Query {
    # Get all employees with optional filters, pagination, and sorting
    employees(
      filter: EmployeeFilterInput
      page: Int = 1
      pageSize: Int = 10
      sortBy: EmployeeSortField = name
      sortOrder: SortOrder = ASC
    ): EmployeeConnection!

    # Get single employee by ID
    employee(id: ID!): Employee

    # Get current user
    me: User

    # Get all departments
    departments: [Department!]!

    # Get single department by ID
    department(id: ID!): Department
  }

  type Mutation {
    # OTP-based Authentication
    requestOTP(email: String!): OTPResponse!
    verifyOTP(email: String!, otp: String!): AuthPayload!
    logout: Boolean!

    # Employee mutations (require authentication)
    addEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: UpdateEmployeeInput!): Employee!
    deleteEmployee(id: ID!): Boolean!

    # Department mutations (Admin only)
    addDepartment(input: DepartmentInput!): Department!
    updateDepartment(id: ID!, input: DepartmentInput!): Department!
    deleteDepartment(id: ID!): Boolean!
  }
`;

export default typeDefs;

