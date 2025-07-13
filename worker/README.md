# Nice Ape Cloudflare Worker API

This directory contains the Cloudflare Worker backend for Nice Ape, integrated with D1 database and Drizzle ORM.

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Create D1 Database

```bash
# Create development database
pnpm run db:create

# Create production database
pnpm run db:create:prod
```

### 3. Update Configuration

After creating the databases, update the `wrangler.toml` file with your actual database IDs:

```toml
[[d1_databases]]
binding = "DB"
database_name = "nice-ape-db"
database_id = "your-actual-database-id-here"
```

### 4. Generate and Apply Migrations

```bash
# Generate migration files from schema
pnpm run db:generate

# Apply migrations to development database
pnpm run db:migrate

# Apply migrations to production database
pnpm run db:migrate:prod
```

### 5. Environment Variables

Update your `.env` file with your Cloudflare credentials:

```env
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_DATABASE_ID=your-d1-database-id
CLOUDFLARE_D1_TOKEN=your-d1-api-token
```

## Development

### Start Worker Development Server

```bash
pnpm run worker:dev
```

This will start the worker at `http://localhost:8787`

### Database Management

```bash
# Open Drizzle Studio for database exploration
pnpm run db:studio

# View worker logs
pnpm run worker:tail
```

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `GET /api/users/wallet/:address` - Get user by wallet address

### Campaigns

- `GET /api/campaigns` - Get active campaigns
- `POST /api/campaigns` - Create a new campaign
- `GET /api/campaigns/:id` - Get campaign by ID
- `PUT /api/campaigns/:id` - Update campaign
- `GET /api/campaigns/creator/:creatorId` - Get campaigns by creator

### Pools

- `GET /api/pools` - Get active pools
- `POST /api/pools` - Create a new pool
- `GET /api/pools/:id` - Get pool by ID
- `PUT /api/pools/:id` - Update pool
- `GET /api/pools/token/:tokenMint` - Get pool by token mint
- `GET /api/pools/creator/:creatorId` - Get pools by creator

### Transactions

- `GET /api/transactions` - Get recent transactions
- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions/:id` - Get transaction by ID
- `PUT /api/transactions/:id` - Update transaction status
- `GET /api/transactions/hash/:hash` - Get transaction by hash
- `GET /api/transactions/address/:address` - Get transactions by address
- `GET /api/transactions/pool/:poolId` - Get transactions by pool
- `GET /api/transactions/campaign/:campaignId` - Get transactions by campaign

### Health Check

- `GET /api/health` - Health check endpoint

## Database Schema

The database includes the following tables:

- `users` - User accounts and wallet addresses
- `campaigns` - Fundraising campaigns
- `pools` - Trading pools for tokens
- `transactions` - All transaction records
- `token_metadata` - Token metadata and social links

## Deployment

### Deploy to Cloudflare Workers

```bash
pnpm run worker:deploy
```

Make sure to:

1. Set up your production D1 database
2. Configure environment variables in the Cloudflare Dashboard
3. Update the `wrangler.toml` with production database IDs

## Project Structure

```
worker/
├── api/                 # API service classes
│   ├── campaigns.ts     # Campaign management
│   ├── pools.ts         # Pool management
│   ├── transactions.ts  # Transaction management
│   └── users.ts         # User management
├── db/                  # Database configuration
│   ├── index.ts         # Database connection
│   ├── schema.ts        # Drizzle schema definitions
│   └── migrations/      # SQL migration files
├── index.ts            # Main worker entry point
└── types.ts            # TypeScript type definitions
```
