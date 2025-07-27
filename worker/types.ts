/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
  ENVIRONMENT: string;

  // Cloudflare R2 Storage
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_ACCOUNT_ID: string;
  R2_BUCKET_NAME: string;

  // Network Configuration
  NETWORK: string;
  NEXT_PUBLIC_NETWORK: string;
  RPC_URL: string;
  NEXT_PUBLIC_MAINNET_POOL_CONFIG_KEY: string;
  MAINNET_POOL_CONFIG_KEY: string;
  NEXT_PUBLIC_DEVNET_POOL_CONFIG_KEY: string;
  DEVNET_POOL_CONFIG_KEY: string;
  NEXT_PUBLIC_METEORA_DBC_PROGRAM_ID: string;
  SOL_WALLET_DEVNET_PRIVATE_KEY: string;

  // Twitter OAuth
  TWITTER_CLIENT_ID: string;
  TWITTER_CLIENT_SECRET: string;
}

// Campaign Status Constants
export const CampaignStatus = {
  DRAFTED: 'DRAFTED',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export type CampaignStatus = (typeof CampaignStatus)[keyof typeof CampaignStatus];
