import { createDb } from '../db';
import { campaigns, insertCampaignSchema } from '../db/schema';
import { eq } from 'drizzle-orm';
import { Env } from '../types';
import { mapCampaignToResponse } from '../lib/field-mapping';
import {
  createTimestamps,
  updateTimestamps,
  deleteTimestamps,
  excludeDeleted,
  activeWithCondition,
} from '../lib/timestamps';

export class CampaignService {
  private db;

  constructor(env: Env) {
    this.db = createDb(env.DB);
  }

  async createCampaign(campaignData: {
    id: string;
    name?: string;
    userId?: string;
    bannerUrl?: string;
    imageUrl?: string;
    tokenName?: string;
    tokenTicker?: string;
    tokenImageUrl?: string;
    campaignGoal?: number;
    categoryId?: string;
    charityWalletAddress?: string;
    raisedValue?: number;
    shortDescription?: string;
    longDescription?: string;
    websiteUrl?: string;
    xHandle?: string;
    telegramHandle?: string;
  }) {
    const campaignWithTimestamps = {
      ...campaignData,
      ...createTimestamps(),
    };

    const newCampaign = insertCampaignSchema.parse(campaignWithTimestamps);
    const result = await this.db.insert(campaigns).values(newCampaign).returning();
    return mapCampaignToResponse(result[0]);
  }

  async getCampaignById(id: string) {
    const campaign = await this.db
      .select()
      .from(campaigns)
      .where(activeWithCondition(campaigns.deletedAt, eq(campaigns.id, id)))
      .limit(1);

    return campaign[0] ? mapCampaignToResponse(campaign[0]) : null;
  }

  async getCampaignsByUser(userId: string) {
    const userCampaigns = await this.db
      .select()
      .from(campaigns)
      .where(activeWithCondition(campaigns.deletedAt, eq(campaigns.userId, userId)));
    return userCampaigns.map(mapCampaignToResponse);
  }

  async getCampaignsByCategory(categoryId: string) {
    const categoryCampaigns = await this.db
      .select()
      .from(campaigns)
      .where(activeWithCondition(campaigns.deletedAt, eq(campaigns.categoryId, categoryId)));
    return categoryCampaigns.map(mapCampaignToResponse);
  }

  async getAllCampaigns() {
    const allCampaigns = await this.db
      .select()
      .from(campaigns)
      .where(excludeDeleted(campaigns.deletedAt));
    return allCampaigns.map(mapCampaignToResponse);
  }

  async updateCampaign(
    id: string,
    updateData: Partial<{
      name: string;
      bannerUrl: string;
      imageUrl: string;
      tokenName: string;
      tokenTicker: string;
      tokenImageUrl: string;
      campaignGoal: number;
      categoryId: string;
      charityWalletAddress: string;
      raisedValue: number;
      shortDescription: string;
      longDescription: string;
      websiteUrl: string;
      xHandle: string;
      telegramHandle: string;
    }>
  ) {
    const dataWithTimestamps = {
      ...updateData,
      ...updateTimestamps(),
    };

    const result = await this.db
      .update(campaigns)
      .set(dataWithTimestamps)
      .where(activeWithCondition(campaigns.deletedAt, eq(campaigns.id, id)))
      .returning();

    return mapCampaignToResponse(result[0]);
  }

  async softDeleteCampaign(id: string) {
    const result = await this.db
      .update(campaigns)
      .set(deleteTimestamps())
      .where(activeWithCondition(campaigns.deletedAt, eq(campaigns.id, id)))
      .returning();

    return mapCampaignToResponse(result[0]);
  }

  async updateRaisedValue(id: string, amount: number) {
    return await this.updateCampaign(id, { raisedValue: amount });
  }

  async incrementRaisedValue(id: string, amount: number) {
    const campaign = await this.getCampaignById(id);
    if (!campaign) throw new Error('Campaign not found');

    const newAmount = (campaign.raisedValue || 0) + amount;
    return await this.updateCampaign(id, { raisedValue: newAmount });
  }
}
