import { Transaction } from '@solana/web3.js';
import { workerApi } from '@/lib/worker-api';

export interface CampaignFormData {
  name: string;
  token_name: string;
  token_ticker: string;
  token_image_url: string;
  short_description: string;
  long_description: string;
  campaign_goal: string;
  category_id: string;
  banner_url: string;
  image_url: string;
  charity_wallet_address: string;
  website_url: string;
  x_handle: string;
  telegram_handle: string;
}

export interface CampaignFiles {
  tokenImage: File | null;
  campaignImage: File | null;
}

export interface CreateCampaignParams {
  formData: CampaignFormData;
  files: CampaignFiles;
  userWallet: string;
  charityWallet: string;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
}

/**
 * Convert File to base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Send signed transaction to blockchain
 */
async function sendSignedTransaction(signedTransaction: Transaction): Promise<string> {
  try {
    const result = await workerApi.sendTransaction({
      signedTransaction: signedTransaction.serialize().toString('base64'),
    });

    return result.signature || 'transaction_sent';
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to send transaction');
  }
}

/**
 * Finalize campaign - either with success status and transaction signature, or failed status
 */
async function finalizeCampaign(campaignData: any, transactionSignature?: string): Promise<void> {
  try {
    await workerApi.finalizeCampaign({
      campaignData,
      transactionSignature: transactionSignature || '',
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to finalize campaign');
  }
}

/**
 * Main function to create a campaign using API routes
 */
export async function createCampaign({
  formData,
  files,
  userWallet,
  charityWallet,
  signTransaction,
}: CreateCampaignParams): Promise<{
  success: boolean;
  tokenMint?: string;
  transactionSignature?: string;
  formDataWithUrls?: CampaignFormData;
  error?: string;
}> {
  try {
    // Step 1: Get user ID from localStorage
    const userId = localStorage.getItem('userId') || 'anonymous_user';

    // Step 2: Convert files to base64
    let tokenImageBase64 = '';
    let campaignImageBase64 = '';

    if (files.tokenImage) {
      tokenImageBase64 = await fileToBase64(files.tokenImage);
    }

    if (files.campaignImage) {
      campaignImageBase64 = await fileToBase64(files.campaignImage);
    }

    // Step 3: Call create-campaign API to prepare transaction and upload files
    // This will also save the campaign with DRAFTED status
    const formDataWithCharityWallet = {
      ...formData,
      charity_wallet_address: charityWallet,
    };

    const createResult = await workerApi.createCampaignFlow({
      formData: formDataWithCharityWallet,
      tokenImage: tokenImageBase64,
      campaignImage: campaignImageBase64,
      userWallet,
      userId,
    });

    const { tokenMint, unsignedTransaction, campaignData } = createResult;

    // Step 4: Deserialize and sign the transaction
    const transaction = Transaction.from(Buffer.from(unsignedTransaction, 'base64'));
    const signedTransaction = await signTransaction(transaction);

    // Step 5: Send the signed transaction
    let transactionSignature: string;
    try {
      transactionSignature = await sendSignedTransaction(signedTransaction);

      // Step 6: Finalize campaign with SUCCESS status
      await finalizeCampaign(campaignData, transactionSignature);
    } catch (transactionError) {
      // If transaction fails, finalize campaign with FAILED status
      await finalizeCampaign(campaignData);
      throw transactionError;
    }

    // Return success result
    return {
      success: true,
      tokenMint,
      transactionSignature,
      formDataWithUrls: campaignData as CampaignFormData,
    };
  } catch (error) {
    console.error('Error in createCampaign:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Validation helper for campaign form data
 */
export function validateCampaignData(
  formData: CampaignFormData,
  files: CampaignFiles,
  charityWallet?: string
): string[] {
  const errors: string[] = [];

  // Required fields validation
  if (!formData.name.trim()) errors.push('Campaign name is required');
  if (!formData.short_description.trim()) errors.push('Short description is required');
  if (!formData.long_description.trim()) errors.push('Long description is required');
  if (!formData.campaign_goal || parseInt(formData.campaign_goal) < 100) {
    errors.push('Campaign goal must be at least $100');
  }
  if (!formData.category_id) errors.push('Category is required');

  // Only validate charity wallet if provided separately
  if (charityWallet && !charityWallet.trim()) {
    errors.push('Charity wallet address is required');
  }

  // Token validation (required for campaign creation)
  if (!formData.token_name.trim()) errors.push('Token name is required');
  if (!formData.token_ticker.trim()) errors.push('Token symbol is required');
  if (!files.tokenImage) errors.push('Token image is required');

  // Required files validation
  if (!files.campaignImage) errors.push('Campaign image is required');

  // URL validation
  const urlFields = [{ field: formData.website_url, name: 'Website URL' }];

  urlFields.forEach(({ field, name }) => {
    if (field && field.trim()) {
      try {
        new URL(field);
      } catch {
        errors.push(`${name} must be a valid URL`);
      }
    }
  });

  return errors;
}
