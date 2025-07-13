import { Env } from '../../types';
import { createCampaignDto } from './create-campaign.dto';
import { CreateCampaignService } from './create-campaign.service';
import {
  createSuccessResponse,
  createErrorResponse,
  ErrorCode,
  HttpStatus,
} from '../../lib/api-response';

export class CreateCampaignController {
  private service: CreateCampaignService;

  constructor(env: Env) {
    this.service = new CreateCampaignService(env);
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

      // Type assertion for body validation
      const rawBody = body as any;

      // Validate required fields
      if (
        !rawBody.formData ||
        !rawBody.tokenImage ||
        !rawBody.campaignImage ||
        !rawBody.userWallet ||
        !rawBody.userId
      ) {
        return createErrorResponse(
          ErrorCode.MISSING_REQUIRED_FIELDS,
          'Missing required fields',
          HttpStatus.BAD_REQUEST
        );
      }

      const validatedData = createCampaignDto.parse(body);
      const result = await this.service.createCampaign(validatedData);

      return createSuccessResponse(result, 'Campaign created successfully', HttpStatus.CREATED);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid')) {
        return createErrorResponse(
          ErrorCode.VALIDATION_ERROR,
          error.message,
          HttpStatus.BAD_REQUEST
        );
      }

      if (error instanceof Error && error.message.includes('upload')) {
        return createErrorResponse(
          ErrorCode.UPLOAD_ERROR,
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
