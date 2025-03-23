"use client"; // Mark as Client Component

import React, { useState, useEffect } from 'react';
import NavigationMenu from '../components/NavigationMenu';

function HomePage() {
  const [campaigns, setCampaigns] = useState([]);

  // Fetch campaigns on mount
  useEffect(() => {
    fetch('/api/campaigns/', { credentials: 'include' }) // Proxy to Django
      .then((res) => res.json())
      .then((data) => setCampaigns(data.campaigns))
      .catch((err) => console.error('Error fetching campaigns:', err));
  }, []);

  const handleProfileClick = () => {
    console.log('Navigating to Profile');
    window.location.href = '/profile/';
  };

  const handleUpgradePlanClick = () => {
    console.log('Navigating to Upgrade Plan');
    window.location.href = '/upgrade-plan/';
  };

  return (
    <div className="flex flex-col justify-start w-screen h-screen">
      {/* Top Navigation */}
      <div className="h-20 flex-none">
        <NavigationMenu />
      </div>

      {/* Main Content */}
      <div className="flex flex-auto flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-screen lg:w-[6rem] bg-[#0F142E] flex lg:flex-col justify-center items-center py-5 space-x-6 lg:space-y-12 lg:space-x-0">
          <button
            onClick={handleProfileClick}
            className="text-white hover:text-gray-200 font-medium transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-[#1A1F4A] px-4 py-2 rounded-md hover:shadow-md"
          >
            Profile
          </button>
          <button
            onClick={handleUpgradePlanClick}
            className="text-white hover:text-gray-200 font-medium transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-[#1A1F4A] px-4 py-2 rounded-md hover:shadow-md"
          >
            Upgrade Plan
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="h-[calc(100vh-5rem)] w-screen p-4 lg:p-10 flex flex-col overflow-auto bg-[#0F142E]">
          <h1 className="text-xl font-bold text-white">Dashboard</h1>

          {/* My Campaigns Section */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-white mb-4">My Campaigns</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.length > 0 ? (
                campaigns.map((campaign, index) => (
                  <div
                    key={index}
                    className="bg-[#1A1F4A] p-4 rounded-lg shadow-md hover:shadow-lg hover:scale-105 hover:bg-[#252B61] hover:border-blue-500 hover:border transition-all duration-300 ease-in-out cursor-pointer"
                  >
                    <h3 className="text-white font-medium">{campaign.campaign_name}</h3>
                    <p className="text-gray-400 text-sm mt-2">{campaign.campaign_description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No campaigns found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;