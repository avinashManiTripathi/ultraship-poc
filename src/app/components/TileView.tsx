"use client";

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Badge } from './ui';

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

interface TileViewProps {
  employees: Employee[];
  onTileClick: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
  onFlag: (employeeId: string, employeeName: string) => void;
  flaggedEmployees: Set<string>;
}

/**
 * @description This component is used to display a tile view.
 * @param {TileViewProps} props - The props for the TileView component.
 * @param {Employee[]} employees - The employees of the TileView component.
 * @param {() => void} onTileClick - The function to call when a tile is clicked.
 * @param {() => void} onEdit - The function to call when a tile is edited.
 * @param {() => void} onDelete - The function to call when a tile is deleted.
 * @param {() => void} onFlag - The function to call when a tile is flagged.
 * @param {Set<string>} flaggedEmployees - The flagged employees of the TileView component.
 * @returns {React.ReactNode} The TileView component.
 */
export default function TileView({ employees, onTileClick, onEdit, onDelete, onFlag, flaggedEmployees }: TileViewProps) {
  const { isAdmin } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (employeeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === employeeId ? null : employeeId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {employees.map((employee) => (
        <div
          key={employee.id}
          onClick={() => onTileClick(employee)}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:scale-[1.02] ${
            flaggedEmployees.has(employee.id) 
              ? 'border-2 border-yellow-500 dark:border-yellow-400 ring-2 ring-yellow-200 dark:ring-yellow-900/30' 
              : 'border border-gray-200 dark:border-gray-700'
          }`}
        >
          {/* Card Header with gradient */}
          <div className={`p-4 relative ${
            flaggedEmployees.has(employee.id)
              ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600'
          }`}>
            {/* Flag indicator badge */}
            {flaggedEmployees.has(employee.id) && (
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                <span className="text-xs font-bold text-yellow-600">FLAGGED</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </div>
              
              {/* Action Button */}
              <div className="relative">
                <Button
                  onClick={(e) => toggleMenu(employee.id, e)}
                  variant="ghost"
                  className="p-2 hover:bg-white/20"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </Button>

                {/* Dropdown Menu */}
                {activeMenu === employee.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                    {isAdmin && (
                      <>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(employee);
                            setActiveMenu(null);
                          }}
                          variant="ghost"
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete ${employee.name}?`)) {
                              onDelete(employee.id);
                            }
                            setActiveMenu(null);
                          }}
                          variant="ghost"
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onFlag(employee.id, employee.name);
                        setActiveMenu(null);
                      }}
                      variant="ghost"
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                        flaggedEmployees.has(employee.id)
                          ? 'text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <svg className="w-4 h-4" fill={flaggedEmployees.has(employee.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                      {flaggedEmployees.has(employee.id) ? 'Unflag' : 'Flag for Review'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {employee.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {employee.position}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{employee.department}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 truncate">{employee.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  variant={employee.attendance >= 95 ? 'success' : employee.attendance >= 90 ? 'warning' : 'danger'}
                  size="sm"
                >
                  {employee.attendance}% Attendance
                </Badge>
                <Badge variant="purple" size="sm">
                  {employee.class}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

