"use client";

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GridView from './components/GridView';
import TileView from './components/TileView';
import DetailView from './components/DetailView';
import AddEmployeeModal from './components/AddEmployeeModal';
import ManageDepartments from './components/ManageDepartments';

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

function Dashboard() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'tile'>('tile');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManageDepartments, setShowManageDepartments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [departmentFilter, setDepartmentFilter] = useState<{ type: 'all' | 'department', value?: string }>({ type: 'all' });
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEmployees();
      fetchDepartments();
    }
  }, [isAuthenticated, currentPage, searchTerm, sortBy, sortOrder, departmentFilter]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            query {
              departments {
                name
              }
            }
          `,
        }),
      });

      const result = await response.json();
      if (result.data?.departments) {
        setDepartments(result.data.departments.map((d: any) => d.name));
      }
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');

    try {
      // Build filter based on search and department
      let filter: any = {};
      if (searchTerm) {
        filter.name = searchTerm;
      }
      if (departmentFilter.type === 'department' && departmentFilter.value) {
        filter.department = departmentFilter.value;
      }

      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            query GetEmployees($filter: EmployeeFilterInput, $page: Int, $pageSize: Int, $sortBy: EmployeeSortField, $sortOrder: SortOrder) {
              employees(filter: $filter, page: $page, pageSize: $pageSize, sortBy: $sortBy, sortOrder: $sortOrder) {
                employees {
                  id
                  name
                  age
                  class
                  subjects
                  attendance
                  email
                  phone
                  department
                  position
                  joinDate
                  salary
                  address
                  status
                }
                totalCount
                pageInfo {
                  currentPage
                  pageSize
                  totalPages
                  hasNextPage
                  hasPreviousPage
                }
              }
            }
          `,
          variables: {
            filter: Object.keys(filter).length > 0 ? filter : null,
            page: currentPage,
            pageSize: 12,
            sortBy,
            sortOrder,
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      setEmployees(result.data.employees.employees);
      setTotalPages(result.data.employees.pageInfo.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch employees');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId: string) => {
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation DeleteEmployee($id: ID!) {
              deleteEmployee(id: $id)
            }
          `,
          variables: { id: employeeId },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      fetchEmployees(); // Refresh the list
    } catch (err: any) {
      alert(err.message || 'Failed to delete employee');
    }
  };

  const handleEdit = (employee: Employee) => {
    alert('Edit feature - Coming soon!\n\nThis would open a modal to edit employee details.');
  };

  const handleFilterChange = (filter: { type: 'all' | 'department', value?: string }) => {
    setDepartmentFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onFilterChange={handleFilterChange}
        currentFilter={departmentFilter}
        onManageDepartments={() => setShowManageDepartments(true)}
        departments={departments}
      />

      <main className={`flex-1 flex flex-col transition-all duration-300 pt-[57px] overflow-hidden ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <div className="p-6 pb-4">
          {/* Controls Bar - Fixed */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Left - Filter info & Search */}
              <div className="flex-1 w-full md:max-w-md space-y-2">
                {departmentFilter.type === 'department' && (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      {departmentFilter.value}
                    </span>
                    <button
                      onClick={() => handleFilterChange({ type: 'all' })}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Clear filter
                    </button>
                  </div>
                )}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Right - Sort, View Toggle & Add Button */}
              <div className="flex gap-2 items-center flex-wrap">
                {isAdmin && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Employee
                  </button>
                )}

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="age">Age</option>
                  <option value="department">Department</option>
                  <option value="attendance">Attendance</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                >
                  <svg className={`w-5 h-5 transition-transform ${sortOrder === 'DESC' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </button>

                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('tile')}
                    className={`px-4 py-2 transition-colors ${
                      viewMode === 'tile'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Employee List Area */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Loading & Error States */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading employees...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Employee Data Views */}
          {!loading && !error && (
            <>
              {viewMode === 'grid' ? (
                <GridView employees={employees} onRowClick={setSelectedEmployee} />
              ) : (
                <TileView
                  employees={employees}
                  onTileClick={setSelectedEmployee}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Detail View Modal */}
      {selectedEmployee && (
        <DetailView employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
      )}

      {/* Add Employee Modal */}
      <AddEmployeeModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchEmployees}
        departments={departments}
      />

      {/* Manage Departments Modal */}
      <ManageDepartments
        isOpen={showManageDepartments}
        onClose={() => {
          setShowManageDepartments(false);
          fetchDepartments(); // Refresh departments after managing
        }}
      />
    </div>
  );
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthProvider>
      <AuthWrapper onLoginSuccess={() => setIsLoggedIn(true)}>
        <Dashboard />
      </AuthWrapper>
    </AuthProvider>
  );
}

function AuthWrapper({ children, onLoginSuccess }: { children: React.ReactNode; onLoginSuccess: () => void }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={onLoginSuccess} />;
  }

  return <>{children}</>;
}
