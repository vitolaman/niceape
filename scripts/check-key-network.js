// Script to check if a pool config key is for devnet or mainnet
const { Connection, PublicKey } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

function readEnvFile() {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const env = {};

    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key && values.length) {
          env[key] = values.join('=').replace(/^["']|["']$/g, '');
        }
      }
    });

    return env;
  } catch (error) {
    console.error('Error reading .env file:', error.message);
    return {};
  }
}

async function checkKeyNetwork() {
  const env = readEnvFile();

  // Get config key from .env
  const configKey =
    env.NEXT_PUBLIC_DEVNET_POOL_CONFIG_KEY || env.NEXT_PUBLIC_MAINNET_POOL_CONFIG_KEY;

  if (!configKey) {
    console.error('❌ No pool config key found in .env file');
    console.error(
      '   Looking for: NEXT_PUBLIC_DEVNET_POOL_CONFIG_KEY or NEXT_PUBLIC_MAINNET_POOL_CONFIG_KEY'
    );
    return;
  }

  console.log(`🔍 Checking config key: ${configKey}`);
  console.log('');

  // Test on both networks
  const networks = [
    { name: 'Devnet', rpc: 'https://api.devnet.solana.com' },
    { name: 'Mainnet', rpc: 'https://api.mainnet-beta.solana.com' },
  ];

  for (const network of networks) {
    console.log(`📡 Checking on ${network.name}...`);

    try {
      const connection = new Connection(network.rpc, 'confirmed');
      const configPublicKey = new PublicKey(configKey);

      // Check if account exists
      const accountInfo = await connection.getAccountInfo(configPublicKey);

      if (accountInfo) {
        console.log(`✅ ${network.name}: Account EXISTS`);
        console.log(`   - Owner: ${accountInfo.owner.toString()}`);
        console.log(`   - Data length: ${accountInfo.data.length} bytes`);
        console.log(`   - Lamports: ${accountInfo.lamports}`);

        // Check if it's owned by Meteora program
        const meteoraProgramId = 'dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN'; // Meteora DBC program
        if (accountInfo.owner.toString() === meteoraProgramId) {
          console.log(`   - ✅ Owned by Meteora DBC program`);
        } else {
          console.log(`   - ⚠️  NOT owned by Meteora DBC program`);
        }
      } else {
        console.log(`❌ ${network.name}: Account does NOT exist`);
      }
    } catch (error) {
      console.log(`❌ ${network.name}: Error - ${error.message}`);
    }

    console.log('');
  }

  // Also check your .env configuration
  console.log('📄 Your current .env configuration:');
  console.log(`   - NEXT_PUBLIC_NETWORK: ${env.NEXT_PUBLIC_NETWORK || 'not set'}`);
  console.log(
    `   - RPC_URL: ${env.RPC_URL ? (env.RPC_URL.includes('devnet') ? 'devnet' : 'mainnet/other') : 'not set'}`
  );
  console.log(
    `   - NEXT_PUBLIC_DEVNET_POOL_CONFIG_KEY: ${env.NEXT_PUBLIC_DEVNET_POOL_CONFIG_KEY || 'not set'}`
  );
  console.log(
    `   - NEXT_PUBLIC_MAINNET_POOL_CONFIG_KEY: ${env.NEXT_PUBLIC_MAINNET_POOL_CONFIG_KEY || 'not set'}`
  );
  console.log('');

  // Check for configuration mismatches
  if (env.NEXT_PUBLIC_NETWORK && env.RPC_URL) {
    const networkSetting = env.NEXT_PUBLIC_NETWORK;
    const rpcIsDevnet = env.RPC_URL.includes('devnet');

    if (
      (networkSetting === 'devnet' && !rpcIsDevnet) ||
      (networkSetting === 'mainnet' && rpcIsDevnet)
    ) {
      console.log('⚠️  CONFIGURATION MISMATCH DETECTED:');
      console.log(`   - Your NEXT_PUBLIC_NETWORK is set to "${networkSetting}"`);
      console.log(`   - But your RPC_URL is pointing to ${rpcIsDevnet ? 'devnet' : 'mainnet'}`);
      console.log('   - This could cause issues!');
      console.log('');
      console.log('💡 Recommendations:');
      console.log('   1. If you want to use devnet, change NEXT_PUBLIC_NETWORK to "devnet"');
      console.log(
        '   2. If you want to use mainnet, uncomment the mainnet RPC_URL and use NEXT_PUBLIC_MAINNET_POOL_CONFIG_KEY'
      );
    } else {
      console.log('✅ Configuration looks consistent!');
    }
  }
}

checkKeyNetwork().catch(console.error);
