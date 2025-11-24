/**
 * Employee Hooks
 * Handles all employee-related operations
 */

import { useState, useCallback } from 'react';
import { graphqlQuery, graphqlMutation } from '@/lib/graphql-client';
import { GET_EMPLOYEES } from '@/graphql/queries';
import {
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
} from '@/graphql/mutations';

interface Employee {
  id: string;
  name: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: number;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  salary: number;
  address: string;
  status: string;
}

interface PageInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface EmployeesResponse {
  employees: {
    employees: Employee[];
    totalCount: number;
    pageInfo: PageInfo;
  };
}

interface EmployeeInput {
  name: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: number;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  salary: number;
  address: string;
  status?: string;
}

interface EmployeeFilter {
  name?: string;
  department?: string;
  class?: string;
  status?: string;
  minAge?: number;
  maxAge?: number;
}

interface FetchEmployeesParams {
  filter?: EmployeeFilter;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
}

/**
 * Hook for fetching employees with pagination and filters
 */
export function useEmployees() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(
    async (params: FetchEmployeesParams) => {
      setLoading(true);
      setError(null);

      try {
        const variables = {
          filter: params.filter || undefined,
          page: params.page || 1,
          pageSize: params.pageSize || 10,
          sortBy: params.sortBy || 'name',
          sortOrder: params.sortOrder || 'ASC',
        };
        
        const data = await graphqlQuery<EmployeesResponse>(GET_EMPLOYEES, variables);
        return data.employees;
      } catch (err: any) {
        setError(err.message || 'Failed to fetch employees');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    fetchEmployees,
    loading,
    error,
  };
}

/**
 * Hook for employee mutations (add, update, delete)
 */
export function useEmployeeMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Add new employee
   */
  const addEmployee = useCallback(async (input: EmployeeInput) => {
    setLoading(true);
    setError(null);

    try {
      const data = await graphqlMutation<{ addEmployee: Employee }>(
        ADD_EMPLOYEE,
        { input }
      );
      return data.addEmployee;
    } catch (err: any) {
      setError(err.message || 'Failed to add employee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update existing employee
   */
  const updateEmployee = useCallback(
    async (id: string, input: Partial<EmployeeInput>) => {
      setLoading(true);
      setError(null);

      try {
        const data = await graphqlMutation<{ updateEmployee: Employee }>(
          UPDATE_EMPLOYEE,
          { id, input }
        );
        return data.updateEmployee;
      } catch (err: any) {
        setError(err.message || 'Failed to update employee');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Delete employee
   */
  const deleteEmployee = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await graphqlMutation<{ deleteEmployee: boolean }>(DELETE_EMPLOYEE, {
        id,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to delete employee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    addEmployee,
    updateEmployee,
    deleteEmployee,
    loading,
    error,
  };
}

