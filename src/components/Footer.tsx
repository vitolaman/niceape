import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 px-4 border-t border-gray-200 border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <img
                src="/logo.jpg"
                alt="NiceApe Logo"
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xl font-bold">NiceApe</span>
            </div>
            <p className="text-white mt-2">Trade to Donate</p>
          </div>

          <div className="flex gap-6">
            <a
              href="https://x.com/niceapeapp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-primary transition-colors"
            >
              X (Twitter)
            </a>
            <Link href="/about" className="text-white hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/help" className="text-white hover:text-primary transition-colors">
              Help
            </Link>
            <Link href="/terms" className="text-white hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 NiceApe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
