import { NextApiRequest, NextApiResponse } from 'next';

interface FinalizeCampaignRequest {
  campaignData: any;
  transactionSignature: string;
}

async function saveCampaignToDatabase(campaignData: any): Promise<void> {
  const response = await fetch('https://d1-nice-api.vito99varianlaman.workers.dev/api/campaign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(campaignData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to save campaign to database');
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { campaignData, transactionSignature } = req.body as FinalizeCampaignRequest;

    if (!campaignData || !transactionSignature) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Add transaction signature to campaign data
    const finalCampaignData = {
      ...campaignData,
      transaction_signature: transactionSignature,
    };

    // Save campaign to external database
    await saveCampaignToDatabase(finalCampaignData);

    return res.status(200).json({
      success: true,
      message: 'Campaign saved successfully',
    });
  } catch (error) {
    console.error('Error finalizing campaign:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to finalize campaign',
    });
  }
}
