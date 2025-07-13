import { ApiSuccessResponse, ApiErrorResponse } from '../../lib/api-response';

export interface SendTransactionData {
  signature: string;
}

export type SendTransactionResponse = ApiSuccessResponse<SendTransactionData>;
export type SendTransactionErrorResponse = ApiErrorResponse;
