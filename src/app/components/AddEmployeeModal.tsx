"use client";

import { useState } from 'react';
import { useEmployeeMutations } from '@/hooks/useEmployees';
import { Button, Input, Select, Textarea, Modal, Alert } from './ui';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  departments: string[];
}

/**
 * @description This component is used to display a add employee modal.
 * @param {AddEmployeeModalProps} props - The props for the AddEmployeeModal component.
 * @param {boolean} isOpen - Whether the AddEmployeeModal is open.
 * @param {() => void} onClose - The function to call when the AddEmployeeModal is closed.
 * @param {() => void} onSuccess - The function to call when the AddEmployeeModal is successful.
 * @param {string[]} departments - The departments of the AddEmployeeModal.
 * @returns {React.ReactNode} The AddEmployeeModal component.
 */

export default function AddEmployeeModal({ isOpen, onClose, onSuccess, departments }: AddEmployeeModalProps) {
  const { addEmployee, loading, error: hookError } = useEmployeeMutations();
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class: 'Mid-Level',
    subjects: '',
    attendance: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    joinDate: '',
    salary: '',
    address: '',
    status: 'Active'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await addEmployee({
        name: formData.name,
        age: parseInt(formData.age),
        class: formData.class,
        subjects: formData.subjects.split(',').map(s => s.trim()),
        attendance: parseFloat(formData.attendance),
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
        joinDate: formData.joinDate,
        salary: parseFloat(formData.salary),
        address: formData.address,
        status: formData.status
      });

      onSuccess();
      onClose();
      // Reset form
      setFormData({
        name: '', age: '', class: 'Mid-Level', subjects: '', attendance: '',
        email: '', phone: '', department: '', position: '', joinDate: '',
        salary: '', address: '', status: 'Active'
      });
    } catch (err: any) {
      setError(err.message || hookError || 'Failed to add employee');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Employee"
      maxWidth="3xl"
      footer={
        <div className="flex gap-3">
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
            form="add-employee-form"
            variant="primary"
            loading={loading}
            className="font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-3 py-1.5 text-sm"
          >
            Add Employee
          </Button>
        </div>
      }
    >
      <form id="add-employee-form" onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name *"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />

          <Input
            label="Age *"
            type="number"
            required
            min="18"
            max="100"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
          />

          <Input
            label="Email *"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <Input
            label="Phone *"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />

          <Select
            label="Department *"
            required
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </Select>

          <Input
            label="Position *"
            type="text"
            required
            value={formData.position}
            onChange={(e) => setFormData({...formData, position: e.target.value})}
          />

          <Select
            label="Class *"
            required
            value={formData.class}
            onChange={(e) => setFormData({...formData, class: e.target.value})}
          >
            <option value="Junior">Junior</option>
            <option value="Mid-Level">Mid-Level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
            <option value="Manager">Manager</option>
          </Select>

          <Input
            label="Join Date *"
            type="date"
            required
            value={formData.joinDate}
            onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
          />

          <Input
            label="Salary *"
            type="number"
            required
            min="0"
            step="1000"
            value={formData.salary}
            onChange={(e) => setFormData({...formData, salary: e.target.value})}
          />

          <Input
            label="Attendance % *"
            type="number"
            required
            min="0"
            max="100"
            step="0.1"
            value={formData.attendance}
            onChange={(e) => setFormData({...formData, attendance: e.target.value})}
          />

          <div className="md:col-span-2">
            <Input
              label="Skills/Subjects (comma-separated) *"
              type="text"
              required
              placeholder="e.g., React, Node.js, TypeScript"
              value={formData.subjects}
              onChange={(e) => setFormData({...formData, subjects: e.target.value})}
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              label="Address *"
              required
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}

