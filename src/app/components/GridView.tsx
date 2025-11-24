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

interface GridViewProps {
  employees: Employee[];
  onRowClick: (employee: Employee) => void;
}

export default function GridView({ employees, onRowClick }: GridViewProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Age</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Class</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Department</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Position</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Attendance</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr
              key={employee.id}
              onClick={() => onRowClick(employee)}
              className={`border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors ${
                index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'
              }`}
            >
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                {employee.id}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                {employee.name}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {employee.age}
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                  {employee.class}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {employee.department}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {employee.position}
              </td>
              <td className="px-4 py-3 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  employee.attendance >= 95
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : employee.attendance >= 90
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}>
                  {employee.attendance}%
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {employee.email}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {employee.phone}
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                  {employee.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

