/**
 * Department Hooks
 * Handles all department-related operations
 */

import { useState, useCallback } from 'react';
import { graphqlQuery, graphqlMutation } from '@/lib/graphql-client';
import { GET_DEPARTMENTS } from '@/graphql/queries';
import {
  ADD_DEPARTMENT,
  UPDATE_DEPARTMENT,
  DELETE_DEPARTMENT,
} from '@/graphql/mutations';

interface Department {
  id: string;
  name: string;
  description: string;
}

interface DepartmentsResponse {
  departments: Department[];
}

interface DepartmentInput {
  name: string;
  description?: string;
}

/**
 * Hook for fetching departments
 */
export function useDepartments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await graphqlQuery<DepartmentsResponse>(GET_DEPARTMENTS);
      return data.departments;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch departments');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchDepartments,
    loading,
    error,
  };
}

/**
 * Hook for department mutations (add, update, delete)
 */
export function useDepartmentMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Add new department
   */
  const addDepartment = useCallback(async (input: DepartmentInput) => {
    setLoading(true);
    setError(null);

    try {
      const data = await graphqlMutation<{ addDepartment: Department }>(
        ADD_DEPARTMENT,
        { input }
      );
      return data.addDepartment;
    } catch (err: any) {
      setError(err.message || 'Failed to add department');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update existing department
   */
  const updateDepartment = useCallback(
    async (id: string, input: DepartmentInput) => {
      setLoading(true);
      setError(null);

      try {
        const data = await graphqlMutation<{ updateDepartment: Department }>(
          UPDATE_DEPARTMENT,
          { id, input }
        );
        return data.updateDepartment;
      } catch (err: any) {
        setError(err.message || 'Failed to update department');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Delete department
   */
  const deleteDepartment = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await graphqlMutation<{ deleteDepartment: boolean }>(DELETE_DEPARTMENT, {
        id,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to delete department');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    addDepartment,
    updateDepartment,
    deleteDepartment,
    loading,
    error,
  };
}

