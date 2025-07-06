import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';
import { uploadBase64ImageToR2, uploadMetadataToR2 } from '@/lib/r2';

// Network-specific configuration
const RPC_URL = process.env.RPC_URL as string;
const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'mainnet';
const POOL_CONFIG_KEY =
  NETWORK === 'devnet'
    ? (process.env.NEXT_PUBLIC_DEVNET_POOL_CONFIG_KEY as string)
    : (process.env.NEXT_PUBLIC_MAINNET_POOL_CONFIG_KEY as string);
const FALLBACK_POOL_CONFIG_KEY = process.env.NEXT_PUBLIC_POOL_CONFIG_KEY as string;
const FINAL_POOL_CONFIG_KEY = POOL_CONFIG_KEY || FALLBACK_POOL_CONFIG_KEY;

if (!RPC_URL || !FINAL_POOL_CONFIG_KEY) {
  throw new Error('Missing required blockchain environment variables');
}

interface CampaignCreationRequest {
  formData: {
    name: string;
    token_name: string;
    token_ticker: string;
    short_description: string;
    long_description: string;
    campaign_goal: string;
    category_id: string;
    charity_wallet_address: string;
    website_url: string;
    x_handle: string;
    telegram_handle: string;
  };
  tokenImage: string; // base64
  campaignImage: string; // base64
  userWallet: string;
  userId: string;
}

async function uploadFilesToR2(tokenImage: string, campaignImage: string, mint: string) {
  const results: { tokenImageUrl: string; campaignImageUrl: string } = {
    tokenImageUrl: '',
    campaignImageUrl: '',
  };

  if (tokenImage) {
    results.tokenImageUrl = await uploadBase64ImageToR2(tokenImage, 'images', mint);
  }

  if (campaignImage) {
    results.campaignImageUrl = await uploadBase64ImageToR2(campaignImage, 'images');
  }

  return results;
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formData, tokenImage, campaignImage, userWallet, userId } =
      req.body as CampaignCreationRequest;

    // Validate required fields
    if (!formData || !tokenImage || !campaignImage || !userWallet || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate keypair for the token
    const keyPair = Keypair.generate();
    const mint = keyPair.publicKey.toBase58();

    // Step 1: Upload files to R2 cloud storage
    const { tokenImageUrl, campaignImageUrl } = await uploadFilesToR2(
      tokenImage,
      campaignImage,
      mint
    );

    // Step 2: Upload metadata to R2 (for token creation)
    const metadata = {
      name: formData.token_name,
      symbol: formData.token_ticker,
      image: tokenImageUrl,
    };
    const metadataUrl = await uploadMetadataToR2(metadata, 'metadata', mint);

    // Step 3: Create pool transaction
    const poolTx = await createPoolTransaction({
      mint,
      tokenName: formData.token_name,
      tokenSymbol: formData.token_ticker,
      metadataUrl,
      userWallet,
    });

    // Step 4: Sign with keypair first
    poolTx.sign(keyPair);

    // Step 5: Return unsigned transaction for client-side signing
    const serializedTx = poolTx.serialize({ requireAllSignatures: false }).toString('base64');

    // Step 6: Prepare campaign data for database (to be saved after transaction is sent)
    const campaignDataForDB = {
      ...formData,
      token_image_url: tokenImageUrl,
      image_url: campaignImageUrl,
      banner_url: campaignImageUrl, // Using campaign image as banner for now
      user_id: userId,
      token_mint: mint,
      created_at: new Date().toISOString(),
    };

    return res.status(200).json({
      success: true,
      tokenMint: mint,
      unsignedTransaction: serializedTx,
      campaignData: campaignDataForDB,
      metadataUrl,
    });
  } catch (error) {
    console.error('Error in create-campaign API:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}
