import { useUnifiedWalletContext, useWallet } from '@jup-ag/wallet-adapter';
import Link from 'next/link';
import { Button } from './ui/button';
import { CreatePoolButton } from './CreatePoolButton';
import { useMemo } from 'react';
import { shortenAddress } from '@/lib/utils';

import { useUnifiedWalletContext, useWallet } from '@jup-ag/wallet-adapter';
import Link from 'next/link';
import { Button } from './ui/button';
import { useMemo, useState } from 'react';
import { shortenAddress } from '@/lib/utils';

export const Header = () => {
  const { setShowModal } = useUnifiedWalletContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { disconnect, publicKey } = useWallet();
  const address = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const handleConnectWallet = () => {
    // In a real implementation, this would connect to a Solana wallet
    setShowModal(true);
  };

  return (
    <header className="w-full px-4 py-4 bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🦍</span>
          <span className="whitespace-nowrap text-xl font-bold text-gray-900">NiceApe</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
          <Link href="/help" className="text-gray-600 hover:text-gray-900 transition-colors">Help</Link>
          <Link href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">Terms</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Wallet Connection */}
        <div className="hidden md:flex items-center gap-4">
          {address ? (
            <Button 
              onClick={() => disconnect()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {shortenAddress(address)}
            </Button>
          ) : (
            <Button
              onClick={() => {
                handleConnectWallet();
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t">
          <nav className="flex flex-col gap-4 pt-4">
            <Link 
              href="/about" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/help" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Help
            </Link>
            <Link 
              href="/terms" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Terms
            </Link>
            <div className="pt-2 border-t">
              {address ? (
                <Button 
                  onClick={() => {
                    disconnect();
                    setIsMenuOpen(false);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                >
                  {shortenAddress(address)}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    handleConnectWallet();
                    setIsMenuOpen(false);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
