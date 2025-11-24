/**
 * GraphQL Queries
 * All queries are centralized here for easy maintenance
 */

export const GET_ME = `
  query {
    me {
      id
      username
      email
      role
    }
  }
`;

export const GET_EMPLOYEES = `
  query GetEmployees(
    $filter: EmployeeFilterInput
    $page: Int
    $pageSize: Int
    $sortBy: EmployeeSortField
    $sortOrder: SortOrder
  ) {
    employees(
      filter: $filter
      page: $page
      pageSize: $pageSize
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      employees {
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
      totalCount
      pageInfo {
        currentPage
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_DEPARTMENTS = `
  query {
    departments {
      id
      name
      description
    }
  }
`;

export const GET_DEPARTMENT = `
  query GetDepartment($id: ID!) {
    department(id: $id) {
      id
      name
      description
    }
  }
`;

