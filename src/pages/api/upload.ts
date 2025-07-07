import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey } from '@solana/web3.js';
import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';
import { uploadBase64ImageToR2, uploadMetadataToR2 } from '@/lib/r2';

const RPC_URL = process.env.RPC_URL as string;

// Network-specific configuration
const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'mainnet'; // 'mainnet' or 'devnet'
const POOL_CONFIG_KEY =
  NETWORK === 'devnet'
    ? (process.env.NEXT_PUBLIC_DEVNET_POOL_CONFIG_KEY as string)
    : (process.env.NEXT_PUBLIC_MAINNET_POOL_CONFIG_KEY as string);

// Fallback to original env var if network-specific ones don't exist
const FALLBACK_POOL_CONFIG_KEY = process.env.NEXT_PUBLIC_POOL_CONFIG_KEY as string;
const FINAL_POOL_CONFIG_KEY = POOL_CONFIG_KEY || FALLBACK_POOL_CONFIG_KEY;

if (!RPC_URL || !FINAL_POOL_CONFIG_KEY) {
  throw new Error('Missing required environment variables');
}

// Types
type UploadRequest = {
  tokenLogo: string;
  tokenName: string;
  tokenSymbol: string;
  mint: string;
  userWallet: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tokenLogo, tokenName, tokenSymbol, mint, userWallet } = req.body as UploadRequest;

    // Validate required fields
    if (!tokenLogo || !tokenName || !tokenSymbol || !mint || !userWallet) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Upload image and metadata using R2 library
    const imageUrl = await uploadBase64ImageToR2(tokenLogo, 'images', mint);

    const metadata = {
      name: tokenName,
      symbol: tokenSymbol,
      image: imageUrl,
    };
    const metadataUrl = await uploadMetadataToR2(metadata, 'metadata', mint);

    // Create pool transaction
    const poolTx = await createPoolTransaction({
      mint,
      tokenName,
      tokenSymbol,
      metadataUrl,
      userWallet,
    });

    res.status(200).json({
      success: true,
      poolTx: poolTx
        .serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        })
        .toString('base64'),
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

async function createPoolTransaction({
  mint,
  tokenName,
  tokenSymbol,
  metadataUrl,
  userWallet,
}: {
  mint: string;
  tokenName: string;
  tokenSymbol: string;
  metadataUrl: string;
  userWallet: string;
}) {
  const connection = new Connection(RPC_URL, 'confirmed');
  const client = new DynamicBondingCurveClient(connection, 'confirmed');

  const poolTx = await client.pool.createPool({
    config: new PublicKey(FINAL_POOL_CONFIG_KEY),
    baseMint: new PublicKey(mint),
    name: tokenName,
    symbol: tokenSymbol,
    uri: metadataUrl,
    payer: new PublicKey(userWallet),
    poolCreator: new PublicKey(userWallet),
  });

  const { blockhash } = await connection.getLatestBlockhash();
  poolTx.feePayer = new PublicKey(userWallet);
  poolTx.recentBlockhash = blockhash;

  return poolTx;
}
