/// <reference types="@cloudflare/workers-types" />

// Apply polyfills for Cloudflare Workers environment
import './lib/polyfills.js';

import { Env } from './types';
import { UserService } from './api/users';
import { CampaignService } from './api/campaigns';
import { MasterCategoryService } from './api/categories';

// Import new API controllers
import { CreateCampaignController } from './api/create-campaign/create-campaign.controller';
import { FinalizeCampaignController } from './api/finalize-campaign/finalize-campaign.controller';
import { SendTransactionController } from './api/send-transaction/send-transaction.controller';
import { UserAuthController } from './api/user-auth/user-auth.controller';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Helper function to handle CORS
function corsResponse(response: Response): Response {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// Helper function to create JSON response
function jsonResponse(data: any, status: number = 200): Response {
  return corsResponse(
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

// Helper function to create error response
function errorResponse(message: string, status: number = 400): Response {
  return jsonResponse({ error: message }, status);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return corsResponse(new Response(null, { status: 200 }));
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      // Initialize services
      const userService = new UserService(env);
      const campaignService = new CampaignService(env);
      const categoryService = new MasterCategoryService(env);

      // Initialize new API controllers
      const createCampaignController = new CreateCampaignController(env);
      const finalizeCampaignController = new FinalizeCampaignController(env);
      const sendTransactionController = new SendTransactionController(env);
      const userAuthController = new UserAuthController(env);

      // API Routes
      if (path.startsWith('/api/')) {
        // Users endpoints
        if (path === '/api/users' && method === 'GET') {
          const users = await userService.getAllUsers();
          return jsonResponse(users);
        }

        if (path === '/api/users' && method === 'POST') {
          const body = (await request.json()) as any;
          const user = await userService.createUser(body);
          return jsonResponse(user, 201);
        }

        if (path.startsWith('/api/users/') && method === 'GET') {
          const userId = path.split('/')[3];
          const user = await userService.getUserById(userId);
          if (!user) return errorResponse('User not found', 404);
          return jsonResponse(user);
        }

        if (path.startsWith('/api/users/') && method === 'PUT') {
          const userId = path.split('/')[3];
          const body = (await request.json()) as any;
          const user = await userService.updateUser(userId, body);
          return jsonResponse(user);
        }

        if (path.startsWith('/api/users/wallet/') && method === 'GET') {
          const walletAddress = path.split('/')[4];
          const user = await userService.getUserByWallet(walletAddress);
          if (!user) return errorResponse('User not found', 404);
          return jsonResponse(user);
        }

        // User authentication endpoint
        if (path === '/api/user-auth' && method === 'POST') {
          return await userAuthController.handle(request, env);
        }

        // Categories endpoints
        if (path === '/api/categories' && method === 'GET') {
          const categories = await categoryService.getAllCategories();
          return jsonResponse(categories);
        }

        if (path === '/api/categories' && method === 'POST') {
          const body = (await request.json()) as any;
          const category = await categoryService.createCategory(body);
          return jsonResponse(category, 201);
        }

        if (path.startsWith('/api/categories/') && method === 'GET') {
          const categoryId = path.split('/')[3];
          const category = await categoryService.getCategoryById(categoryId);
          if (!category) return errorResponse('Category not found', 404);
          return jsonResponse(category);
        }

        if (path.startsWith('/api/categories/') && method === 'PUT') {
          const categoryId = path.split('/')[3];
          const body = (await request.json()) as any;
          const category = await categoryService.updateCategory(categoryId, body);
          return jsonResponse(category);
        }

        if (path.startsWith('/api/categories/') && method === 'DELETE') {
          const categoryId = path.split('/')[3];
          const category = await categoryService.deleteCategory(categoryId);
          return jsonResponse(category);
        }

        // Campaigns endpoints
        if (path === '/api/campaigns' && method === 'GET') {
          const campaigns = await campaignService.getAllCampaigns();
          return jsonResponse(campaigns);
        }

        if (path === '/api/campaigns' && method === 'POST') {
          const body = (await request.json()) as any;
          const campaign = await campaignService.createCampaign(body);
          return jsonResponse(campaign, 201);
        }

        if (path.startsWith('/api/campaigns/') && method === 'GET') {
          const campaignId = path.split('/')[3];
          const campaign = await campaignService.getCampaignById(campaignId);
          if (!campaign) return errorResponse('Campaign not found', 404);
          return jsonResponse(campaign);
        }

        if (path.startsWith('/api/campaigns/') && method === 'PUT') {
          const campaignId = path.split('/')[3];
          const body = (await request.json()) as any;
          const campaign = await campaignService.updateCampaign(campaignId, body);
          return jsonResponse(campaign);
        }

        if (path.startsWith('/api/campaigns/user/') && method === 'GET') {
          const userId = path.split('/')[4];
          const campaigns = await campaignService.getCampaignsByUser(userId);
          return jsonResponse(campaigns);
        }

        if (path.startsWith('/api/campaigns/category/') && method === 'GET') {
          const categoryId = path.split('/')[4];
          const campaigns = await campaignService.getCampaignsByCategory(categoryId);
          return jsonResponse(campaigns);
        }

        // New structured API endpoints
        if (path === '/api/create-campaign' && method === 'POST') {
          return await createCampaignController.handle(request, env);
        }

        if (path === '/api/finalize-campaign' && method === 'POST') {
          return await finalizeCampaignController.handle(request, env);
        }

        if (path === '/api/send-transaction' && method === 'POST') {
          return await sendTransactionController.handle(request, env);
        }

        // Health check endpoint
        if (path === '/api/health' && method === 'GET') {
          return jsonResponse({
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: env.ENVIRONMENT,
          });
        }

        return errorResponse('Endpoint not found', 404);
      }

      // Default response for non-API routes
      return jsonResponse({
        message: 'Nice Ape Worker API',
        version: '1.0.0',
        endpoints: {
          users: '/api/users',
          'user-auth': '/api/user-auth',
          categories: '/api/categories',
          campaigns: '/api/campaigns',
          health: '/api/health',
          // New structured endpoints
          'create-campaign': '/api/create-campaign',
          'finalize-campaign': '/api/finalize-campaign',
          'send-transaction': '/api/send-transaction',
        },
      });
    } catch (error) {
      console.error('Worker error:', error);
      return errorResponse('Internal server error', 500);
    }
  },
};
