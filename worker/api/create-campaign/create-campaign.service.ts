import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';
import '../../lib/polyfills.js';
import { uploadBase64ImageToR2, uploadMetadataToR2 } from '../../lib/r2.js';
import { CreateCampaignDto } from './create-campaign.dto';
import { CreateCampaignData } from './create-campaign.interface';
import { Env, CampaignStatus } from '../../types';
import { createDb } from '../../db';
import { campaigns, NewCampaign } from '../../db/schema';

export class CreateCampaignService {
  private env: Env;

  constructor(env: Env) {
    this.env = env;
  }

  private async uploadFilesToR2(tokenImage: string, campaignImage: string, mint: string) {
    const results: { tokenImageUrl: string; campaignImageUrl: string } = {
      tokenImageUrl: '',
      campaignImageUrl: '',
    };

    if (tokenImage) {
      results.tokenImageUrl = await uploadBase64ImageToR2(tokenImage, 'images', mint, this.env);
    }

    if (campaignImage) {
      results.campaignImageUrl = await uploadBase64ImageToR2(
        campaignImage,
        'images',
        undefined,
        this.env
      );
    }

    return results;
  }

  private async uploadMetadataToR2Worker(metadata: any, folder: string, mint: string) {
    return await uploadMetadataToR2(metadata, folder, mint, this.env);
  }

  private async createPoolTransaction({
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
    const RPC_URL = this.env.RPC_URL;
    const NETWORK = this.env.NEXT_PUBLIC_NETWORK || 'mainnet';
    const POOL_CONFIG_KEY =
      NETWORK === 'devnet'
        ? this.env.NEXT_PUBLIC_DEVNET_POOL_CONFIG_KEY
        : this.env.NEXT_PUBLIC_MAINNET_POOL_CONFIG_KEY;

    if (!RPC_URL || !POOL_CONFIG_KEY) {
      throw new Error('Missing required blockchain environment variables');
    }

    const connection = new Connection(RPC_URL, 'confirmed');
    const client = new DynamicBondingCurveClient(connection, 'confirmed');

    const poolTx = await client.pool.createPool({
      config: new PublicKey(POOL_CONFIG_KEY),
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

  async createCampaign(data: CreateCampaignDto): Promise<CreateCampaignData> {
    const { formData, tokenImage, campaignImage, userWallet, userId } = data;

    // Generate keypair for the token
    const keyPair = Keypair.generate();
    const mint = keyPair.publicKey.toBase58();

    // Step 1: Upload files to R2 cloud storage
    const { tokenImageUrl, campaignImageUrl } = await this.uploadFilesToR2(
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
    const metadataUrl = await this.uploadMetadataToR2Worker(metadata, 'metadata', mint);

    // Step 3: Create pool transaction
    const poolTx = await this.createPoolTransaction({
      mint,
      tokenName: formData.token_name,
      tokenSymbol: formData.token_ticker,
      metadataUrl,
      userWallet,
    });

    // Step 4: Sign with keypair first
    poolTx.sign(keyPair);

    // Step 5: Serialize transaction for client-side signing
    const serializedTx = poolTx.serialize({ requireAllSignatures: false }).toString('base64');

    // Step 6: Save campaign to database with DRAFTED status
    const newCampaign: NewCampaign = {
      id: crypto.randomUUID(),
      name: formData.name,
      userId: userId,
      bannerUrl: campaignImageUrl, // Using campaign image as banner for now
      imageUrl: campaignImageUrl,
      tokenName: formData.token_name,
      tokenTicker: formData.token_ticker,
      tokenImageUrl: tokenImageUrl,
      campaignGoal: parseInt(formData.campaign_goal),
      categoryId: formData.category_id,
      charityWalletAddress: formData.charity_wallet_address,
      raisedValue: 0, // Initial value
      shortDescription: formData.short_description,
      longDescription: formData.long_description,
      websiteUrl: formData.website_url || null,
      xHandle: formData.x_handle || null,
      telegramHandle: formData.telegram_handle || null,
      tokenMint: mint,
      transactionSignature: null, // No transaction signature yet
      status: CampaignStatus.DRAFTED, // Set status to DRAFTED
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    // Insert campaign into database
    const db = createDb(this.env.DB);
    const [insertedCampaign] = await db.insert(campaigns).values(newCampaign).returning();

    if (!insertedCampaign) {
      throw new Error('Failed to save draft campaign');
    }

    // Step 7: Prepare campaign data for response (converting to camelCase for response)
    const campaignDataForDB = {
      id: insertedCampaign.id, // Include the campaign ID
      name: formData.name,
      tokenName: formData.token_name,
      tokenTicker: formData.token_ticker,
      shortDescription: formData.short_description,
      longDescription: formData.long_description,
      campaignGoal: parseInt(formData.campaign_goal),
      categoryId: formData.category_id,
      charityWalletAddress: formData.charity_wallet_address,
      websiteUrl: formData.website_url,
      xHandle: formData.x_handle,
      telegramHandle: formData.telegram_handle,
      tokenImageUrl: tokenImageUrl,
      imageUrl: campaignImageUrl,
      bannerUrl: campaignImageUrl, // Using campaign image as banner for now
      userId: userId,
      tokenMint: mint,
      createdAt: new Date().toISOString(),
    };

    return {
      tokenMint: mint,
      unsignedTransaction: serializedTx,
      campaignData: campaignDataForDB,
      metadataUrl,
    };
  }
}
