import { z } from 'zod';

export const finalizeCampaignDto = z.object({
  campaignData: z.object({
    id: z.string(), // Add campaign ID
    name: z.string(),
    tokenName: z.string(),
    tokenTicker: z.string(),
    shortDescription: z.string(),
    longDescription: z.string(),
    campaignGoal: z.number(),
    categoryId: z.string(),
    charityWalletAddress: z.string(),
    websiteUrl: z.string().optional(),
    xHandle: z.string().optional(),
    telegramHandle: z.string().optional(),
    tokenImageUrl: z.string(),
    imageUrl: z.string(),
    bannerUrl: z.string(),
    userId: z.string(),
    tokenMint: z.string(),
    createdAt: z.string(),
  }),
  transactionSignature: z.string().optional(), // Make optional since it might be empty for failed campaigns
});

export type FinalizeCampaignDto = z.infer<typeof finalizeCampaignDto>;
