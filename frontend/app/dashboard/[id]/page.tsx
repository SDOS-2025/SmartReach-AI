"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import NavigationMenu from '../../components/NavigationMenu';

function CampaignDashboardPage() {
  const params = useParams();
  const campaignId = params?.id;
  const [campaignStats, setCampaignStats] = useState(null);
  const [campaignMeta, setCampaignMeta] = useState(null);

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
      }
    };

    if (campaignId) {
      fetchCampaignStats();
    }
  }, [campaignId]);

  return (
    <div className="flex flex-col w-screen h-screen bg-[#0F142E]">
      {/* Top Navigation */}
      <div className="h-20 flex-none">
        <NavigationMenu />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-10 text-white overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Campaign Dashboard</h1>
        <p className="text-gray-300 mb-2">
          Campaign Name: <span className="font-semibold text-white">{campaignMeta?.campaign_name || 'Loading...'}</span>
        </p>
        <p className="text-gray-300 mb-2">
          Campaign Description: <span className="text-white">{campaignMeta?.campaign_description || 'Loading...'}</span>
        </p>
        <p className="text-gray-300 mb-2">
          Start Date: <span className="text-white">{formatDate(campaignMeta?.campaign_start_date)}</span>
        </p>
        <p className="text-gray-300 mb-6">
          End Date: <span className="text-white">{formatDate(campaignMeta?.campaign_end_date)}</span>
        </p>

        {campaignStats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#1A1F4A] p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Click Rate</h2>
              <p className="text-2xl font-bold mt-2">{campaignStats.user_click_rate}%</p>
            </div>
            <div className="bg-[#1A1F4A] p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Open Rate</h2>
              <p className="text-2xl font-bold mt-2">{campaignStats.user_open_rate}%</p>
            </div>
            <div className="bg-[#1A1F4A] p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Engagement Delay</h2>
              <p className="text-2xl font-bold mt-2">{campaignStats.user_engagement_delay} sec</p>
            </div>
            <div className="bg-[#1A1F4A] p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Engagement Rate</h2>
              <p className="text-2xl font-bold mt-2">{campaignStats.user_engagement_rate}%</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Loading campaign details...</p>
        )}
      </div>
    </div>
  );
}

export default CampaignDashboardPage;
