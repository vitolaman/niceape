// API client for connecting Next.js frontend to Cloudflare Worker backend

const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_WORKER_API_URL_PRODUCTION;
  }
  return process.env.NEXT_PUBLIC_WORKER_API_URL;
};

const WORKER_API_BASE_URL = getApiUrl() || 'http://localhost:8787';

class WorkerApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = WORKER_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = (await response.json()) as any;
        // Handle standardized API response format
        if (errorData.success === false && errorData.error) {
          errorMessage = errorData.error.message || errorData.error.code || errorMessage;
        } else if (errorData.error) {
          errorMessage = typeof errorData.error === 'string' ? errorData.error : errorMessage;
        }
      } catch {
        // If JSON parsing fails, use the default HTTP status message
      }
      throw new Error(errorMessage);
    }

    const result = (await response.json()) as any;

    // Handle standardized API response format
    if (result.success === false) {
      const errorMessage = result.error?.message || result.error?.code || 'API request failed';
      throw new Error(errorMessage);
    }

    // Return the data field if it exists (standardized format), otherwise return the whole result
    return (result.data !== undefined ? result.data : result) as T;
  }

  // User API methods
  async getUsers() {
    return this.request('/api/users');
  }

  async userAuth(walletAddress: string) {
    return this.request('/api/user-auth', {
      method: 'POST',
      body: JSON.stringify({ wallet_address: walletAddress }),
    });
  }

  async createUser(userData: {
    id: string;
    walletAddress: string;
    username?: string;
    email?: string;
  }) {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUserById(id: string) {
    return this.request(`/api/users/${id}`);
  }

  async getUserByWallet(walletAddress: string) {
    return this.request(`/api/users/wallet/${walletAddress}`);
  }

  async updateUser(id: string, updateData: { username?: string; email?: string }) {
    return this.request(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Campaign API methods
  async getCampaigns() {
    return this.request('/api/campaigns');
  }

  async createCampaign(campaignData: {
    id: string;
    title: string;
    description?: string;
    creatorId: string;
    tokenMint?: string;
    targetAmount: number;
    startDate: string;
    endDate: string;
  }) {
    return this.request('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  }

  async getCampaignById(id: string) {
    return this.request(`/api/campaigns/${id}`);
  }

  async getCampaignsByCreator(creatorId: string) {
    return this.request(`/api/campaigns/creator/${creatorId}`);
  }

  async updateCampaign(
    id: string,
    updateData: {
      title?: string;
      description?: string;
      targetAmount?: number;
      currentAmount?: number;
      status?: 'active' | 'completed' | 'cancelled';
      endDate?: string;
    }
  ) {
    return this.request(`/api/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Pool API methods
  async getPools() {
    return this.request('/api/pools');
  }

  async createPool(poolData: {
    id: string;
    tokenMint: string;
    poolAddress: string;
    creatorId: string;
    tokenName: string;
    tokenSymbol: string;
    tokenSupply: number;
  }) {
    return this.request('/api/pools', {
      method: 'POST',
      body: JSON.stringify(poolData),
    });
  }

  async getPoolById(id: string) {
    return this.request(`/api/pools/${id}`);
  }

  async getPoolByTokenMint(tokenMint: string) {
    return this.request(`/api/pools/token/${tokenMint}`);
  }

  async getPoolsByCreator(creatorId: string) {
    return this.request(`/api/pools/creator/${creatorId}`);
  }

  async updatePool(
    id: string,
    updateData: {
      liquidityPool?: number;
      pricePerToken?: number;
      status?: 'active' | 'paused' | 'closed';
    }
  ) {
    return this.request(`/api/pools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Transaction API methods
  async getTransactions() {
    return this.request('/api/transactions');
  }

  async createTransaction(transactionData: {
    id: string;
    fromAddress: string;
    toAddress?: string;
    amount: number;
    tokenMint?: string;
    transactionHash: string;
    type: 'buy' | 'sell' | 'transfer' | 'campaign_contribution';
    poolId?: string;
    campaignId?: string;
  }) {
    return this.request('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async getTransactionById(id: string) {
    return this.request(`/api/transactions/${id}`);
  }

  async getTransactionByHash(hash: string) {
    return this.request(`/api/transactions/hash/${hash}`);
  }

  async getTransactionsByAddress(address: string, limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/api/transactions/address/${address}${query}`);
  }

  async getTransactionsByPool(poolId: string, limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/api/transactions/pool/${poolId}${query}`);
  }

  async getTransactionsByCampaign(campaignId: string) {
    return this.request(`/api/transactions/campaign/${campaignId}`);
  }

  async updateTransactionStatus(id: string, status: 'pending' | 'confirmed' | 'failed') {
    return this.request(`/api/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }

  // Campaign creation flow methods
  async createCampaignFlow(data: {
    formData: any;
    tokenImage: string;
    campaignImage: string;
    userWallet: string;
    userId: string;
  }): Promise<{
    tokenMint: string;
    unsignedTransaction: string;
    campaignData: any;
  }> {
    return this.request('/api/create-campaign', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendTransaction(data: { signedTransaction: string }): Promise<{
    success: boolean;
    signature: string;
  }> {
    return this.request('/api/send-transaction', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async finalizeCampaign(data: {
    campaignData: any;
    transactionSignature?: string;
  }): Promise<void> {
    return this.request('/api/finalize-campaign', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Export singleton instance
export const workerApi = new WorkerApiClient();
export default WorkerApiClient;

// Export utility functions for backward compatibility
export { getApiUrl };
