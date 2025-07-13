// Utility functions for field mapping between database and API responses

import { Campaign, User, MasterCategory } from '../db/schema';

// Map database campaign object to camelCase response format
export function mapCampaignToResponse(campaign: Campaign): any {
  return {
    id: campaign.id,
    name: campaign.name,
    userId: campaign.userId,
    bannerUrl: campaign.bannerUrl,
    imageUrl: campaign.imageUrl,
    tokenName: campaign.tokenName,
    tokenTicker: campaign.tokenTicker,
    tokenImageUrl: campaign.tokenImageUrl,
    campaignGoal: campaign.campaignGoal,
    categoryId: campaign.categoryId,
    charityWalletAddress: campaign.charityWalletAddress,
    raisedValue: campaign.raisedValue,
    shortDescription: campaign.shortDescription,
    longDescription: campaign.longDescription,
    websiteUrl: campaign.websiteUrl,
    xHandle: campaign.xHandle,
    telegramHandle: campaign.telegramHandle,
    status: campaign.status,
    tokenMint: campaign.tokenMint,
    transactionSignature: campaign.transactionSignature,
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
    deletedAt: campaign.deletedAt,
  };
}

// Map database user object to camelCase response format
export function mapUserToResponse(user: User): any {
  return {
    id: user.id,
    displayName: user.displayName,
    bio: user.bio,
    walletAddress: user.walletAddress,
    xHandle: user.xHandle,
    totalTrade: user.totalTrade,
    volumeTrade: user.volumeTrade,
    charityImpact: user.charityImpact,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt,
  };
}

// Map database category object to camelCase response format
export function mapCategoryToResponse(category: MasterCategory): any {
  return {
    id: category.id,
    name: category.name,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    deletedAt: category.deletedAt,
  };
}

// Map array of campaigns to response format
export function mapCampaignsToResponse(campaigns: Campaign[]): any[] {
  return campaigns.map(mapCampaignToResponse);
}

// Map array of users to response format
export function mapUsersToResponse(users: User[]): any[] {
  return users.map(mapUserToResponse);
}

// Map array of categories to response format
export function mapCategoriesToResponse(categories: MasterCategory[]): any[] {
  return categories.map(mapCategoryToResponse);
}

// Alias for backward compatibility
export const toCamelCaseCampaign = mapCampaignToResponse;
export const toCamelCaseUser = mapUserToResponse;
export const toCamelCaseCategory = mapCategoryToResponse;
