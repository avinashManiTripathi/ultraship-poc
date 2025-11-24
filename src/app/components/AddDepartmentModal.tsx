"use client";

import { useState } from 'react';
import { Button, Input, Textarea, Modal, Alert } from './ui';

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * @description This component is used to display a add department modal.
 * @param {AddDepartmentModalProps} props - The props for the AddDepartmentModal component.
 * @param {boolean} isOpen - Whether the AddDepartmentModal is open.
 * @param {() => void} onClose - The function to call when the AddDepartmentModal is closed.
 * @param {() => void} onSuccess - The function to call when the AddDepartmentModal is successful.
 * @returns {React.ReactNode} The AddDepartmentModal component.
 */
export default function AddDepartmentModal({ isOpen, onClose, onSuccess }: AddDepartmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation AddDepartment($input: DepartmentInput!) {
              addDepartment(input: $input) {
                id
                name
                description
              }
            }
          `,
          variables: {
            input: {
              name: formData.name,
              description: formData.description
            }
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      onSuccess();
      onClose();
      setFormData({ name: '', description: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to add department');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Department"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="Department Name *"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="e.g., Marketing, Finance"
        />

        <Textarea
          label="Description (Optional)"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Brief description of the department"
        />

        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1.5 text-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="success"
            loading={loading}
            className="font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 px-3 py-1.5 text-sm"
          >
            Add Department
          </Button>
        </div>
      </form>
    </Modal>
  );
}

