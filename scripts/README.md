# Meteora DBC Scripts

This directory contains utility scripts for setting up and managing Meteora Dynamic Bonding Curve (DBC) configurations on Solana devnet.

## Available Scripts

The following scripts are available to help you set up and configure your Meteora DBC environment:

### `generate-devnet-config.js`

The main script for creating a Meteora DBC configuration on Solana devnet.

**Usage**:

```bash
node scripts/generate-devnet-config.js
```

or

```bash
pnpm config:generate
```

**What it does**:

- Creates a new configuration keypair
- Submits a transaction to create the config on-chain
- Updates your `.env` file with `NEXT_PUBLIC_DEVNET_POOL_CONFIG_KEY`
- Saves your config keypair for future reference
- Provides links to view the transaction on Solana Explorer

### `check-key-network.js`

Verifies which network (devnet/mainnet) your current pool config key exists on.

**Usage**:

```bash
node scripts/check-key-network.js
```

or

```bash
pnpm config:check
```

**What it does**:

- Reads your current config key from `.env` file
- Checks if the key exists on devnet and/or mainnet
- Verifies if it's owned by the Meteora program
- Validates your `.env` configuration for consistency
- Provides recommendations if there are configuration mismatches

## Configuration Details

The generated config includes:

- Token update authority set to CREATOR
- 1% base fee
- Equal LP distribution (25% to each category)
- Token supply and curve parameters optimized for devnet testing

## Workflow

1. **Update your `.env` file with devnet settings**:

```env
# Set network to devnet
NEXT_PUBLIC_NETWORK=devnet

# Use devnet RPC
RPC_URL=https://api.devnet.solana.com
```

2. **Generate the DBC Config**:

```bash
pnpm config:generate
```

3. **Verify your configuration**:

```bash
pnpm config:check
```

4. **Start your application**:

```bash
pnpm dev
```

## Troubleshooting

### Common Issues

#### "Account not found" error

**Solution:** Make sure you're using a devnet-specific config key, not a mainnet one.

#### "Insufficient funds" error

**Solution:** Get devnet SOL from https://faucet.solana.com/

#### "Invalid config" error

**Solution:** Verify your config key is valid for devnet using the `check-key-network.js` script.

### Alternative: Manual Setup

If scripts continue to fail, you can create a config key manually:

1. Go to https://launch.meteora.ag/
2. Connect your wallet
3. Switch network to devnet
4. Create a new config key through their UI
5. Copy the config key to your `.env` file manually

## Security Notes

- **Private Keys**: Never commit keypair JSON files to version control
- **Environment Variables**: Keep .env files secure and don't expose them publicly
- **Devnet Only**: These scripts are configured for devnet - modify RPC URLs for other networks

For more detailed information, please refer to the main [README.md](../README.md) file in the project root.
