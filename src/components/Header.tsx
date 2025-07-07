import { useUnifiedWalletContext, useWallet } from '@jup-ag/wallet-adapter';
import Link from 'next/link';
import { Button } from './ui/button';
import { useMemo, useState, useRef, useEffect } from 'react';
import { shortenAddress } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeProvider';

export const Header = () => {
  const { setShowModal } = useUnifiedWalletContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

  const { disconnect, publicKey } = useWallet();
  const address = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const handleConnectWallet = () => {
    setShowModal(true);
  };

  useEffect(() => {
    if (address) {
      fetch("https://d1-nice-api.vito99varianlaman.workers.dev/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wallet_address: address }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to send wallet address");
          }
          return response.json();
        })
        .then((data) => {
          console.log("API response:", data);
          if (data.id) {
            localStorage.setItem("userId", data.id);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

  }, [address]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full px-4 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.jpg" alt="NiceApe Logo" className="w-10 h-10 rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              NiceApe
            </span>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium uppercase tracking-wide">
              Trade to Donate
            </span>
          </div>
        </Link>

        {/* Wallet Connection */}
        {address ? (
          <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            {' '}
            {/* Online Indicator */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-400 dark:text-green-300 font-medium">
                {shortenAddress(address)}
              </span>
            </div>
            {/* Profile Icon Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-2 z-50">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/about"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/help"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Help
                </Link>
                <Link
                  href="/terms"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Terms
                </Link>
                <div className="border-t dark:border-gray-700 my-1"></div>
                <button
                  onClick={() => {
                    disconnect();
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Disconnect Wallet
                </button>
              </div>
            )}
          </div>
        ) : (
          <Button
            onClick={handleConnectWallet}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-lg"
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
