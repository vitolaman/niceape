import { z } from 'zod';

export const sendTransactionDto = z.object({
  signedTransaction: z.string(), // base64 encoded signed transaction
  additionalSigners: z.array(z.any()).optional(), // Keypair objects
});

export type SendTransactionDto = z.infer<typeof sendTransactionDto>;
