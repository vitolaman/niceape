import { ApiSuccessResponse, ApiErrorResponse } from '../../lib/api-response';

export interface CreateCampaignData {
  tokenMint: string;
  unsignedTransaction: string;
  campaignData: {
    name: string;
    tokenName: string;
    tokenTicker: string;
    shortDescription: string;
    longDescription: string;
    campaignGoal: number;
    categoryId: string;
    charityWalletAddress: string;
    websiteUrl: string;
    xHandle: string;
    telegramHandle: string;
    tokenImageUrl: string;
    imageUrl: string;
    bannerUrl: string;
    userId: string;
    tokenMint: string;
    createdAt: string;
  };
  metadataUrl: string;
}

export type CreateCampaignResponse = ApiSuccessResponse<CreateCampaignData>;
export type CreateCampaignErrorResponse = ApiErrorResponse;
