import React from 'react';
import Link from 'next/link';
import { formatReadableNumber } from '../lib/format/number';

interface Campaign {
  id: number;
  name: string;
  symbol: string;
  description: string;
  image: string;
  goal: number;
  raised: number;
  trades24h: number;
  volume24h: number;
  category: string;
  tokenMint: string;
  mcap: number;
}

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const progressPercentage = (campaign.raised / campaign.goal) * 100;

  return (
    <Link href={`/campaign/${campaign.tokenMint}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
        {/* Campaign Image */}
        <div className="relative h-48">
          <img src={campaign.image} alt={campaign.name} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-0 w-full flex justify-between px-4">
            <span className="bg-yellow-400 text-gray-800 font-medium px-3 py-0.5 rounded-full text-xs shadow">
              {campaign.category}
            </span>
            <span className="bg-green-600 text-white font-medium px-3 py-0.5 rounded-full text-xs shadow">
              ${campaign.symbol}
            </span>
          </div>
        </div>

        {/* Campaign Content */}
        <div className="p-6">
          <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
            {campaign.name}
          </h4>

          <p className="text-gray-600 dark:text-gray-300 text-xs mb-3 line-clamp-2">
            {campaign.description}
          </p>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Goal: ${formatReadableNumber(campaign.goal, { format: 'compact' })}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-green-600 dark:bg-green-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="mt-1 text-xs text-green-600 dark:text-green-400 font-semibold">
              ${formatReadableNumber(campaign.raised, { format: 'compact' })} raised
            </div>
          </div>

          {/* Campaign Stats */}
          <div className="flex justify-between items-center pt-2 text-xs text-gray-600 dark:text-gray-300 font-normal">
            <span>24h trades: {formatReadableNumber(campaign.trades24h, { integer: true })}</span>
            <span>
              mcap: ${formatReadableNumber(campaign.mcap, { format: 'compact', decimals: 2 })}
            </span>
            <span>
              24h volume: ${formatReadableNumber(campaign.volume24h, { format: 'compact' })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CampaignCard;
