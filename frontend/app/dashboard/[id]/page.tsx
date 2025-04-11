"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NavigationMenu from '../../components/NavigationMenu';

function CampaignDashboardPage() {
  const params = useParams();
  const campaignId = params?.id;
  const [campaignStats, setCampaignStats] = useState(null);
  const [campaignMeta, setCampaignMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (isoString) => {
    if (!isoString) return 'Loading...';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    const fetchCampaignStats = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/get-campaign-details/?campaign_id=${campaignId}`, {
          credentials: 'include'
        });
        const data = await res.json();
        
        if (data && data.campaign_details.length > 0) {
          setCampaignStats(data.campaign_details[0]);
        }
        
        if (data && data.campaign_meta_details.length > 0) {
          setCampaignMeta(data.campaign_meta_details[0]);
        }
      } catch (error) {
        console.error('Error fetching campaign stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (campaignId) {
      fetchCampaignStats();
    }
  }, [campaignId]);

  // Stat card component to reduce repetition
  const StatCard = ({ title, value, unit = "" }) => (
    <div className="bg-gradient-to-br from-[#1A1F4A] to-[#232A5C] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
      <h2 className="text-lg font-semibold text-gray-300">{title}</h2>
      <p className="text-3xl font-bold mt-3 text-white flex items-baseline">
        {value}
        {unit && <span className="text-sm ml-1 text-gray-300">{unit}</span>}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col w-screen h-screen bg-gradient-to-b from-[#0F142E] to-[#161D3F]">
      {/* Top Navigation */}
      <div className="h-20 flex-none border-b border-gray-800">
        <NavigationMenu />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 md:p-10 text-white overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Campaign Dashboard
          </h1>

          {/* Campaign Info Card */}
          <div className="bg-[#1A1F4A]/70 rounded-xl shadow-lg p-6 mb-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">Campaign Information</h2>
                <p className="text-gray-300 mb-3">
                  <span className="font-medium text-gray-400">Campaign Name:</span>{" "}
                  <span className="font-semibold text-white">{campaignMeta?.campaign_name || 'Loading...'}</span>
                </p>
                <p className="text-gray-300 mb-3">
                  <span className="font-medium text-gray-400">Description:</span>{" "}
                  <span className="text-white">{campaignMeta?.campaign_description || 'Loading...'}</span>
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white md:text-right">Timeline</h2>
                <p className="text-gray-300 mb-3 md:text-right">
                  <span className="font-medium text-gray-400">Start Date:</span>{" "}
                  <span className="text-white">{formatDate(campaignMeta?.campaign_start_date)}</span>
                </p>
                <p className="text-gray-300 md:text-right">
                  <span className="font-medium text-gray-400">End Date:</span>{" "}
                  <span className="text-white">{formatDate(campaignMeta?.campaign_end_date)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-pulse text-gray-400">Loading campaign metrics...</div>
            </div>
          ) : campaignStats ? (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-white">Key Performance Metrics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                  title="Click Rate" 
                  value={campaignStats.user_click_rate} 
                  unit="%" 
                />
                <StatCard 
                  title="Open Rate" 
                  value={campaignStats.user_open_rate} 
                  unit="%" 
                />
                <StatCard 
                  title="Engagement Delay" 
                  value={campaignStats.user_engagement_delay} 
                  unit="sec" 
                />
              </div>
            </div>
          ) : (
            <div className="bg-[#1A1F4A]/50 p-6 rounded-lg text-center">
              <p className="text-gray-400">No campaign data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CampaignDashboardPage;