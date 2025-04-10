"use client";

import React, { useState, useEffect } from 'react';
import NavigationMenu from '../components/NavigationMenu';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { UserPlus, Edit, Trash2, Search, X, Filter, Users, UserCheck } from 'lucide-react';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'admin', 'customer'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [userStats, setUserStats] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'customer',
    status: 'active',
    company: '',
    phone: ''
  });
  
  const router = useRouter();

  // Fetch users data
  useEffect(() => {
    fetch('http://localhost:8000/api/users/', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        const usersData = data.users || [];
        setUsers(usersData);
        setFilteredUsers(usersData);
        setIsLoading(false);
        
        // Calculate stats for the pie chart
        const adminCount = usersData.filter(user => user.role === 'admin').length;
        const customerCount = usersData.filter(user => user.role === 'customer').length;
        const activeCount = usersData.filter(user => user.status === 'active').length;
        const inactiveCount = usersData.filter(user => user.status === 'inactive').length;
        
        setUserStats([
          { name: 'Admins', value: adminCount, color: '#8884d8' },
          { name: 'Customers', value: customerCount, color: '#82ca9d' },
          { name: 'Active', value: activeCount, color: '#4CAF50' },
          { name: 'Inactive', value: inactiveCount, color: '#F44336' },
        ]);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setIsLoading(false);
      });
  }, []);

  // Check for authentication token and admin role
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
    
    if (!token) {
      router.push("/login");
    } else if (userRole !== 'admin') {
      router.push("/admin");
    }
  }, [router]);

  // Handle filtering and searching
  useEffect(() => {
    let results = users;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      results = results.filter(user => user.role === filterType);
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      results = results.filter(user => user.status === filterStatus);
    }
    
    setFilteredUsers(results);
  }, [searchTerm, filterType, filterStatus, users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddUser = () => {
    setIsLoading(true);
    
    fetch('http://localhost:8000/api/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Add the new user to the list
          setUsers([...users, data.user]);
          setShowAddModal(false);
          resetForm();
        } else {
          alert(data.message || 'Failed to add user');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error adding user:', err);
        alert('An error occurred while adding the user');
        setIsLoading(false);
      });
  };

  const handleEditUser = () => {
    setIsLoading(true);
    
    fetch(`http://localhost:8000/api/users/${currentUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Update the user in the list
          setUsers(users.map(user => 
            user.id === currentUser.id ? { ...user, ...formData } : user
          ));
          setShowEditModal(false);
          resetForm();
        } else {
          alert(data.message || 'Failed to update user');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error updating user:', err);
        alert('An error occurred while updating the user');
        setIsLoading(false);
      });
  };

  const handleDeleteUser = () => {
    setIsLoading(true);
    
    fetch(`/api/users/${currentUser.id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Remove the user from the list
          setUsers(users.filter(user => user.id !== currentUser.id));
          setShowDeleteModal(false);
        } else {
          alert(data.message || 'Failed to delete user');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error deleting user:', err);
        alert('An error occurred while deleting the user');
        setIsLoading(false);
      });
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      company: user.company || '',
      phone: user.phone || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'customer',
      status: 'active',
      company: '',
      phone: ''
    });
    setCurrentUser(null);
  };

  return (
    <div className="flex flex-col justify-start w-screen h-screen">
      <div className="h-20 flex-none">
        <NavigationMenu />
      </div>
      <div className="flex flex-auto flex-col lg:flex-row">
        {/* Main Content */}
        <div className="h-[calc(100vh-5rem)] w-screen p-4 lg:p-10 flex flex-col overflow-auto bg-[#0F142E]">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition-all duration-300"
            >
              <UserPlus size={18} className="mr-2" />
              Add User
            </button>
          </div>
          
          {/* Stats Section */}
          <div className="mt-6 bg-[#1A1F4A] rounded-lg p-4 shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4">User Statistics</h2>
            <div className="flex flex-col md:flex-row">
              {/* Chart */}
              <div className="md:w-1/2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userStats.slice(0, 2)} // Only admin/customer data
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {userStats.slice(0, 2).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Stats Cards */}
              <div className="md:w-1/2 flex flex-wrap justify-center items-center">
                <div className="w-1/2 p-2">
                  <div className="bg-[#252B61] rounded-lg p-4 text-center">
                    <Users size={24} className="mx-auto text-blue-400 mb-2" />
                    <h3 className="text-gray-300 text-sm">Total Users</h3>
                    <p className="text-white text-xl font-bold">{users.length}</p>
                  </div>
                </div>
                <div className="w-1/2 p-2">
                  <div className="bg-[#252B61] rounded-lg p-4 text-center">
                    <UserCheck size={24} className="mx-auto text-green-400 mb-2" />
                    <h3 className="text-gray-300 text-sm">Active Users</h3>
                    <p className="text-white text-xl font-bold">
                      {users.filter(user => user.status === 'active').length}
                    </p>
                  </div>
                </div>
                <div className="w-1/2 p-2">
                  <div className="bg-[#252B61] rounded-lg p-4 text-center">
                    <div className="mx-auto text-purple-400 mb-2 flex justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <h3 className="text-gray-300 text-sm">Admins</h3>
                    <p className="text-white text-xl font-bold">
                      {users.filter(user => user.role === 'admin').length}
                    </p>
                  </div>
                </div>
                <div className="w-1/2 p-2">
                  <div className="bg-[#252B61] rounded-lg p-4 text-center">
                    <div className="mx-auto text-green-400 mb-2 flex justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <h3 className="text-gray-300 text-sm">Customers</h3>
                    <p className="text-white text-xl font-bold">
                      {users.filter(user => user.role === 'customer').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Users List */}
          <div className="mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-lg font-semibold text-white mb-4 md:mb-0">User Management</h2>
              {/* Search and Filter Section */}
              <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#1A1F4A] text-white w-full pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                
                {/* Filters */}
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-[#1A1F4A] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="admin">Admins</option>
                    <option value="customer">Customers</option>
                  </select>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-[#1A1F4A] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <p className="text-gray-400">Loading users...</p>
              </div>
            ) : (
              <>
                {searchTerm && (
                  <p className="text-gray-400 mb-4">
                    {filteredUsers.length} {filteredUsers.length === 1 ? 'result' : 'results'} for "{searchTerm}"
                  </p>
                )}
                
                {/* Users Table */}
                <div className="overflow-x-auto rounded-lg shadow">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-[#252B61]">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Company
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#1A1F4A] divide-y divide-gray-700">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-[#252B61]">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-white">{user.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-300">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                              {user.company || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                onClick={() => openEditModal(user)}
                                className="text-blue-400 hover:text-blue-300 mr-3"
                              >
                                <Edit size={18} />
                              </button>
                              <button 
                                onClick={() => openDeleteModal(user)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-gray-400">
                            No users found matching your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1A1F4A] rounded-lg w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Add New User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Company name (optional)"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Phone number (optional)"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Adding...' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1A1F4A] rounded-lg w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1A1F4A] rounded-lg w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Confirm Delete</h2>
            <p className="text-gray-300">
              Are you sure you want to delete the user <span className="font-semibold text-white">{currentUser?.name}</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;