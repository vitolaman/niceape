import { ApiSuccessResponse, ApiErrorResponse } from '../../lib/api-response';

export interface UserData {
  id: string;
  displayName?: string;
  bio?: string;
  walletAddress?: string;
  xHandle?: string;
  totalTrade?: number;
  volumeTrade?: number;
  charityImpact?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserAuthData {
  user: UserData;
  isNewUser: boolean;
  message: string;
}

export type UserAuthResponse = ApiSuccessResponse<UserAuthData>;
export type UserAuthErrorResponse = ApiErrorResponse;
