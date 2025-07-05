import Page from '@/components/ui/Page/Page';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const funFacts = [
  'Even the smartest apes sometimes take wrong turns! 🦍💭',
  'Did you know? Apes share 98.8% of their DNA with humans! 🧬',
  "Fun fact: A group of apes is called a 'shrewdness'! 🤓",
  'Apes can learn sign language and use tools! 🔧',
  'Some apes have been observed making and using medicine! 💊',
  'Apes have excellent memories and can recognize faces for years! 🧠',
  'Fun fact: Apes show empathy and comfort each other! 💝',
  'Apes can solve complex puzzles and play games! 🧩',
  'Some apes have learned to paint and create art! 🎨',
  'Apes demonstrate self-awareness when looking in mirrors! 🪞',
];

export default function Custom404() {
  const [randomFact, setRandomFact] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Set a random fun fact when the component mounts
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    setRandomFact(funFacts[randomIndex]);

    // Set the current path on client-side only
    setCurrentPath(router.asPath);
  }, [router.asPath]);

  return (
    <>
      <Head>
        <title>Page Not Found - NiceApe</title>
      </Head>
      <Page>
        <div className="py-16 px-4 text-center">
          <div className="max-w-lg mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img
                src="/logo.jpg"
                alt="NiceApe Logo"
                className="w-24 h-24 rounded-full object-cover shadow-lg"
              />
            </div>

            {/* Banana emoji */}
            <div className="text-6xl mb-6">🍌</div>

            {/* 404 Title */}
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">404</h1>

            {/* Subtitle */}
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Oops! This ape got lost</h2>

            {/* Description */}
            <p className="text-gray-600 mb-4">
              The page you're looking for doesn't exist. Maybe it swung away to another branch?
            </p>

            {/* Current route display */}
            <div className="bg-gray-100 rounded-lg p-3 mb-8 text-sm text-gray-600 font-mono">
              Route: {currentPath || '/unknown'}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                  🏠 Back to Home
                </Button>
              </Link>
              <Link href="/about">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                  ℹ️ Learn About Us
                </Button>
              </Link>
            </div>

            {/* Random fun fact */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
              <p className="text-sm font-medium">{randomFact || 'Loading fun fact...'}</p>
            </div>

            {/* Refresh for new fact hint */}
            <p className="text-xs text-gray-500 mt-3">💡 Refresh the page for a new fun fact!</p>
          </div>
        </div>
      </Page>
    </>
  );
}
