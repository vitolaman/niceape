import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useUnifiedWalletContext, useWallet } from '@jup-ag/wallet-adapter';

const LaunchCampaign = () => {
  const { setShowModal } = useUnifiedWalletContext();
  const { publicKey } = useWallet();

  const handleConnectWallet = () => {
    setShowModal(true);
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Launch Your Donation Campaign</h3>
            <p className="text-lg text-gray-600 mb-6">
              Create a unique token for your cause and start raising funds!
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <img
              src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop&auto=format"
              alt="Launch Campaign"
              className="rounded-lg shadow-md max-w-md w-full"
            />
          </div>

          <div className="text-center">
            {publicKey ? (
              <Link href="/create-campaign">
                <Button className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-xl">
                  Launch Campaign
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handleConnectWallet}
                className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-xl"
              >
                Connect Wallet to Launch
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchCampaign;
