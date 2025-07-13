import { Env } from '../../types';
import { finalizeCampaignDto } from './finalize-campaign.dto';
import { FinalizeCampaignService } from './finalize-campaign.service';
import {
  createSuccessResponse,
  createErrorResponse,
  ErrorCode,
  HttpStatus,
} from '../../lib/api-response';

export class FinalizeCampaignController {
  private service: FinalizeCampaignService;

  constructor(env: Env) {
    this.service = new FinalizeCampaignService(env);
  }

  async handle(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return createErrorResponse(
        ErrorCode.METHOD_NOT_ALLOWED,
        'Method not allowed',
        HttpStatus.METHOD_NOT_ALLOWED
      );
    }

    try {
      const body = await request.json();
      const validatedData = finalizeCampaignDto.parse(body);

      const result = await this.service.finalizeCampaign(validatedData);

      return createSuccessResponse(result, 'Campaign finalized successfully');
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid')) {
        return createErrorResponse(
          ErrorCode.VALIDATION_ERROR,
          error.message,
          HttpStatus.BAD_REQUEST
        );
      }

      if (error instanceof Error && error.message.includes('database')) {
        return createErrorResponse(
          ErrorCode.DATABASE_ERROR,
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return createErrorResponse(
        ErrorCode.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'Unknown error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
