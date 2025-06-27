'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import { FiEdit2, FiTrash2, FiPlus, FiUsers, FiFilter, FiShield, FiMail } from 'react-icons/fi';

// Simulated user data
const sampleUsers = [
  {
    id: 'user-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    department: 'Safety',
    status: 'Active',
    lastLogin: '2025-06-25 09:15 AM',
    createdAt: '2025-01-15',
  },
  {
    id: 'user-002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Manager',
    department: 'Operations',
    status: 'Active',
    lastLogin: '2025-06-26 11:32 AM',
    createdAt: '2025-01-20',
  },
  {
    id: 'user-003',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    role: 'Viewer',
    department: 'Maintenance',
    status: 'Active',
    lastLogin: '2025-06-24 03:45 PM',
    createdAt: '2025-02-05',
  },
  {
    id: 'user-004',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    role: 'Manager',
    department: 'HR',
    status: 'Inactive',
    lastLogin: '2025-05-30 10:20 AM',
    createdAt: '2025-02-10',
  },
  {
    id: 'user-005',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'Viewer',
    department: 'Operations',
    status: 'Active',
    lastLogin: '2025-06-26 09:05 AM',
    createdAt: '2025-02-15',
  },
  {
    id: 'user-006',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'Manager',
    department: 'Safety',
    status: 'Active',
    lastLogin: '2025-06-25 01:40 PM',
    createdAt: '2025-03-01',
  },
  {
    id: 'user-007',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    role: 'Viewer',
    department: 'Finance',
    status: 'Active',
    lastLogin: '2025-06-26 08:55 AM',
    createdAt: '2025-03-10',
  },
  {
    id: 'user-008',
    name: 'Jennifer Moore',
    email: 'jennifer.moore@example.com',
    role: 'Admin',
    department: 'IT',
    status: 'Active',
    lastLogin: '2025-06-26 10:15 AM',
    createdAt: '2025-03-15',
  },
  {
    id: 'user-009',
    name: 'Christopher Taylor',
    email: 'christopher.taylor@example.com',
    role: 'Viewer',
    department: 'Operations',
    status: 'Inactive',
    lastLogin: '2025-06-01 11:30 AM',
    createdAt: '2025-04-01',
  },
  {
    id: 'user-010',
    name: 'Amanda Anderson',
    email: 'amanda.anderson@example.com',
    role: 'Manager',
    department: 'Maintenance',
    status: 'Active',
    lastLogin: '2025-06-25 02:25 PM',
    createdAt: '2025-04-10',
  },
  {
    id: 'user-011',
    name: 'Matthew Thomas',
    email: 'matthew.thomas@example.com',
    role: 'Viewer',
    department: 'HR',
    status: 'Active',
    lastLogin: '2025-06-24 09:50 AM',
    createdAt: '2025-04-15',
  },
  {
    id: 'user-012',
    name: 'Olivia Jackson',
    email: 'olivia.jackson@example.com',
    role: 'Viewer',
    department: 'Safety',
    status: 'Active',
    lastLogin: '2025-06-25 11:05 AM',
    createdAt: '2025-05-01',
  },
  {
    id: 'user-013',
    name: 'Daniel White',
    email: 'daniel.white@example.com',
    role: 'Manager',
    department: 'Operations',
    status: 'Active',
    lastLogin: '2025-06-26 09:30 AM',
    createdAt: '2025-05-10',
  },
  {
    id: 'user-014',
    name: 'Sophia Harris',
    email: 'sophia.harris@example.com',
    role: 'Viewer',
    department: 'Finance',
    status: 'Inactive',
    lastLogin: '2025-05-15 10:40 AM',
    createdAt: '2025-05-15',
  },
  {
    id: 'user-015',
    name: 'James Martin',
    email: 'james.martin@example.com',
    role: 'Admin',
    department: 'IT',
    status: 'Active',
    lastLogin: '2025-06-26 08:20 AM',
    createdAt: '2025-06-01',
  },
  {
    id: 'user-016',
    name: 'Isabella Thompson',
    email: 'isabella.thompson@example.com',
    role: 'Manager',
    department: 'Safety',
    status: 'Active',
    lastLogin: '2025-06-25 03:30 PM',
    createdAt: '2025-06-05',
  },
  {
    id: 'user-017',
    name: 'William Garcia',
    email: 'william.garcia@example.com',
    role: 'Viewer',
    department: 'Operations',
    status: 'Active',
    lastLogin: '2025-06-24 01:15 PM',
    createdAt: '2025-06-10',
  },
  {
    id: 'user-018',
    name: 'Mia Martinez',
    email: 'mia.martinez@example.com',
    role: 'Viewer',
    department: 'Maintenance',
    status: 'Active',
    lastLogin: '2025-06-25 10:50 AM',
    createdAt: '2025-06-15',
  },
  {
    id: 'user-019',
    name: 'Benjamin Robinson',
    email: 'benjamin.robinson@example.com',
    role: 'Manager',
    department: 'HR',
    status: 'Active',
    lastLogin: '2025-06-26 11:10 AM',
    createdAt: '2025-06-20',
  },
  {
    id: 'user-020',
    name: 'Charlotte Clark',
    email: 'charlotte.clark@example.com',
    role: 'Viewer',
    department: 'Finance',
    status: 'Active',
    lastLogin: '2025-06-25 04:00 PM',
    createdAt: '2025-06-22',
  },
];

export default function UserManagementPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'Admin User', email: 'admin@example.com' });
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setUsers(sampleUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Table columns definition
  const userColumns = [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: 'Name', accessorKey: 'name', sortable: true },
    { header: 'Email', accessorKey: 'email', sortable: true },
    { 
      header: 'Role', 
      accessorKey: 'role', 
      sortable: true,
      cell: ({ row }) => {
        let badgeClass = 'bg-gray-100 text-gray-800';
        if (row.role === 'Admin') badgeClass = 'bg-purple-100 text-purple-800';
        else if (row.role === 'Manager') badgeClass = 'bg-blue-100 text-blue-800';
        else if (row.role === 'Viewer') badgeClass = 'bg-green-100 text-green-800';
        
        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeClass}`}>
            {row.role}
          </span>
        );
      }
    },
    { header: 'Department', accessorKey: 'department', sortable: true },
    { 
      header: 'Status', 
      accessorKey: 'status', 
      sortable: true,
      cell: ({ row }) => {
        const statusClass = row.status === 'Active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800';
        
        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
            {row.status}
          </span>
        );
      }
    },
    { header: 'Last Login', accessorKey: 'lastLogin', sortable: true },
    { header: 'Created', accessorKey: 'createdAt', sortable: true },
    { 
      header: 'Actions', 
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditUser(row)}
            className="p-1 text-blue-600 hover:text-blue-800"
          >
            <FiEdit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteUser(row.id)}
            className="p-1 text-red-600 hover:text-red-800"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      )
    },
  ];

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowAddModal(true);
  };

  const handleDeleteUser = (id) => {
    // In a real app, this would call an API
    setUsers(users.filter(user => user.id !== id));
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingUser(null);
  };

  // This would be expanded in a real app
  const handleSaveUser = (userData) => {
    // In a real app, this would call an API
    if (editingUser) {
      setUsers(users.map(user => user.id === editingUser.id ? { ...user, ...userData } : user));
    } else {
      const newUser = {
        id: `user-${String(users.length + 1).padStart(3, '0')}`,
        ...userData,
        status: 'Active',
        lastLogin: 'Never',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
    }
    setShowAddModal(false);
    setEditingUser(null);
  };

  return (
    <DashboardLayout user={user}>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading user data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Page header */}
          <div className="sm:flex sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
            <div className="mt-3 sm:mt-0">
              <button
                type="button"
                onClick={handleAddUser}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                Add User
              </button>
            </div>
          </div>

          {/* Filter controls */}
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FiFilter className="mr-2 h-5 w-5 text-gray-400" />
                Filters
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    defaultValue=""
                  >
                    <option value="">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <select
                    id="department"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    defaultValue=""
                  >
                    <option value="">All Departments</option>
                    <option value="Safety">Safety</option>
                    <option value="Operations">Operations</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    defaultValue=""
                  >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* User summary */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                    <FiUsers className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {users.length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <FiUsers className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {users.filter(user => user.status === 'Active').length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <FiShield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Admin Users</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {users.filter(user => user.role === 'Admin').length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <DataTable
              data={users}
              columns={userColumns}
              title="Users"
              showSearch={true}
              showDownload={true}
              downloadFileName="users"
              className="rounded-lg shadow"
            />
          </div>
        </div>
      )}

      {/* Add/Edit User Modal - would be expanded in a real app */}
      {showAddModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiUsers className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {editingUser ? 'Edit User' : 'Add New User'}
                    </h3>
                    <div className="mt-4">
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            defaultValue={editingUser?.name || ''}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiMail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              defaultValue={editingUser?.email || ''}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                              Role
                            </label>
                            <select
                              id="role"
                              name="role"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                              defaultValue={editingUser?.role || 'Viewer'}
                            >
                              <option>Admin</option>
                              <option>Manager</option>
                              <option>Viewer</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                              Department
                            </label>
                            <select
                              id="department"
                              name="department"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                              defaultValue={editingUser?.department || 'Operations'}
                            >
                              <option>Safety</option>
                              <option>Operations</option>
                              <option>Maintenance</option>
                              <option>HR</option>
                              <option>Finance</option>
                              <option>IT</option>
                            </select>
                          </div>
                        </div>
                        
                        {editingUser && (
                          <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                              Status
                            </label>
                            <select
                              id="status"
                              name="status"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                              defaultValue={editingUser?.status || 'Active'}
                            >
                              <option>Active</option>
                              <option>Inactive</option>
                            </select>
                          </div>
                        )}
                        
                        {!editingUser && (
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                              </label>
                              <input
                                type="password"
                                name="password"
                                id="password"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              />
                            </div>
                            <div>
                              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                              </label>
                              <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleSaveUser({
                    // In a real app, this would gather form values properly
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    role: document.getElementById('role').value,
                    department: document.getElementById('department').value,
                    status: editingUser ? document.getElementById('status').value : 'Active',
                  })}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}