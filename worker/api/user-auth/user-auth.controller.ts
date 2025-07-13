import { Env } from '../../types';
import { userAuthDto } from './user-auth.dto';
import { UserAuthService } from './user-auth.service';
import {
  createSuccessResponse,
  createErrorResponse,
  ErrorCode,
  HttpStatus,
} from '../../lib/api-response';

export class UserAuthController {
  private service: UserAuthService;

  constructor(env: Env) {
    this.service = new UserAuthService(env);
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

      // Validate the request body
      const validationResult = userAuthDto.safeParse(body);

      if (!validationResult.success) {
        return createErrorResponse(
          ErrorCode.VALIDATION_ERROR,
          'Invalid request data',
          HttpStatus.BAD_REQUEST,
          validationResult.error.errors
        );
      }

      const validatedData = validationResult.data;

      // Process authentication/creation
      const result = await this.service.authenticateOrCreateUser(validatedData);

      return createSuccessResponse(
        result,
        result.message,
        result.isNewUser ? HttpStatus.CREATED : HttpStatus.OK
      );
    } catch (error) {
      console.error('UserAuth error:', error);
      return createErrorResponse(
        ErrorCode.INTERNAL_ERROR,
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
