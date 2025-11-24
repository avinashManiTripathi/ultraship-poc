"use client";

import { useState } from 'react';
import { Button, Input, Select, Textarea, Modal, Alert } from './ui';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  departments: string[];
}

export default function AddEmployeeModal({ isOpen, onClose, onSuccess, departments }: AddEmployeeModalProps) {
  const [loading, setLoading] = useState(false);
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
            mutation AddEmployee($input: EmployeeInput!) {
              addEmployee(input: $input) {
                id
                name
                email
              }
            }
          `,
          variables: {
            input: {
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
      // Reset form
      setFormData({
        name: '', age: '', class: 'Mid-Level', subjects: '', attendance: '',
        email: '', phone: '', department: 'Engineering', position: '', joinDate: '',
        salary: '', address: '', status: 'Active'
      });
    } catch (err: any) {
      setError(err.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Employee"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="flex-1"
          >
            Add Employee
          </Button>
        </div>
      </form>
    </Modal>
  );
}

