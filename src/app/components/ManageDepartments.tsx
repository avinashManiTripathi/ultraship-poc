"use client";

import { useState, useEffect } from 'react';
import { useDepartments, useDepartmentMutations } from '@/hooks/useDepartments';
import { Button, Card, Modal } from './ui';
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

/**
 * @description This component is used to display a manage departments modal.
 * @param {ManageDepartmentsProps} props - The props for the ManageDepartments component.
 * @param {boolean} isOpen - Whether the ManageDepartments is open.
 * @param {() => void} onClose - The function to call when the ManageDepartments is closed.
 * @returns {React.ReactNode} The ManageDepartments component.
 */
export default function ManageDepartments({ isOpen, onClose }: ManageDepartmentsProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const { fetchDepartments: fetchDepts, loading } = useDepartments();
  const { deleteDepartment } = useDepartmentMutations();

  useEffect(() => {
    if (isOpen) {
      loadDepartments();
    }
  }, [isOpen]);

  const loadDepartments = async () => {
    try {
      const depts = await fetchDepts();
      setDepartments(depts as any);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete department "${name}"? This will fail if employees are assigned to it.`)) {
      return;
    }

    try {
      await deleteDepartment(id);
      loadDepartments();
    } catch (err: any) {
      alert(err.message || 'Failed to delete department');
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Manage Departments"
        maxWidth="3xl"
      >
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            Total: {departments.length} departments
          </p>
          <Button
            variant="success"
            size="sm"
            onClick={() => setShowAddModal(true)}
          >
            Add Department
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {departments.map((dept) => (
              <Card key={dept.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {dept.name}
                    </h3>
                    {dept.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {dept.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(dept.id, dept.name)}
                    className="ml-4 !px-3 !py-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </Card>
            ))}

            {departments.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No departments yet. Add one to get started!
              </div>
            )}
          </div>
        )}
      </Modal>

      <AddDepartmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          loadDepartments();
          setShowAddModal(false);
        }}
      />
    </>
  );
}

