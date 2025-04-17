"use client";

import React, { useState, useEffect } from "react";
import NavigationMenu from "../components/NavigationMenu";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { UserPlus, Upload, Search, X } from "lucide-react";

function CustomersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
const [selectedUsers, setSelectedUsers] = useState(new Set());
const [selectAll, setSelectAll] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState({
    clickRate: true,
    engagementDelay: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    age: "",
    first_name: "",
    last_name: "",
    gender: "",
    location: "",
    timezone: "",
  });
  const [csvFile, setCsvFile] = useState(null);
  const router = useRouter();

  // Fetch users and engagement data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");


        // Fetch users (CompanyUser)
        const usersResponse = await fetch("/api/get-company-users/", {
          headers: { "Authorization": `Token ${token}` },
          credentials: "include",
        });
        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const usersData = await usersResponse.json();
        setUsers(usersData.company_users || []);
        setFilteredUsers(usersData.company_users || []);

        // Fetch engagement data for chart
        const chartResponse = await fetch("/api/user-engagement-stats/", {
          headers: { "Authorization": `Token ${token}` },
          credentials: "include",
        });
        if (!chartResponse.ok) throw new Error("Failed to fetch chart data");
        const chartDataRaw = await chartResponse.json();
        const formattedData = chartDataRaw.map(item => ({
          name: item.user_email,
          clickRate: item.avg_click_rate,
          engagementDelay: item.avg_engagement_delay,
        }));
        setChartData(formattedData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Filter users based on search term
  useEffect(() => {
    const results = users.filter(user =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.location && user.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle CSV file change
  const handleCsvChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleAddUser = async () => {
    setIsLoading(true);
    try {
      // const token = localStorage.getItem("authToken");
      const token = localStorage.getItem("authToken")
      console.log(token);
      const response = await fetch("/api/add-user/", {
        method: "POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) throw new Error("Failed to add user");
  
      const data = await response.json();
      setUsers([...users, data.user]);
      setFilteredUsers([...users, data.user]);
      setShowAddModal(false);
      resetForm();
      setSelectionMode(false);
      setSelectedUsers(new Set());
      setSelectAll(false);



    } catch (err) {
      console.error("Error adding user:", err);
      alert("Failed to add user");
    } finally {
      setIsLoading(false);
    }
  };
  

  // Add users via CSV
  const handleCsvUpload = async () => {
    if (!csvFile) {
      alert("Please select a CSV file");
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("file", csvFile);
      const response = await fetch("/api/upload-company-users-csv/", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload CSV");
      const data = await response.json();
      setUsers([...users, ...data.users]);
      setFilteredUsers([...users, ...data.users]); // Update filtered list too
      setShowCsvModal(false);
      setCsvFile(null);
    } catch (err) {
      console.error("Error uploading CSV:", err);
      alert("Failed to upload CSV");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      email: "",
      age: "",
      first_name: "",
      last_name: "",
      gender: "",
      location: "",
      timezone: "",
    });
  };
  const toggleUserSelection = userId => {
    const updated = new Set(selectedUsers);
    updated.has(userId) ? updated.delete(userId) : updated.add(userId);
    setSelectedUsers(updated);
  };
  
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(user => user.id)));
    }
    setSelectAll(!selectAll);
  };
  
  const handleDeleteSelected = async () => {
    if (selectedUsers.size === 0) return;
    try {
      const token = localStorage.getItem("authToken");
      await fetch("/api/delete-users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({ user_ids: Array.from(selectedUsers) })
      });
      setUsers(users.filter(user => !selectedUsers.has(user.id)));
      setFilteredUsers(filteredUsers.filter(user => !selectedUsers.has(user.id)));
      setSelectedUsers(new Set());
      setSelectAll(false);
      setSelectionMode(false);
    } catch (err) {
      console.error("Error deleting users:", err);
    }
  };
  
  // Toggle metrics for chart
  const toggleMetric = (metric) => {
    setSelectedMetrics({ ...selectedMetrics, [metric]: !selectedMetrics[metric] });
  };

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#252B61] border border-[#394082] p-3 rounded shadow-lg opacity-100">
          <p className="font-medium text-white">{data.name}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry, index) => (
              <p key={`item-${index}`} style={{ color: entry.color }}>
                {entry.name}: {entry.value.toFixed(2)}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col justify-start w-screen h-screen">
      <div className="h-20 flex-none">
        <NavigationMenu />
      </div>
      <div className="flex flex-auto flex-col">
        <div className="h-[calc(100vh-5rem)] w-screen p-4 lg:p-10 flex flex-col overflow-auto bg-[#0F142E]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Users</h1>
            <div className="flex space-x-4">
            {!selectionMode ? (
    <>
      <button
        onClick={() => setShowAddModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition-all"
      >
        <UserPlus size={18} className="mr-2" />
        Add User
      </button>
      <button
        onClick={() => setShowCsvModal(true)}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center transition-all"
      >
        <Upload size={18} className="mr-2" />
        Upload CSV
      </button>
      <button
        onClick={() => {
          setSelectionMode(true);
          setSelectedUsers(new Set());
          setSelectAll(false);
        }}
        className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition-all"
      >
        Select
      </button>
    </>
  ) : (
    <>
      <button
        onClick={toggleSelectAll}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
      >
        {selectAll ? "Unselect All" : "Select All"}
      </button>
      <button
        onClick={handleDeleteSelected}
        disabled={selectedUsers.size === 0}
        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg disabled:opacity-50"
      >
        Delete Selected
      </button>
      <button
        onClick={() => {
          setSelectionMode(false);
          setSelectedUsers(new Set());
          setSelectAll(false);
        }}
        className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
      >
        Deselect
      </button>
    </>
  )}
            </div>
            
          </div>

          {/* Search Section */}
          <div className="mb-6">
            <div className="relative w-full md:w-64">
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
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="text-gray-400 mt-2">
                {filteredUsers.length} {filteredUsers.length === 1 ? "result" : "results"} for "{searchTerm}"
              </p>
            )}
          </div>

          {/* Chart Section */}
          <div className="mt-6 bg-[#1A1F4A] rounded-lg p-4 shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4">User Engagement Statistics</h2>
            <div className="flex flex-col md:flex-row">
              <div className="flex-grow">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#CCCCCC" />
                      <YAxis stroke="#CCCCCC" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      {selectedMetrics.clickRate && (
                        <Line
                          type="monotone"
                          dataKey="clickRate"
                          name="Avg Click Rate"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      )}
                      {selectedMetrics.engagementDelay && (
                        <Line
                          type="monotone"
                          dataKey="engagementDelay"
                          name="Avg Engagement Delay (s)"
                          stroke="#ffc658"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="md:w-48 mt-4 md:mt-0 md:ml-6 flex flex-row md:flex-col justify-center md:justify-start">
                <div className="text-white font-medium mb-2 md:mb-4">Metrics:</div>
                <div className="flex flex-row md:flex-col space-x-4 md:space-x-0 md:space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="clickRate"
                      checked={selectedMetrics.clickRate}
                      onChange={() => toggleMetric("clickRate")}
                      className="mr-2"
                    />
                    <label htmlFor="clickRate" className="text-white flex items-center">
                      <span className="w-3 h-3 bg-[#8884d8] rounded-full inline-block mr-2"></span>
                      Avg Click Rate
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="engagementDelay"
                      checked={selectedMetrics.engagementDelay}
                      onChange={() => toggleMetric("engagementDelay")}
                      className="mr-2"
                    />
                    <label htmlFor="engagementDelay" className="text-white flex items-center">
                      <span className="w-3 h-3 bg-[#ffc658] rounded-full inline-block mr-2"></span>
                      Avg Engagement Delay
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-white mb-4">User List</h2>
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <p className="text-gray-400">Loading users...</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-[#1A1F4A]">
                  <tr>
                    {selectionMode && <th className="px-3 py-2 text-gray-300">Select</th>}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Timezone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date Joined</th>
                  </tr>
                </thead>

                  <tbody className="bg-[#1A1F4A] divide-y divide-gray-700">
                    
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-[#252B61]">

                        {selectionMode && (
                                <td className="px-3 py-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedUsers.has(user.id)}
                                    onChange={() => toggleUserSelection(user.id)}
                                  />
                                </td>
                              )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-white">{`${user.first_name} ${user.last_name}`}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.age || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.gender || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.location || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.timezone || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                            {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-center text-gray-400">
                          No users found matching your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
                <label className="block text-gray-300 text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter age"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Timezone</label>
                <input
                  type="text"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter timezone (e.g., IST)"
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
                {isLoading ? "Adding..." : "Add User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Upload Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1A1F4A] rounded-lg w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Upload Users via CSV</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvChange}
                  className="w-full bg-[#252B61] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-gray-400 text-xs mt-2">
                  Expected columns: email, age, first_name, last_name, gender, location, timezone
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCsvModal(false);
                  setCsvFile(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCsvUpload}
                disabled={isLoading || !csvFile}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Uploading..." : "Upload CSV"}
              </button>

              
            </div>
            
          </div>
        </div>
      )}
     
    </div>
    
  );
}

export default CustomersPage;