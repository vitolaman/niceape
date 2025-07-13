import { Connection, Keypair, sendAndConfirmRawTransaction, Transaction } from '@solana/web3.js';
import '../../lib/polyfills.js';
import { SendTransactionDto } from './send-transaction.dto';
import { SendTransactionData } from './send-transaction.interface';
import { Env } from '../../types';

export class SendTransactionService {
  private env: Env;

  constructor(env: Env) {
    this.env = env;
  }

  async sendTransaction(data: SendTransactionDto): Promise<SendTransactionData> {
    const { signedTransaction, additionalSigners } = data;

    const RPC_URL = this.env.RPC_URL;
    if (!RPC_URL) {
      throw new Error('Missing required environment variables');
    }

    const connection = new Connection(RPC_URL, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000, // optional: 60 detik
    });

    const transaction = Transaction.from(Buffer.from(signedTransaction, 'base64'));

    // Step 1: Send transaction
    const txSignature = await connection.sendRawTransaction(transaction.serialize(), {
      skipPreflight: false,
    });

    // Step 2: Poll status manually (up to 60 detik)
    const MAX_RETRIES = 30;
    for (let i = 0; i < MAX_RETRIES; i++) {
      const status = await connection.getSignatureStatus(txSignature, {
        searchTransactionHistory: true,
      });

      const confirmation = status?.value?.confirmationStatus;

      if (confirmation === 'confirmed' || confirmation === 'finalized') {
        break; // sukses
      }

      await new Promise((resolve) => setTimeout(resolve, 2000)); // tunggu 2 detik
    }

    return {
      signature: txSignature,
    };
  }
}
