import { Transaction } from '@solana/web3.js';

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
  const sendResponse = await fetch('/api/send-transaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      signedTransaction: signedTransaction.serialize().toString('base64'),
    }),
  });

  if (!sendResponse.ok) {
    const error = await sendResponse.json();
    throw new Error(error.error || 'Failed to send transaction');
  }

  const { success, signature } = await sendResponse.json();
  if (!success) {
    throw new Error('Transaction failed');
  }

  return signature || 'transaction_sent';
}

/**
 * Finalize campaign by saving to database
 */
async function finalizeCampaign(campaignData: any, transactionSignature: string): Promise<void> {
  const response = await fetch('/api/finalize-campaign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      campaignData,
      transactionSignature,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to finalize campaign');
  }
}

/**
 * Main function to create a campaign using API routes
 */
export async function createCampaign({
  formData,
  files,
  userWallet,
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
    const createResponse = await fetch('/api/create-campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData,
        tokenImage: tokenImageBase64,
        campaignImage: campaignImageBase64,
        userWallet,
        userId,
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(error.error || 'Failed to create campaign');
    }

    const { tokenMint, unsignedTransaction, campaignData } = await createResponse.json();

    // Step 3: Deserialize and sign the transaction
    const transactionBuffer = Buffer.from(unsignedTransaction, 'base64');
    const transaction = Transaction.from(transactionBuffer);

    const signedTransaction = await signTransaction(transaction);

    // Step 4: Send the signed transaction
    const transactionSignature = await sendSignedTransaction(signedTransaction);

    // Step 5: Finalize campaign by saving to database
    await finalizeCampaign(campaignData, transactionSignature);

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
export function validateCampaignData(formData: CampaignFormData, files: CampaignFiles): string[] {
  const errors: string[] = [];

  // Required fields validation
  if (!formData.name.trim()) errors.push('Campaign name is required');
  if (!formData.short_description.trim()) errors.push('Short description is required');
  if (!formData.long_description.trim()) errors.push('Long description is required');
  if (!formData.campaign_goal || parseInt(formData.campaign_goal) < 100) {
    errors.push('Campaign goal must be at least $100');
  }
  if (!formData.category_id) errors.push('Category is required');
  if (!formData.charity_wallet_address.trim()) errors.push('Charity wallet address is required');

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
