import { FinalizeCampaignDto } from './finalize-campaign.dto';
import { FinalizeCampaignData } from './finalize-campaign.interface';
import { Env, CampaignStatus } from '../../types';
import { createDb } from '../../db';
import { campaigns } from '../../db/schema';
import { toCamelCaseCampaign } from '../../lib/field-mapping';
import { eq } from 'drizzle-orm';

export class FinalizeCampaignService {
  private env: Env;

  constructor(env: Env) {
    this.env = env;
  }

  async finalizeCampaign(data: FinalizeCampaignDto): Promise<FinalizeCampaignData> {
    const { campaignData, transactionSignature } = data;

    const db = createDb(this.env.DB);

    // Determine status based on whether transaction signature is provided
    const status = transactionSignature ? CampaignStatus.SUCCESS : CampaignStatus.FAILED;

    // Prepare update data
    const updateData: Partial<typeof campaigns.$inferSelect> = {
      status: status,
      updatedAt: new Date().toISOString(),
    };

    // Add transaction signature if provided (for SUCCESS status)
    if (transactionSignature) {
      updateData.transactionSignature = transactionSignature;
    }

    // Update campaign status using campaign ID
    const campaignId = campaignData.id;
    if (!campaignId) {
      throw new Error('Campaign ID is required to finalize campaign');
    }

    const [updatedCampaign] = await db
      .update(campaigns)
      .set(updateData)
      .where(eq(campaigns.id, campaignId))
      .returning();

    if (!updatedCampaign) {
      throw new Error(`Campaign with id ${campaignId} not found`);
    }

    // Convert to camelCase for response
    const camelCaseCampaign = toCamelCaseCampaign(updatedCampaign);

    return {
      message: `Campaign ${status === CampaignStatus.SUCCESS ? 'finalized successfully' : 'marked as failed'}`,
      campaign: camelCaseCampaign,
    };
  }
}
