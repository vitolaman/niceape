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
    <div className="relative w-full overflow-hidden">
      {/* Enhanced Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br from-green-500 to-purple-400 dark:from-green-700"></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
      </div>

      {/* Main Hero Content */}
      <div className="relative max-w-5xl mx-auto px-4 py-16 sm:py-20 text-center z-10">
        {/* Responsive Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
          Trade Tokens, <br />
          <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            Fund World-Changing Causes.
          </span>
        </h1>
        {/* Responsive Paragraph */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Welcome to <span className="font-bold text-green-600">NiceApe</span>, the platform where
          every swap counts. A portion of every trade fee is automatically donated to charity.
        </p>
        <p className="mt-2 text-base sm:text-lg md:text-xl font-medium text-gray-800 dark:text-gray-200">
          Trade nice, ape big! 🦍💚
        </p>

        {/* How It Works Section - Integrated */}
        <div className="mt-12">
          {/* Responsive Card */}
          <div className="relative backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 p-6 md:p-8 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-8">
              Launch a Campaign in 3 Easy Steps
            </h3>
            {/* Step Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-10">
              {/* Step 1: Set Your Goal */}
              <div className="text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                  <span className="text-2xl" aria-label="target">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        fill="#34D399"
                        stroke="#059669"
                        strokeWidth="2"
                      />
                      <circle cx="16" cy="16" r="8" fill="#A7F3D0" />
                      <circle cx="16" cy="16" r="3" fill="#059669" />
                    </svg>
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Set Your Goal</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Define your fundraising target and cause
                </p>
              </div>

              {/* Step 2: Create Token */}
              <div className="text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                  <span className="text-2xl" aria-label="coin">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        fill="#E5E7EB"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                      />
                      <circle cx="16" cy="16" r="10" fill="#F3F4F6" />
                      <text
                        x="16"
                        y="21"
                        textAnchor="middle"
                        fontSize="14"
                        fill="#6B7280"
                        fontWeight="bold"
                      >
                        ¢
                      </text>
                    </svg>
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Create Token</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Launch your unique charity token
                </p>
              </div>

              {/* Step 3: Receive Donations */}
              <div className="text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                  <span className="text-2xl" aria-label="heart">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 27.5C16 27.5 5 19.5 5 12.5C5 8.5 8.5 6 12 6C14 6 16 8 16 8C16 8 18 6 20 6C23.5 6 27 8.5 27 12.5C27 19.5 16 27.5 16 27.5Z"
                        fill="#F472B6"
                      />
                    </svg>
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Receive Donations
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Trading fees flow directly to your cause
                </p>
              </div>
            </div>

            {/* Final Button with 48px height */}
            {publicKey ? (
              <Link href="/create-campaign">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-base font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  ✨ Launch Your Campaign Now
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handleConnectWallet}
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-base font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
