import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';

interface Campaign {
  id: number;
  name: string;
  symbol: string;
  description: string;
  image: string;
  goal: number;
  raised: number;
  trades: number;
  price: number;
  volume24h: number;
  category: string;
}

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const progressPercentage = (campaign.raised / campaign.goal) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Campaign Image */}
      <div className="relative h-48">
        <img src={campaign.image} alt={campaign.name} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
            {campaign.category} ${campaign.symbol}
          </span>
        </div>
      </div>

      {/* Campaign Content */}
      <div className="p-6">
        <h4 className="text-xl font-bold text-gray-900 mb-2">{campaign.name}</h4>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Goal: {formatCurrency(campaign.goal)}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600">{formatCurrency(campaign.raised)} raised</div>
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">{campaign.trades}</div>
            <div className="text-xs text-gray-500">trades</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{formatPrice(campaign.price)}</div>
            <div className="text-xs text-gray-500">price</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(campaign.volume24h)}
            </div>
            <div className="text-xs text-gray-500">24h volume</div>
          </div>
        </div>

        {/* Trade Button */}
        <Link href={`/campaign/${campaign.id}`}>
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg">
            Trade ${campaign.symbol}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
