# Fun Launch

A platform for launching tokens with customizable price curves using Meteora's Dynamic Bonding Curve (DBC).

## Table of Contents

- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Devnet Configuration](#devnet-configuration)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)

## Setup

1. Clone the repository

```bash
git clone https://github.com/MeteoraAg/meteora-scaffold.git
cd templates/fun-launch
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

4. Edit the `.env` file with your own values

```env
# .env
# Cloudflare R2 Storage
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_ACCOUNT_ID=your_r2_account_id
R2_BUCKET=your_r2_bucket_name

# Solana RPC URL
RPC_URL=your_rpc_url

# Network Configuration (for devnet testing)
NEXT_PUBLIC_NETWORK=devnet

# Pool Configuration
NEXT_PUBLIC_DEVNET_POOL_CONFIG_KEY=your_devnet_pool_config_key
NEXT_PUBLIC_MAINNET_POOL_CONFIG_KEY=your_mainnet_pool_config_key
```

## Environment Variables

### Getting R2 Credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to R2
3. Create a new bucket or select an existing one
4. Go to "Manage R2 API Tokens"
5. Create a new API token with the following permissions:
   - Account R2 Storage: Edit
   - Bucket: Your bucket name
6. Copy the Access Key ID and Secret Access Key
7. Your Account ID can be found in the Cloudflare dashboard URL or in the Account Home page

### Getting RPC URL

Get your RPC URL from any 3rd party provider. For devnet, you can use:

```
https://api.devnet.solana.com
```

## Devnet Configuration

### Setting Up a Devnet Config Key

To test your launch platform on Solana devnet, you'll need to generate a Meteora DBC configuration.

#### Using the Provided Script

1. **Update your `.env` file with devnet settings:**

```env
# Set network to devnet
NEXT_PUBLIC_NETWORK=devnet

# Use devnet RPC
RPC_URL=https://api.devnet.solana.com
```

2. **Generate the DBC Config**

```bash
# Generate devnet configuration
pnpm config:generate
```

This script will:

- Create a new Meteora DBC configuration on devnet
- Update your `.env` file with the new config key
- Provide links to view the transaction on Solana Explorer

3. **Verify your config (optional)**

```bash
# Check if your config key exists on the network
pnpm config:check
```

#### Alternative: Use Meteora's Launch UI

If the script doesn't work for you, you can manually create a config:

1. Go to https://launch.meteora.ag/
2. Connect your wallet
3. Switch network to devnet
4. Create a new config key
5. Copy the config key to your .env file

### Configuration Parameters

The generated config includes:

- Token Update Authority: CREATOR mode
- Base Fee: 1%
- LP Distribution: Equal distribution between partners and creators
- Token Supply: Optimized for devnet testing

## Available Scripts

### Development Scripts

- `pnpm dev` - Start the Next.js development server with Turbopack
- `pnpm build` - Build the production application
- `pnpm start` - Start the production server
- `pnpm lint` - Lint the codebase
- `pnpm format` - Format code using Prettier
- `pnpm format:check` - Check code formatting without making changes

### Configuration Scripts

- `pnpm config:generate` - Generate a new Meteora DBC config on devnet
- `pnpm config:check` - Verify your config key exists on the network

## Troubleshooting

### Common Issues and Solutions

#### "Account not found" error

**Solution:** Make sure you're using a devnet-specific config key, not the mainnet one.

#### "Insufficient funds" error

**Solution:** Get devnet SOL from https://faucet.solana.com/

#### "Invalid config" error

**Solution:** Verify your config key is valid for devnet.

#### Wrong network RPC

**Solution:** Ensure RPC_URL points to devnet:

```env
RPC_URL=https://api.devnet.solana.com
```

### Testing Your Setup

1. Switch to devnet in your wallet
2. Get devnet SOL from faucet
3. Try creating a test token
4. Check transaction on Solana Explorer (devnet mode)

## Project Structure

The project follows a standard Next.js structure with additional Solana/Meteora specific components:

- `scripts/` - Configuration and utility scripts for Meteora DBC
- `src/components/` - Reusable UI components
- `src/contexts/` - React context providers
- `src/hooks/` - Custom React hooks
- `src/pages/` - Next.js pages
- `public/` - Static assets

### Key Components

- `CreatePoolButton.tsx` - Button for creating new token pools
- `TokenChart/` - Price chart for tokens
- `Explore/` - Token exploration interface

## Features

- Create token pools with customizable price curves
- Upload token metadata and logos
- View token statistics and charts
- Track token transactions
- Mobile-friendly interface

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Solana Web3.js
- Dynamic Bonding Curve SDK
- Cloudflare R2 for storage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
