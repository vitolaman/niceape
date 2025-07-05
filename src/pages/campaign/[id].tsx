import { useRouter } from 'next/router';
import Head from 'next/head';
import Page from '@/components/ui/Page/Page';
import TradingInterface from '@/components/TradingInterface';
import { useState, useEffect } from 'react';

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
  longDescription?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
}

// Mock data - in a real app, this would come from your API/blockchain
const mockCampaigns: Campaign[] = [
  {
    id: 1,
    name: 'Clean Water Drive',
    symbol: 'WTR',
    description: 'Providing clean water access to communities in need across rural Africa',
    longDescription:
      'Our mission is to provide clean, safe drinking water to communities in rural Africa. We work with local partners to drill wells, install water purification systems, and educate communities about water safety and hygiene practices. Every dollar raised goes directly to these life-saving projects.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop',
    goal: 5000,
    raised: 2500,
    trades: 1247,
    price: 0.052,
    volume24h: 15000,
    category: 'Water',
    website: 'https://cleanwaterproject.org',
    twitter: 'https://twitter.com/cleanwaterproj',
    telegram: 'https://t.me/cleanwaterproject',
  },
  {
    id: 2,
    name: 'Feed the Hungry',
    symbol: 'FD',
    description:
      'Fighting hunger by providing meals to families and children in underserved communities',
    longDescription:
      'We partner with local food banks and kitchens to provide nutritious meals to families in need. Our programs focus on both immediate hunger relief and long-term food security through education and community gardens.',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop',
    goal: 10000,
    raised: 4200,
    trades: 892,
    price: 0.122,
    volume24h: 22000,
    category: 'Food',
    website: 'https://feedthehungry.org',
    twitter: 'https://twitter.com/feedhungry',
    telegram: 'https://t.me/feedthehungry',
  },
  {
    id: 3,
    name: 'Education for All',
    symbol: 'EDU',
    description: 'Supporting education initiatives and school supplies for children worldwide',
    longDescription:
      'Education is the key to breaking the cycle of poverty. We provide school supplies, books, and educational resources to children in underserved communities around the world. We also support teacher training and school infrastructure development.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
    goal: 7500,
    raised: 1800,
    trades: 456,
    price: 0.032,
    volume24h: 8500,
    category: 'Education',
    website: 'https://educationforall.org',
    twitter: 'https://twitter.com/edu4all',
    telegram: 'https://t.me/educationforall',
  },
  {
    id: 4,
    name: 'Plant Trees Initiative',
    symbol: 'TRI',
    description: 'Reforestation efforts to combat climate change and restore natural habitats',
    longDescription:
      'Climate change is one of the most pressing challenges of our time. We organize tree planting events, support reforestation projects, and educate communities about environmental conservation. Each tree planted helps combat climate change and restore natural habitats.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
    goal: 3000,
    raised: 2400,
    trades: 1634,
    price: 0.082,
    volume24h: 12000,
    category: 'Environment',
    website: 'https://planttrees.org',
    twitter: 'https://twitter.com/planttrees',
    telegram: 'https://t.me/planttrees',
  },
];

export default function CampaignPage() {
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    if (id) {
      const foundCampaign = mockCampaigns.find((c) => c.id === parseInt(id as string));
      setCampaign(foundCampaign || null);
    }
  }, [id]);

  if (!campaign) {
    return (
      <>
        <Head>
          <title>Campaign Not Found - NiceApe</title>
        </Head>
        <Page>
          <div className="py-16 px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campaign not found</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              The campaign you're looking for doesn't exist.
            </p>
          </div>
        </Page>
      </>
    );
  }

  const progressPercentage = (campaign.raised / campaign.goal) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <Head>
        <title>{campaign.name} - NiceApe</title>
      </Head>
      <Page>
        <div className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Campaign Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 mb-8 transition-colors duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <img
                    src={campaign.image}
                    alt={campaign.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {campaign.category}
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${campaign.symbol}
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {campaign.name}
                  </h1>

                  <p className="text-gray-600 mb-6">{campaign.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Goal: {formatCurrency(campaign.goal)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-green-600 dark:bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(campaign.raised)} raised
                    </div>
                  </div>

                  {/* Campaign Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {campaign.trades}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">trades</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${campaign.price.toFixed(4)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">current price</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(campaign.volume24h)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">24h volume</div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-4">
                    {campaign.website && (
                      <a
                        href={campaign.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        🌐 Website
                      </a>
                    )}
                    {campaign.twitter && (
                      <a
                        href={campaign.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-600 transition-colors"
                      >
                        🐦 Twitter
                      </a>
                    )}
                    {campaign.telegram && (
                      <a
                        href={campaign.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        📱 Telegram
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Campaign Details */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    About This Campaign
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {campaign.longDescription}
                  </p>
                </div>
              </div>

              {/* Trading Interface */}
              <div className="lg:col-span-1">
                <TradingInterface
                  campaignSymbol={campaign.symbol}
                  campaignName={campaign.name}
                  currentPrice={campaign.price}
                />
              </div>
            </div>
          </div>
        </div>
      </Page>
    </>
  );
}
