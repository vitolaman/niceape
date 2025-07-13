import { z } from 'zod';

export const userAuthDto = z.object({
  wallet_address: z.string().min(1, 'Wallet address is required'),
});

export type UserAuthDto = z.infer<typeof userAuthDto>;
