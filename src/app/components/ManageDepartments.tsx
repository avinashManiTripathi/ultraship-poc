"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AddDepartmentModal from './AddDepartmentModal';

interface Department {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

interface ManageDepartmentsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManageDepartments({ isOpen, onClose }: ManageDepartmentsProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            query {
              departments {
                id
                name
                description
                createdAt
              }
            }
          `,
        }),
      });

      const result = await response.json();
      if (result.data?.departments) {
        setDepartments(result.data.departments);
      }
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete department "${name}"? This will fail if employees are assigned to it.`)) {
      return;
    }

    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation DeleteDepartment($id: ID!) {
              deleteDepartment(id: $id)
            }
          `,
          variables: { id },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        alert(result.errors[0].message);
      } else {
        fetchDepartments();
      }
    } catch (err: any) {
      alert('Failed to delete department');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full my-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Manage Departments</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600 dark:text-gray-400">
                Total: {departments.length} departments
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Department
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {dept.name}
                      </h3>
                      {dept.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {dept.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(dept.id, dept.name)}
                      className="ml-4 p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}

                {departments.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No departments yet. Add one to get started!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddDepartmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          fetchDepartments();
          setShowAddModal(false);
        }}
      />
    </>
  );
}

