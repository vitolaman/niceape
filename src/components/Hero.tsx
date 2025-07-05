import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useUnifiedWalletContext, useWallet } from '@jup-ag/wallet-adapter';

const Hero = () => {
  const { setShowModal } = useUnifiedWalletContext();
  const { publicKey } = useWallet();

  const handleConnectWallet = () => {
    setShowModal(true);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"></div>

      {/* Content */}
      <div className="relative px-4 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Main content */}
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-8">
                <img
                  src="/logo.jpg"
                  alt="NiceApe Logo"
                  className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover shadow-2xl ring-4 ring-white"
                />
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 leading-tight">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  NiceApe
                </span>
              </h1>

              {/* Main tagline */}
              <div className="mb-8">
                <span className="inline-block bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-full text-lg md:text-xl font-bold shadow-lg">
                  Trade to Donate
                </span>
              </div>

              <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-green-600 mb-8 leading-tight">
                Trade tokens, fund causes!
              </h2>

              <p className="text-lg md:text-xl text-gray-700 mb-4 max-w-2xl">
                Every trade generates fees that go directly to charity.
                <span className="font-semibold text-green-700"> Make every swap count</span> and
                help change the world.
              </p>

              <p className="text-lg md:text-xl font-medium text-gray-800 mb-10">
                Trade nice, ape big! 🦍💚
              </p>

              {/* Stats Preview */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-600">$15K+</div>
                  <div className="text-sm text-gray-600">Donated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600">4</div>
                  <div className="text-sm text-gray-600">Active Causes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-purple-600">4K+</div>
                  <div className="text-sm text-gray-600">Trades</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {publicKey ? (
                  <Link href="/create-campaign">
                    <Button className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      🚀 Launch Campaign
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={handleConnectWallet}
                    className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    🦍 Connect Wallet to Start
                  </Button>
                )}

                <Link href="#campaigns">
                  <Button className="bg-white hover:bg-gray-50 text-green-600 border-2 border-green-600 text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    🌟 Explore Campaigns
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side - Visual content */}
            <div className="relative">
              {/* Main hero image */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop&auto=format"
                  alt="NiceApe Community Impact"
                  className="rounded-3xl shadow-2xl w-full max-w-lg mx-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>

                {/* Floating cards */}
                <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-4 transform rotate-[-5deg] hidden md:block">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-700">Live Trading</span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 transform rotate-[5deg] hidden md:block">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">+$2.5K</div>
                    <div className="text-xs text-gray-600">Donated Today</div>
                  </div>
                </div>
              </div>

              {/* Background decorations */}
              <div className="absolute top-10 right-10 w-20 h-20 bg-green-200 rounded-full blur-xl opacity-50"></div>
              <div className="absolute bottom-10 left-10 w-16 h-16 bg-blue-200 rounded-full blur-xl opacity-50"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Launch Section */}
      <div className="relative bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Make a Difference?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Launch your own donation campaign and create a unique token for your cause. Start
            raising funds while building a community of supporters.
          </p>

          <div className="bg-gray-50 rounded-3xl p-8 shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Set Your Goal</h4>
                <p className="text-sm text-gray-600">Define your fundraising target and cause</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🪙</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Create Token</h4>
                <p className="text-sm text-gray-600">Launch your unique charity token</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💝</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Receive Donations</h4>
                <p className="text-sm text-gray-600">Trading fees flow directly to your cause</p>
              </div>
            </div>

            {publicKey ? (
              <Link href="/create-campaign">
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-xl px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  ✨ Launch Your Campaign Now
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handleConnectWallet}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-xl px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                🔗 Connect Wallet to Launch
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
