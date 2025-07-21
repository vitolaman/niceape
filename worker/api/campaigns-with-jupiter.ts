import { createDb } from '../db';
import { campaigns, masterCategories } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { Env } from '../types';
import { mapCampaignToResponse } from '../lib/field-mapping';
import { excludeDeleted } from '../lib/timestamps';

const CampaignStatus = {
  DRAFTED: 'DRAFTED',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export interface JupiterStats {
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

export interface JupiterPoolBaseAsset {
  id: string;
  name: string;
  symbol: string;
  icon?: string;
  decimals: number;
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
  };
  organicScore?: number;
  organicScoreLabel?: string;
  tags?: string[];
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

export interface JupiterPool {
  id: string;
  chain: string;
  dex: string;
  type: string;
  quoteAsset?: string;
  createdAt: string;
  liquidity: number;
  bondingCurve: number | string;
  volume24h?: number;
  updatedAt: string;
  baseAsset: JupiterPoolBaseAsset;
}

export interface JupiterPoolsResponse {
  pools: JupiterPool[];
  total: number;
}

// JupiterTokenSearchResult and JupiterTokenSearchResponse are now replaced by JupiterPoolBaseAsset and JupiterPoolsResponse

export interface CampaignWithJupiterData {
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

  async getCampaignsWithJupiterData(): Promise<CampaignWithJupiterData[]> {
    const campaignResults = await this.db
      .select({
        campaign: campaigns,
        categoryName: masterCategories.name,
      })
      .from(campaigns)
      .leftJoin(masterCategories, eq(campaigns.categoryId, masterCategories.id))
      .where(and(excludeDeleted(campaigns.deletedAt), eq(campaigns.status, CampaignStatus.SUCCESS)))
      .orderBy(desc(campaigns.createdAt));

    const tokenMints = campaignResults
      .map((result) => result.campaign.tokenMint)
      .filter((mint): mint is string => !!mint);

    let poolsData: JupiterPool[] = [];
    if (tokenMints.length > 0) {
      const url = `https://datapi.jup.ag/v1/pools?assetIds=${tokenMints.map((mint) => encodeURIComponent(mint)).join(',')}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = (await response.json()) as JupiterPoolsResponse;
        poolsData = Array.isArray(data.pools) ? data.pools : [];
      }
    }

    const poolMap = new Map<string, JupiterPool>();
    for (const pool of poolsData) {
      if (pool.id) {
        poolMap.set(pool.id, pool);
      }
    }

    const campaignsWithJupiter: CampaignWithJupiterData[] = campaignResults
      .filter((result) => result.campaign.tokenMint && poolMap.has(result.campaign.tokenMint))
      .map((result) => {
        const campaign = result.campaign;
        const mappedCampaign = mapCampaignToResponse(campaign);
        const pool = poolMap.get(campaign.tokenMint!);
        let jupiterDataObj: CampaignWithJupiterData['jupiterData'] = undefined;
        if (pool) {
          jupiterDataObj = {
            volume24h: pool.volume24h ?? pool.baseAsset.stats24h?.buyVolume ?? 0,
            trades:
              (pool.baseAsset.stats24h?.numBuys || 0) + (pool.baseAsset.stats24h?.numSells || 0),
            priceChange24h: pool.baseAsset.stats24h?.priceChange,
            liquidity: pool.liquidity,
            mcap: pool.baseAsset.mcap,
          };
        }
        return {
          ...mappedCampaign,
          categoryName: result.categoryName,
          jupiterData: jupiterDataObj,
        };
      });

    return campaignsWithJupiter;
  }
}
