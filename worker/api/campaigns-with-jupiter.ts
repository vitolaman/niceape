import { createDb } from '../db';
import { campaigns, masterCategories } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { Env } from '../types';
import { mapCampaignToResponse } from '../lib/field-mapping';
import {
  createTimestamps,
  updateTimestamps,
  deleteTimestamps,
  excludeDeleted,
  activeWithCondition,
} from '../lib/timestamps';

// Campaign Status Constants (duplicated to avoid import issues in worker)
const CampaignStatus = {
  DRAFTED: 'DRAFTED',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

// Jupiter API types (based on actual API response)
interface JupiterBaseAsset {
  id: string;
  name: string;
  symbol: string;
  icon?: string;
  decimals: number;
  twitter?: string;
  telegram?: string;
  website?: string;
  dev?: string;
  circSupply?: number;
  totalSupply?: number;
  tokenProgram: string;
  launchpad?: string;
  metaLaunchpad?: string;
  partnerConfig?: string;
  firstPool?: {
    id: string;
    createdAt: string;
  };
  holderCount?: number;
  audit?: {
    mintAuthorityDisabled?: boolean;
    freezeAuthorityDisabled?: boolean;
    topHoldersPercentage?: number;
    devBalancePercentage?: number;
    devMigrations?: number;
    highSingleOwnership?: boolean;
  };
  organicScore?: number;
  organicScoreLabel?: 'high' | 'medium' | 'low';
  tags?: string[];
  graduatedPool?: string;
  graduatedAt?: string;
  fdv?: number;
  mcap?: number;
  usdPrice?: number;
  priceBlockId?: number;
  liquidity?: number;
  stats5m?: JupiterStats;
  stats1h?: JupiterStats;
  stats6h?: JupiterStats;
  stats24h?: JupiterStats;
}

interface JupiterStats {
  priceChange?: number;
  holderChange?: number;
  liquidityChange?: number;
  volumeChange?: number;
  buyVolume?: number;
  sellVolume?: number;
  buyOrganicVolume?: number;
  sellOrganicVolume?: number;
  numBuys?: number;
  numSells?: number;
  numTraders?: number;
  numOrganicBuyers?: number;
  numNetBuyers?: number;
}

interface JupiterPool {
  id: string;
  chain: string;
  dex: string;
  type: string;
  quoteAsset?: string;
  createdAt: string;
  liquidity?: number;
  volume24h?: number;
  updatedAt: string;
  baseAsset: JupiterBaseAsset;
}

interface JupiterGemsResponse {
  recent?: {
    pools: JupiterPool[];
    total: number;
  };
  aboutToGraduate?: {
    pools: JupiterPool[];
    total: number;
  };
  graduated?: {
    pools: JupiterPool[];
    total: number;
  };
}

// Request interface to match the ExploreProvider pattern
interface JupiterGemsRequestItem {
  timeframe: string;
  partnerConfigs?: string[];
}

interface JupiterGemsRequest {
  recent?: JupiterGemsRequestItem;
  aboutToGraduate?: JupiterGemsRequestItem;
  graduated?: JupiterGemsRequestItem;
}

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
  // Jupiter data
  jupiterData?: {
    volume24h: number;
    trades: number;
    priceChange24h?: number;
    liquidity?: number;
    mcap?: number;
  };
}

export class CampaignJupiterService {
  private db;
  private env: Env;

  constructor(env: Env) {
    this.db = createDb(env.DB);
    this.env = env;
  }

  private async fetchJupiterGemsData(): Promise<JupiterGemsResponse> {
    try {
      // Use the same approach as ExploreProvider and ApeQueries.gemsTokenList
      // Get pool config key from environment (same as getPoolConfigKeys() in frontend)
      const poolConfigKey =
        this.env.NEXT_PUBLIC_MAINNET_POOL_CONFIG_KEY || this.env.NEXT_PUBLIC_DEVNET_POOL_CONFIG_KEY;
      const partnerConfigs = poolConfigKey ? [poolConfigKey] : undefined;

      // Match the request structure from ApeQueries.gemsTokenList
      const requestBody: JupiterGemsRequest = {
        recent: {
          timeframe: '24h',
          partnerConfigs,
        },
        aboutToGraduate: {
          timeframe: '24h',
          partnerConfigs,
        },
        graduated: {
          timeframe: '24h',
          partnerConfigs,
        },
      };

      const response = await fetch('https://datapi.jup.ag/v1/pools/gems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Jupiter API error: ${response.status}`);
      }

      const data = await response.json();
      const typedData = data as JupiterGemsResponse;

      return typedData;
    } catch (error) {
      console.error('Failed to fetch Jupiter data:', error);
      return {};
    }
  }

  private findJupiterDataForToken(
    jupiterData: JupiterGemsResponse,
    tokenMint: string
  ): JupiterPool | null {
    // Search through all categories for the token
    const allPools = [
      ...(jupiterData.recent?.pools || []),
      ...(jupiterData.aboutToGraduate?.pools || []),
      ...(jupiterData.graduated?.pools || []),
    ];

    const foundPool = allPools.find((pool) => pool.baseAsset.id === tokenMint);

    return foundPool || null;
  }

  async getCampaignsWithJupiterData(): Promise<CampaignWithJupiterData[]> {
    // Fetch campaigns that have SUCCESS status and are not deleted, with category names
    const campaignResults = await this.db
      .select({
        campaign: campaigns,
        categoryName: masterCategories.name,
      })
      .from(campaigns)
      .leftJoin(masterCategories, eq(campaigns.categoryId, masterCategories.id))
      .where(and(excludeDeleted(campaigns.deletedAt), eq(campaigns.status, CampaignStatus.SUCCESS)))
      .orderBy(desc(campaigns.createdAt));

    // Fetch Jupiter data
    const jupiterData = await this.fetchJupiterGemsData();

    // Map campaigns with Jupiter data - only include campaigns that have Jupiter data
    const campaignsWithJupiter: CampaignWithJupiterData[] = campaignResults
      .map((result) => {
        const campaign = result.campaign;
        const mappedCampaign = mapCampaignToResponse(campaign);

        if (campaign.tokenMint) {
          const jupiterPool = this.findJupiterDataForToken(jupiterData, campaign.tokenMint);

          if (jupiterPool) {
            return {
              ...mappedCampaign,
              categoryName: result.categoryName,
              jupiterData: {
                volume24h: jupiterPool.volume24h || 0,
                trades:
                  (jupiterPool.baseAsset.stats24h?.numBuys || 0) +
                  (jupiterPool.baseAsset.stats24h?.numSells || 0),
                priceChange24h: jupiterPool.baseAsset.stats24h?.priceChange,
                liquidity: jupiterPool.baseAsset.liquidity || jupiterPool.liquidity,
                mcap: jupiterPool.baseAsset.mcap,
              },
            };
          }
        }

        // Return null for campaigns without Jupiter data
        return null;
      })
      .filter((campaign): campaign is CampaignWithJupiterData => campaign !== null); // Filter out null values

    return campaignsWithJupiter;
  }

  async getCampaignWithJupiterData(campaignId: string): Promise<CampaignWithJupiterData | null> {
    const campaignResult = await this.db
      .select({
        campaign: campaigns,
        categoryName: masterCategories.name,
      })
      .from(campaigns)
      .leftJoin(masterCategories, eq(campaigns.categoryId, masterCategories.id))
      .where(activeWithCondition(campaigns.deletedAt, eq(campaigns.id, campaignId)))
      .limit(1);

    if (!campaignResult[0]) {
      return null;
    }

    const result = campaignResult[0];
    const campaign = result.campaign;
    const mappedCampaign = mapCampaignToResponse(campaign);

    if (campaign.tokenMint) {
      const jupiterData = await this.fetchJupiterGemsData();
      const jupiterPool = this.findJupiterDataForToken(jupiterData, campaign.tokenMint);

      if (jupiterPool) {
        return {
          ...mappedCampaign,
          categoryName: result.categoryName,
          jupiterData: {
            volume24h: jupiterPool.volume24h || 0,
            trades:
              (jupiterPool.baseAsset.stats24h?.numBuys || 0) +
              (jupiterPool.baseAsset.stats24h?.numSells || 0),
            priceChange24h: jupiterPool.baseAsset.stats24h?.priceChange,
            liquidity: jupiterPool.baseAsset.liquidity || jupiterPool.liquidity,
            mcap: jupiterPool.baseAsset.mcap,
          },
        };
      }
    }

    return {
      ...mappedCampaign,
      categoryName: result.categoryName,
      jupiterData: undefined,
    };
  }
}
