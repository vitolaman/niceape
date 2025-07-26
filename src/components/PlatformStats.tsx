import React from 'react';

const PlatformStats = () => {
  // Mock data - in a real app, this would come from your API/blockchain
  const stats = {
    totalDonated: 15000,
    totalCampaigns: 4,
    totalTrades: 4229,
    totalVolume: 57500,
    activeCampaigns: 4,
    completedCampaigns: 0,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="py-16 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Platform Impact</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            See the difference we&apos;re making together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 text-center transition-colors duration-300">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              {formatCurrency(stats.totalDonated)}
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Total Donated
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Directly to charities</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 text-center transition-colors duration-300">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {stats.totalCampaigns}
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Active Campaigns
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Causes you can support</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 text-center transition-colors duration-300">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {stats.totalTrades.toLocaleString()}
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Total Trades
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Transactions for good</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 text-center transition-colors duration-300">
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {formatCurrency(stats.totalVolume)}
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Total Volume
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Traded on platform</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 text-center transition-colors duration-300">
            <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
              {stats.activeCampaigns}
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Active Now
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Campaigns fundraising</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 text-center transition-colors duration-300">
            <div className="text-4xl font-bold text-gray-600 dark:text-gray-400 mb-2">24/7</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Always Open
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Trade anytime</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformStats;
