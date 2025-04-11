"use client";

import React, { useState, useEffect } from 'react';
import NavigationMenu from '../components/NavigationMenu';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function HomePage() {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('all'); // 'all', 'recent', 'oldest'
  const [selectedMetrics, setSelectedMetrics] = useState({
    clickRate: true,
    openRate: true,
    engagementDelay: true,
  });
  const [performanceData, setPerformanceData] = useState([]);
  const router = useRouter();

  // Fetch campaigns data for listing campaigns
  useEffect(() => {
    fetch('/api/campaigns/', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        const campaignsData = data.campaigns || [];
        setCampaigns(campaignsData);
        setFilteredCampaigns(campaignsData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching campaigns:', err);
        setIsLoading(false);
      });
  }, []);

  // Fetch chart data from the backend
  useEffect(() => {
    fetch('/api/get_chart_data', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        // Format dates for the chart
        const formattedData = data.chart_data.map(item => {
          // Create a date object from the start_date
          const date = new Date(item.start_date);
          // Format date as Month-Date-Year
          const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
          
          return {
            ...item,
            formattedDate
          };
        });
        
        setPerformanceData(formattedData);
      })
      .catch((err) => {
        console.error('Error fetching chart data:', err);
      });
  }, []);

  // Handle filtering and searching on the campaigns list
  useEffect(() => {
    let results = campaigns;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(campaign => 
        campaign.campaign_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date filter if needed
    if (filterDate === 'recent') {
      results = [...results].sort((a, b) => {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      });
    } else if (filterDate === 'oldest') {
      results = [...results].sort((a, b) => {
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      });
    }
    
    setFilteredCampaigns(results);
  }, [searchTerm, filterDate, campaigns]);

  const handleCampaignClick = (campaignId) => {
    router.push(`/dashboard/${campaignId}`);
  };

  const toggleMetric = (metric) => {
    setSelectedMetrics({
      ...selectedMetrics,
      [metric]: !selectedMetrics[metric]
    });
  };

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#252B61] border border-[#394082] p-3 rounded shadow-lg opacity-100">
          <p className="font-medium text-white">{data.campaignName}</p>
          <p className="text-gray-300 text-sm">Send Date: {data.formattedDate}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry, index) => (
              <p key={`item-${index}`} style={{ color: entry.color }}>
                {entry.name}: {entry.value}
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
      <div className="flex flex-auto flex-col lg:flex-row">
        {/* Main Content */}
        <div className="h-[calc(100vh-5rem)] w-screen p-4 lg:p-10 flex flex-col overflow-auto bg-[#0F142E]">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          </div>
          
          {/* Performance Graph Section */}
          <div className="mt-6 bg-[#1A1F4A] rounded-lg p-4 shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4">Campaign Performance</h2>
            <div className="flex flex-col md:flex-row">
              {/* Graph */}
              <div className="flex-grow">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={performanceData}
                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      {/* Use the formatted date for the x-axis */}
                      <XAxis dataKey="formattedDate" stroke="#CCCCCC" />
                      <YAxis stroke="#CCCCCC" />
                      <Tooltip 
                        content={<CustomTooltip />}
                        wrapperStyle={{ opacity: 1, zIndex: 1000 }} // Ensure tooltip is fully opaque and on top
                      />
                      <Legend />
                      {selectedMetrics.clickRate && (
                        <Line
                          type="monotone"
                          dataKey="clickRate"
                          name="Click Rate"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      )}
                      {selectedMetrics.openRate && (
                        <Line
                          type="monotone"
                          dataKey="openRate"
                          name="Open Rate"
                          stroke="#82ca9d"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      )}
                      {selectedMetrics.engagementDelay && (
                        <Line
                          type="monotone"
                          dataKey="engagementDelay"
                          name="Engagement Delay"
                          stroke="#ffc658"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Legend/Controls */}
              <div className="md:w-48 mt-4 md:mt-0 md:ml-6 flex flex-row md:flex-col justify-center md:justify-start">
                <div className="text-white font-medium mb-2 md:mb-4">Metrics:</div>
                <div className="flex flex-row md:flex-col space-x-4 md:space-x-0 md:space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="clickRate"
                      checked={selectedMetrics.clickRate}
                      onChange={() => toggleMetric('clickRate')}
                      className="mr-2"
                    />
                    <label htmlFor="clickRate" className="text-white flex items-center">
                      <span className="w-3 h-3 bg-[#8884d8] rounded-full inline-block mr-2"></span>
                      Click Rate
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="openRate"
                      checked={selectedMetrics.openRate}
                      onChange={() => toggleMetric('openRate')}
                      className="mr-2"
                    />
                    <label htmlFor="openRate" className="text-white flex items-center">
                      <span className="w-3 h-3 bg-[#82ca9d] rounded-full inline-block mr-2"></span>
                      Open Rate
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="engagementDelay"
                      checked={selectedMetrics.engagementDelay}
                      onChange={() => toggleMetric('engagementDelay')}
                      className="mr-2"
                    />
                    <label htmlFor="engagementDelay" className="text-white flex items-center">
                      <span className="w-3 h-3 bg-[#ffc658] rounded-full inline-block mr-2"></span>
                      Engagement Delay
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Campaigns List */}
          <div className="mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-lg font-semibold text-white mb-4 md:mb-0">My Campaigns</h2>
              {/* Search Section */}
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#1A1F4A] text-white w-full pl-4 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <p className="text-gray-400">Loading campaigns...</p>
              </div>
            ) : (
              <>
                {searchTerm && (
                  <p className="text-gray-400 mb-4">
                    {filteredCampaigns.length} {filteredCampaigns.length === 1 ? 'result' : 'results'} for "{searchTerm}"
                  </p>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCampaigns && filteredCampaigns.length > 0 ? (
                    filteredCampaigns.map((campaign) => (
                      <div
                        key={campaign.campaign_id}
                        onClick={() => handleCampaignClick(campaign.campaign_id)}
                        className="bg-[#1A1F4A] p-4 rounded-lg shadow-md hover:shadow-lg hover:scale-105 hover:bg-[#252B61] hover:border-blue-500 hover:border transition-all duration-300 ease-in-out cursor-pointer"
                      >
                        <h3 className="text-white font-medium">{campaign.campaign_name}</h3>
                        <p className="text-gray-400 text-sm mt-2">{campaign.campaign_description}</p>
                        {campaign.created_at && (
                          <p className="text-gray-500 text-xs mt-3">
                            Created: {new Date(campaign.created_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 col-span-3 text-center py-10">
                      {searchTerm ? 'No campaigns match your search.' : 'No campaigns found.'}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;