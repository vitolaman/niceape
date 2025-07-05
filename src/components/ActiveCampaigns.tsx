import React from 'react';
import CampaignCard from './CampaignCard';

const sampleCampaigns = [
  {
    id: 1,
    name: 'Clean Water Drive',
    symbol: 'WTR',
    description: 'Providing clean water access to communities in need across rural Africa',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=200&fit=crop',
    goal: 5000,
    raised: 2500,
    trades: 1247,
    price: 0.052,
    volume24h: 15000,
    category: 'Water',
  },
  {
    id: 2,
    name: 'Feed the Hungry',
    symbol: 'FD',
    description:
      'Fighting hunger by providing meals to families and children in underserved communities',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop',
    goal: 10000,
    raised: 4200,
    trades: 892,
    price: 0.122,
    volume24h: 22000,
    category: 'Food',
  },
  {
    id: 3,
    name: 'Education for All',
    symbol: 'EDU',
    description: 'Supporting education initiatives and school supplies for children worldwide',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop',
    goal: 7500,
    raised: 1800,
    trades: 456,
    price: 0.032,
    volume24h: 8500,
    category: 'Education',
  },
  {
    id: 4,
    name: 'Plant Trees Initiative',
    symbol: 'TRI',
    description: 'Reforestation efforts to combat climate change and restore natural habitats',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop',
    goal: 3000,
    raised: 2400,
    trades: 1634,
    price: 0.082,
    volume24h: 12000,
    category: 'Environment',
  },
];

const ActiveCampaigns = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
          {sampleCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>

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
