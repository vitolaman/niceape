import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦍</span>
              <span className="text-xl font-bold">NiceApe</span>
            </div>
            <p className="text-gray-400 mt-2">Trade to Donate</p>
          </div>

          <div className="flex gap-6">
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
              Help
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2025 NiceApe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
