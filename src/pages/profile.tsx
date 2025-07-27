import { useState, useEffect, useMemo } from 'react';
import { useWallet } from '@jup-ag/wallet-adapter';
import Page from '@/components/ui/Page/Page';
import Head from 'next/head';
import { generateCodeChallenge, generateCodeVerifier, shortenAddress } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeProvider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { workerApi } from '@/lib/worker-api';
import CampaignCard from '@/components/CampaignCard';

type Campaign = {
  id: string;
  name: string;
  bannerUrl: string;
  imageUrl: string;
  tokenName: string;
  tokenTicker: string;
  tokenImageUrl: string;
  campaignGoal: number;
  raisedValue: number;
  shortDescription: string;
  longDescription: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  categoryId: string;
  charityWalletAddress: string;
  tokenMint: string;
  transactionSignature: string;
  websiteUrl: string | null;
  xHandle: string | null;
  telegramHandle: string | null;
  userId: string;
};

export default function Profile() {
  const { publicKey, disconnect } = useWallet();
  const [isEditing, setIsEditing] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const [userProfile, setUserProfile] = useState({
    displayName: '',
    xHandle: '',
    bio: '',
    avatar: '🦍',
    id: '',
  });

  const [userStats] = useState({
    totalTrades: 47,
    volumeTraded: 1250,
    charityGenerated: 62.5,
    mealsfunded: 125,
  });

  const address = useMemo(() => publicKey?.toBase58(), [publicKey]);

  useEffect(() => {
    if (address) {
      workerApi
        .userAuth(address)
        .then((data: unknown) => {
          console.log('User authenticated:', data);
          const response = data as {
            success: boolean;
            user: {
              id: string;
              walletAddress: string;
              displayName?: string;
              xHandle?: string;
              bio?: string;
            };
            isNewUser: boolean;
            message: string;
          };

          console.log(response);

          setUserProfile({
            displayName: response.user.displayName || '',
            xHandle: response.user.xHandle || '',
            bio: response.user.bio || '',
            avatar: '🦍',
            id: response.user.id || '',
          });

          if (response.success && response.user.id) {
            localStorage.setItem('userId', response.user.id);
            localStorage.setItem('userWallet', response.user.walletAddress);
            console.log(response.message);
            if (response.isNewUser) {
              console.log('Welcome! New user created.');
            } else {
              console.log('Welcome back!');
            }
          }
        })
        .catch((error) => {
          console.error('Authentication error:', error);
        });
    }
  }, [address]);

  useEffect(() => {
    const userId = localStorage.getItem('userId') || '';

    if (!userId) return;

    workerApi
      .getCampaignsByCreator(userId)
      .then((data) => {
        setCampaigns(data as Campaign[]);
      })
      .catch((error) => {
        console.error('Authentication error:', error);
      });
  }, [address]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) return;

    const verifier = localStorage.getItem('x_code_verifier');
    if (!verifier) {
      toast.error('No verifier found');
      return;
    }

    const fetchTwitterProfile = async () => {
      try {
        const res = await fetch('/api/twitter-callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            verifier,
          }),
        });

        if (!res.ok) throw new Error('Twitter login failed');
        console.log(res);
        const data: any = await res.json();
        console.log('Twitter User:', data.user.data.username);

        // Optional: Set formData.x_handle = data.user.username
        setUserProfile((prev) => ({
          ...prev,
          x_handle: `@${data.user.data.username}`,
        }));

        const userId = localStorage.getItem('userId') || '';

        const result = await workerApi.updateUser('969b616a-90c6-4a28-878f-3979602ae167', {
          xHandle: `@${data.user.data.username}`,
        });

        toast.success(`Connected to @${data.user.data.username}`);
      } catch (error: any) {
        toast.error(error.message || 'Failed to connect Twitter');
      }
    };

    fetchTwitterProfile();
  }, []);

  // const [achievements] = useState([
  //   { id: 1, name: 'NiceApe Hero', description: 'Traded over $1000', icon: '🦍', earned: true },
  //   { id: 2, name: 'First Trade', description: 'Completed first trade', icon: '🎯', earned: true },
  //   {
  //     id: 3,
  //     name: 'Generous Ape',
  //     description: 'Generated $50+ in charity fees',
  //     icon: '💚',
  //     earned: true,
  //   },
  //   {
  //     id: 4,
  //     name: 'Community Leader',
  //     description: 'Launched a campaign',
  //     icon: '⭐',
  //     earned: false,
  //   },
  // ]);

  // const [recentActivity] = useState([
  //   { action: 'Bought WATER', amount: '$50', donated: '+$0.25 donated', time: '2 hours ago' },
  //   { action: 'Sold FOOD', amount: '$75', donated: '+$0.38 donated', time: '1 day ago' },
  //   { action: 'Bought TREE', amount: '$100', donated: '+$0.50 donated', time: '3 days ago' },
  // ]);

  const handleSaveProfile = () => {
    setIsEditing(false);
    // In real app, save to backend
  };

  const handleDisconnectWallet = async () => {
    await disconnect();
    // Redirect to home or login page
    window.location.href = '/';
  };

  return (
    <>
      <Head>
        <title>Profile - NiceApe</title>
      </Head>
      <Page>
        <div className={`max-w-4xl mx-auto p-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                className={`p-2 rounded-lg ${isDarkMode ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600 hover:bg-gray-100'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold">Profile</h1>
            </div>
            <button
              onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isEditing
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : isDarkMode
                    ? 'text-blue-400 hover:bg-gray-800'
                    : 'text-blue-600 hover:bg-gray-100'
              }`}
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
          {/* Profile Section */}
          <div
            className={`rounded-xl p-6 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{userProfile.avatar}</div>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={userProfile.displayName}
                      onChange={(e) =>
                        setUserProfile({ ...userProfile, displayName: e.target.value })
                      }
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      X Handle
                    </label>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-1 rounded-lg text-lg"
                      type="button"
                      onClick={async () => {
                        const codeVerifier = generateCodeVerifier(); // Use PKCE
                        localStorage.setItem('x_code_verifier', codeVerifier); // Store for later
                        const codeChallenge = await generateCodeChallenge(codeVerifier);

                        const oauthUrl = new URL('https://twitter.com/i/oauth2/authorize');
                        oauthUrl.searchParams.set('response_type', 'code');
                        oauthUrl.searchParams.set(
                          'client_id',
                          'NEVOM3hRNmRiaU5Cb3BnRm9aWG86MTpjaQ'
                        );
                        oauthUrl.searchParams.set(
                          'redirect_uri',
                          'http://localhost:3000/twitter-handler'
                        );
                        oauthUrl.searchParams.set('scope', 'tweet.read users.read offline.access');
                        oauthUrl.searchParams.set('state', 'edit-profile');
                        oauthUrl.searchParams.set('code_challenge', codeChallenge);
                        oauthUrl.searchParams.set('code_challenge_method', 'S256');

                        window.location.href = oauthUrl.toString();
                      }}
                    >
                      Connect to X
                    </Button>
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      Bio
                    </label>
                    <textarea
                      value={userProfile.bio}
                      onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                      rows={3}
                      className={`w-full px-3 py-2 rounded-lg border resize-none ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold mb-2">{userProfile.displayName}</h2>
                  <p className={`text-blue-500 mb-3`}>{userProfile.xHandle}</p>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {userProfile.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* Connected Wallet */}
          {address && (
            <div
              className={`rounded-xl p-6 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <h3 className="text-xl font-bold">Connected Wallet</h3>
              </div>

              <div
                className={`flex items-center justify-between p-3 rounded-lg mb-4 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <span className="font-mono">{shortenAddress(address)}</span>
                <div className="flex gap-2">
                  <button
                    className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <button
                    className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Campaign List */}

          <div
            className={`rounded-xl p-6 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
          >
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-bold">Campaign</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={{
                    id: campaign.id,
                    name: campaign.name || 'Untitled Campaign',
                    symbol: campaign.tokenTicker || 'N/A',
                    description: campaign.shortDescription || 'No description available',
                    image:
                      campaign.imageUrl ||
                      campaign.bannerUrl ||
                      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=200&fit=crop',
                    goal: campaign.campaignGoal || 0,
                    raised: campaign.raisedValue || 0,
                    trades24h: 0,
                    volume24h: 0,
                    category: 'General',
                    tokenMint: campaign.tokenMint || '',
                    mcap: 0,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Achievements */}
          {/* <div
            className={`rounded-xl p-6 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500">⭐</span>
              <h3 className="text-xl font-bold">Achievements</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    achievement.earned
                      ? isDarkMode
                        ? 'border-green-600 bg-green-900/20'
                        : 'border-green-200 bg-green-50'
                      : isDarkMode
                        ? 'border-gray-600 bg-gray-700/50'
                        : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <h4 className="font-bold mb-1">{achievement.name}</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                      {achievement.description}
                    </p>
                    {achievement.earned && (
                      <span className="inline-block px-3 py-1 bg-green-600 text-white text-xs rounded-full font-medium">
                        Earned
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div> */}
          {/* Recent Activity */}
          {/* <div
            className={`rounded-xl p-6 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-500">📈</span>
              <h3 className="text-xl font-bold">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="font-medium">{activity.action}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {activity.time}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{activity.amount}</div>
                    <div className="text-sm text-green-500">{activity.donated}</div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
          {/* Settings */}
          <div
            className={`rounded-xl p-6 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-500">⚙️</span>
              <h3 className="text-xl font-bold">Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Dark Mode</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Switch to dark theme
                  </p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDarkMode ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleDisconnectWallet}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        </div>
      </Page>
    </>
  );
}
