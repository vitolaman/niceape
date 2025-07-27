import { z } from 'zod';

export const createCampaignDto = z.object({
  formData: z.object({
    name: z.string(),
    token_name: z.string(),
    token_ticker: z.string(),
    short_description: z.string(),
    long_description: z.string(),
    campaign_goal: z.string(),
    category_id: z.string(),
    charity_wallet_address: z.string(),
    website_url: z.string(),
    x_handle: z.string(),
    telegram_handle: z.string(),
    mint: z.string(),
  }),
  tokenImage: z.string(), // base64
  campaignImage: z.string(), // base64
  userWallet: z.string(),
  userId: z.string(),
});

export type CreateCampaignDto = z.infer<typeof createCampaignDto>;
