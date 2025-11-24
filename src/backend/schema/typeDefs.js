const { gql } = require('graphql-tag');

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
    token: String!
    user: User!
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
  }

  type Mutation {
    # Authentication
    login(email: String!, password: String!): AuthPayload!
    register(username: String!, email: String!, password: String!, role: String): AuthPayload!

    # Employee mutations (require authentication)
    addEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: UpdateEmployeeInput!): Employee!
    deleteEmployee(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;

