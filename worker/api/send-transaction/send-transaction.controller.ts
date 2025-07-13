import { Env } from '../../types';
import { sendTransactionDto } from './send-transaction.dto';
import { SendTransactionService } from './send-transaction.service';
import {
  createSuccessResponse,
  createErrorResponse,
  ErrorCode,
  HttpStatus,
} from '../../lib/api-response';

export class SendTransactionController {
  private service: SendTransactionService;

  constructor(env: Env) {
    this.service = new SendTransactionService(env);
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

      if (!rawBody.signedTransaction) {
        return createErrorResponse(
          ErrorCode.MISSING_REQUIRED_FIELDS,
          'Missing signed transaction',
          HttpStatus.BAD_REQUEST
        );
      }

      const validatedData = sendTransactionDto.parse(body);
      const result = await this.service.sendTransaction(validatedData);

      return createSuccessResponse(result, 'Transaction sent successfully');
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid')) {
        return createErrorResponse(
          ErrorCode.VALIDATION_ERROR,
          error.message,
          HttpStatus.BAD_REQUEST
        );
      }

      return createErrorResponse(
        ErrorCode.BLOCKCHAIN_ERROR,
        error instanceof Error ? error.message : 'Unknown error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
