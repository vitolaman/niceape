import React from 'react';
import CampaignCard from './CampaignCard';
import { useCampaignsWithJupiter } from '@/hooks/useCampaignsWithJupiter';

const ActiveCampaigns = () => {
  const { data: campaigns, isLoading, error } = useCampaignsWithJupiter();

  if (isLoading) {
    return (
      <div id="campaigns" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Active Campaigns
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Support causes you care about by trading their tokens
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="campaigns" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Active Campaigns
            </h3>
            <p className="text-lg text-red-600 dark:text-red-400">
              Failed to load campaigns. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Only show campaigns with SUCCESS status (filtering is now done on the backend)
  const activeCampaigns = campaigns || [];

  return (
    <div id="campaigns" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Active Campaigns
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Support causes you care about by trading their tokens
          </p>
        </div>

        {activeCampaigns.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              No active campaigns found. Be the first to create one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
            {activeCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={{
                  id: parseInt(campaign.id),
                  name: campaign.name || 'Untitled Campaign',
                  symbol: campaign.tokenTicker || 'N/A',
                  description: campaign.shortDescription || 'No description available',
                  image:
                    campaign.imageUrl ||
                    campaign.bannerUrl ||
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=200&fit=crop',
                  goal: campaign.campaignGoal || 0,
                  raised: campaign.raisedValue || 0,
                  trades: campaign.jupiterData?.trades || 0,
                  volume24h: campaign.jupiterData?.volume24h || 0,
                  category: campaign.categoryName || 'General',
                  tokenMint: campaign.tokenMint || '',
                }}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
            Trade with NiceApe, make every swap count! 🦍
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActiveCampaigns;
