import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { useWallet } from '@jup-ag/wallet-adapter';
import FileDropzone from './ui/FileDropzone';
import MarkdownEditor from './ui/MarkdownEditor';
import {
  createCampaign,
  validateCampaignData,
  type CampaignFormData,
  type CampaignFiles,
} from '@/actions/createCampaign';
import { fetchCategories, type Category } from '@/lib/services';
import { toast } from 'sonner';
import { generateCodeChallenge, generateCodeVerifier } from '@/lib/utils';

const CreateCampaignForm = () => {
  const { publicKey, signTransaction } = useWallet();

  // Get the current wallet address
  const walletAddress = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    token_name: '',
    token_ticker: '',
    token_image_url: '',
    short_description: '',
    long_description: '',
    campaign_goal: '',
    category_id: '',
    banner_url: '',
    image_url: '',
    charity_wallet_address: '',
    website_url: '',
    x_handle: '',
    telegram_handle: '',
  });

  // File states for uploads
  const [files, setFiles] = useState<CampaignFiles>({
    tokenImage: null,
    campaignImage: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isXConnected, setIsXConnected] = useState(false);
  const [campaignCreated, setCampaignCreated] = useState(false);
  const [campaignResult, setCampaignResult] = useState<{
    tokenMint?: string;
    transactionSignature?: string;
    formDataWithUrls?: any;
  } | null>(null);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const categories = await fetchCategories();
        setCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories.');
        setCategories([]); // Leave categories empty if API fails
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

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
        setFormData((prev) => ({
          ...prev,
          x_handle: `@${data.user.data.username}`,
        }));

        setIsXConnected(true);
        toast.success(`Connected to @${data.user.data.username}`);
      } catch (error: any) {
        toast.error(error.message || 'Failed to connect Twitter');
      }
    };

    fetchTwitterProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!signTransaction) {
      toast.error('Wallet does not support transaction signing');
      return;
    }

    // Validate form data
    const validationErrors = validateCampaignData(formData, files, walletAddress);
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    setIsLoading(true);

    try {
      const result = await createCampaign({
        formData,
        files,
        userWallet: publicKey.toBase58(),
        charityWallet: walletAddress!, // Use wallet address directly, not from form
        signTransaction,
      });

      if (result.success) {
        toast.success('Campaign created successfully!');
        setCampaignResult(result);
        setCampaignCreated(true);

        console.log('Campaign created:', result);
        // You can send result.formDataWithUrls to your separate database project here
      } else {
        throw new Error(result.error || 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create campaign');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {campaignCreated && !isLoading ? (
        <CampaignCreationSuccess result={campaignResult} />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Campaign Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                Campaign Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                    placeholder="e.g., Clean Water Drive"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                    disabled={categoriesLoading || categories.length === 0}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {categoriesLoading
                        ? 'Loading categories...'
                        : categories.length === 0
                          ? 'No categories available'
                          : 'Select a category'}
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Short Description *
                </label>
                <input
                  type="text"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                  placeholder="Brief summary or tagline for your campaign"
                />
              </div>

              <div>
                <MarkdownEditor
                  value={formData.long_description}
                  onChange={(value) => setFormData({ ...formData, long_description: value })}
                  required
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fundraising Goal (USD) *
                </label>
                <input
                  type="number"
                  name="campaign_goal"
                  value={formData.campaign_goal}
                  onChange={handleChange}
                  required
                  min="100"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                  placeholder="e.g., 5000"
                />
              </div>
            </div>

            {/* Token Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                Token Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Token Name *
                  </label>
                  <input
                    type="text"
                    name="token_name"
                    value={formData.token_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                    placeholder="e.g., Water Token"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Token Symbol *
                  </label>
                  <input
                    type="text"
                    name="token_ticker"
                    value={formData.token_ticker}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                    placeholder="e.g., WTR"
                  />
                </div>
              </div>

              <div>
                <FileDropzone
                  label="Token Image"
                  description="Upload a logo for your token (recommended: 512x512px)"
                  onFileSelect={(file) => setFiles({ ...files, tokenImage: file })}
                  currentImageUrl={formData.token_image_url}
                  maxSize={2 * 1024 * 1024} // 2MB
                  maxWidth={1024}
                  maxHeight={1024}
                  required
                />
              </div>
            </div>

            {/* Media and Wallet Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                Media & Financial Information
              </h3>

              <div>
                <FileDropzone
                  label="Campaign Image"
                  description="Upload a main image for your campaign (recommended: 800x600px)"
                  onFileSelect={(file) => setFiles({ ...files, campaignImage: file })}
                  currentImageUrl={formData.image_url}
                  maxSize={2 * 1024 * 1024} // 2MB
                  maxWidth={1920}
                  maxHeight={1080}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Charity Wallet Address *
                </label>
                <input
                  type="text"
                  name="charity_wallet_address"
                  value={walletAddress || ''}
                  readOnly
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed transition-colors duration-300"
                  placeholder="Connect wallet to auto-fill"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This will automatically use your connected wallet address
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                Social Links (Optional)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                    placeholder="https://your-website.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    X (Twitter) Handle
                  </label>

                  {!isXConnected ? (
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
                        oauthUrl.searchParams.set('state', 'create-campaign');
                        oauthUrl.searchParams.set('code_challenge', codeChallenge);
                        oauthUrl.searchParams.set('code_challenge_method', 'S256');

                        window.location.href = oauthUrl.toString();
                      }}
                    >
                      Connect to X
                    </Button>
                  ) : (
                    <input
                      disabled
                      type="text"
                      name="x_handle"
                      value={formData.x_handle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                      placeholder="@yourusername"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telegram Handle
                </label>
                <input
                  type="text"
                  name="telegram_handle"
                  value={formData.telegram_handle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                  placeholder="@yourtelegram"
                />
              </div>
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg text-lg"
                disabled={!publicKey || isLoading || categoriesLoading || categories.length === 0}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Creating Campaign...
                  </>
                ) : categoriesLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Loading...
                  </>
                ) : categories.length === 0 ? (
                  'Categories unavailable'
                ) : publicKey ? (
                  'Create Campaign'
                ) : (
                  'Connect Wallet to Create'
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

const CampaignCreationSuccess = ({ result }: { result: any }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300 text-center">
      <div className="bg-green-500/20 p-4 rounded-full inline-flex mb-6">
        <span className="text-4xl">✅</span>
      </div>
      <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Campaign Created Successfully!
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
        Your donation campaign has been created and is now live! Your token has been minted on the
        blockchain and your campaign is ready to receive donations.
      </p>

      {result && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Campaign Details:</h3>
          <div className="space-y-2 text-sm">
            {result.tokenMint && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Token Mint: </span>
                <a
                  href={`https://solscan.io/token/${result.tokenMint}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-green-600 dark:text-green-400 break-all"
                >
                  {result.tokenMint}
                </a>
              </div>
            )}
            {result.transactionSignature && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Transaction: </span>
                <a
                  href={`https://solscan.io/tx/${result.transactionSignature}`}
                  className="font-mono text-blue-600 dark:text-blue-400 break-all"
                >
                  {result.transactionSignature}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => (window.location.href = `/campaign/${result.id}`)}
          className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          View Campaigns
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          Create Another Campaign
        </button>
      </div>
    </div>
  );
};

export default CreateCampaignForm;
