import { useQuery } from '@tanstack/react-query';
import { getApiUrl } from '../lib/worker-api';

interface CampaignWithJupiterData {
  id: string;
  name: string | null;
  userId: string | null;
  bannerUrl: string | null;
  imageUrl: string | null;
  tokenName: string | null;
  tokenTicker: string | null;
  tokenImageUrl: string | null;
  campaignGoal: number | null;
  categoryId: string | null;
  categoryName: string | null;
  charityWalletAddress: string | null;
  raisedValue: number | null;
  shortDescription: string | null;
  longDescription: string | null;
  websiteUrl: string | null;
  xHandle: string | null;
  telegramHandle: string | null;
  status: string | null;
  tokenMint: string | null;
  transactionSignature: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  jupiterData?: {
    volume24h: number;
    trades: number;
    priceChange24h?: number;
    liquidity?: number;
    mcap?: number;
  };
}

async function fetchCampaignsWithJupiter(): Promise<CampaignWithJupiterData[]> {
  const workerUrl = getApiUrl() || 'http://localhost:8787';

  const response = await fetch(`${workerUrl}/api/campaigns/with-jupiter`);

  if (!response.ok) {
    throw new Error('Failed to fetch campaigns with Jupiter data');
  }

  return response.json() as Promise<CampaignWithJupiterData[]>;
}

export function useCampaignsWithJupiter() {
  return useQuery({
    queryKey: ['campaigns', 'with-jupiter'],
    queryFn: fetchCampaignsWithJupiter,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}
