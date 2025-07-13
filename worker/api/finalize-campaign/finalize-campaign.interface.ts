import { ApiSuccessResponse, ApiErrorResponse } from '../../lib/api-response';
import { Campaign } from '../../db/schema';

export interface FinalizeCampaignData {
  message: string;
  campaign: Campaign;
}

export type FinalizeCampaignResponse = ApiSuccessResponse<FinalizeCampaignData>;
export type FinalizeCampaignErrorResponse = ApiErrorResponse;
