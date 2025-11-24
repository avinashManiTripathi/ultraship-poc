"use client";

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

interface DetailViewProps {
  employee: Employee;
  onClose: () => void;
}

export default function DetailView({ employee, onClose }: DetailViewProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full my-8 animate-in fade-in zoom-in duration-200">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white/30">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-2">{employee.name}</h2>
              <p className="text-white/90 text-lg">{employee.position}</p>
              <p className="text-white/70 text-sm mt-1">Employee ID: {employee.id}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Status Badges */}
          <div className="flex flex-wrap gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              employee.attendance >= 95
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : employee.attendance >= 90
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            }`}>
              {employee.attendance}% Attendance
            </span>
            <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold">
              {employee.class}
            </span>
            <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
              {employee.status}
            </span>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Personal Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Age</label>
                  <p className="text-gray-900 dark:text-white font-medium">{employee.age} years</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                  <p className="text-gray-900 dark:text-white font-medium">{employee.email}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Phone</label>
                  <p className="text-gray-900 dark:text-white font-medium">{employee.phone}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Address</label>
                  <p className="text-gray-900 dark:text-white font-medium">{employee.address}</p>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Professional Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Department</label>
                  <p className="text-gray-900 dark:text-white font-medium">{employee.department}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Position</label>
                  <p className="text-gray-900 dark:text-white font-medium">{employee.position}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Join Date</label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {new Date(employee.joinDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Salary</label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    ${employee.salary.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subjects/Skills */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {employee.subjects.map((subject, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors">
              View Full Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

