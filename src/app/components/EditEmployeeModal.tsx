"use client";

import { useState, useEffect } from 'react';
import { useEmployeeMutations } from '@/hooks/useEmployees';
import { Button, Input, Select, Textarea, Modal, Alert } from './ui';

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

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee: Employee | null;
  departments: string[];
}

/**
 * @description This component is used to display a edit employee modal.
 * @param {EditEmployeeModalProps} props - The props for the EditEmployeeModal component.
 * @param {boolean} isOpen - Whether the EditEmployeeModal is open.
 * @param {() => void} onClose - The function to call when the EditEmployeeModal is closed.
 * @param {() => void} onSuccess - The function to call when the EditEmployeeModal is successful.
 * @param {Employee | null} employee - The employee of the EditEmployeeModal component.
 * @param {string[]} departments - The departments of the EditEmployeeModal component.
 * @returns {React.ReactNode} The EditEmployeeModal component.
 */

export default function EditEmployeeModal({ isOpen, onClose, onSuccess, employee, departments }: EditEmployeeModalProps) {
  const { updateEmployee, loading, error: hookError } = useEmployeeMutations();
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

  // Populate form when employee data is provided
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        age: employee.age.toString(),
        class: employee.class,
        subjects: employee.subjects.join(', '),
        attendance: employee.attendance.toString(),
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        position: employee.position,
        joinDate: employee.joinDate.split('T')[0], // Format date for input
        salary: employee.salary.toString(),
        address: employee.address,
        status: employee.status
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;
    
    setError('');

    try {
      await updateEmployee(employee.id, {
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
    } catch (err: any) {
      setError(err.message || hookError || 'Failed to update employee');
    }
  };

  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Employee"
      subtitle={`ID: ${employee.id}`}
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name *"
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
          />

          <Input
            label="Age *"
            type="number"
            name="age"
            required
            min="18"
            max="100"
            value={formData.age}
            onChange={handleChange}
          />

          <Input
            label="Email *"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Phone *"
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
          />

          <Select
            label="Department *"
            name="department"
            required
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </Select>

          <Input
            label="Position *"
            type="text"
            name="position"
            required
            value={formData.position}
            onChange={handleChange}
          />

          <Select
            label="Class *"
            name="class"
            required
            value={formData.class}
            onChange={handleChange}
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
            name="joinDate"
            required
            value={formData.joinDate}
            onChange={handleChange}
          />

          <Input
            label="Salary *"
            type="number"
            name="salary"
            required
            min="0"
            step="1000"
            value={formData.salary}
            onChange={handleChange}
          />

          <Input
            label="Attendance % *"
            type="number"
            name="attendance"
            required
            min="0"
            max="100"
            step="0.1"
            value={formData.attendance}
            onChange={handleChange}
          />

          <Select
            label="Status *"
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
          </Select>

          <div className="md:col-span-2">
            <Input
              label="Skills/Subjects (comma-separated) *"
              type="text"
              name="subjects"
              required
              placeholder="e.g., React, Node.js, TypeScript"
              value={formData.subjects}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              label="Address *"
              name="address"
              required
              rows={2}
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

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
            variant="primary"
            loading={loading}
            className="font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-3 py-1.5 text-sm"
          >
            Update Employee
          </Button>
        </div>
      </form>
    </Modal>
  );
}

