import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  displayName: text('display_name'),
  bio: text('bio'),
  walletAddress: text('wallet_address'),
  xHandle: text('x_handle'),
  totalTrade: integer('total_trade'),
  volumeTrade: integer('volume_trade'),
  charityImpact: integer('charity_impact'),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
  deletedAt: text('deleted_at'),
});

// Master categories table
export const masterCategories = sqliteTable('master_categories', {
  id: text('id'),
  name: text('name'),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
  deletedAt: text('deleted_at'),
});

// Campaigns table
export const campaigns = sqliteTable('campaigns', {
  id: text('id').primaryKey(),
  name: text('name'),
  userId: text('user_id'),
  bannerUrl: text('banner_url'),
  imageUrl: text('image_url'),
  tokenName: text('token_name'),
  tokenTicker: text('token_ticker'),
  tokenImageUrl: text('token_image_url'),
  campaignGoal: integer('campaign_goal').default(0),
  categoryId: text('category_id'),
  charityWalletAddress: text('charity_wallet_address'),
  raisedValue: integer('raised_value').default(0),
  shortDescription: text('short_description'),
  longDescription: text('long_description'),
  websiteUrl: text('website_url'),
  xHandle: text('x_handle'),
  telegramHandle: text('telegram_handle'),
  status: text('status').default('DRAFTED'), // Campaign status: DRAFTED, SUCCESS, FAILED
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
  deletedAt: text('deleted_at'),
  tokenMint: text('token_mint'),
  transactionSignature: text('transaction_signature'),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertMasterCategorySchema = createInsertSchema(masterCategories);
export const selectMasterCategorySchema = createSelectSchema(masterCategories);

export const insertCampaignSchema = createInsertSchema(campaigns);
export const selectCampaignSchema = createSelectSchema(campaigns);

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type MasterCategory = typeof masterCategories.$inferSelect;
export type NewMasterCategory = typeof masterCategories.$inferInsert;

export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;
