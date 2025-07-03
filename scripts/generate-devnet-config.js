const { Keypair, Connection, PublicKey, sendAndConfirmTransaction } = require('@solana/web3.js');
const { DynamicBondingCurveClient } = require('@meteora-ag/dynamic-bonding-curve-sdk');
const { BN } = require('bn.js');
const bs58 = require('bs58');
const decode = bs58.decode ? bs58.decode : bs58.default.decode;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Constants
const SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');
const DEVNET_RPC = 'https://api.devnet.solana.com';
const TokenUpdateAuthorityOption = { CREATOR: 0, PARTNER: 1, CUSTOM: 2 };

console.log('🚀 Meteora DBC Setup for Devnet');
console.log('===============================');

async function run() {
  console.log('\n🔑 Step 1: Converting private key to keypair');

  // Get private key from environment variable
  const privateKeyString = process.env.SOL_WALLET_DEVNET_PRIVATE_KEY;

  if (!privateKeyString || privateKeyString.trim() === '') {
    console.error('❌ Error: No private key provided in .env file.');
    console.error(
      'Please add your private key to the SOL_WALLET_DEVNET_PRIVATE_KEY variable in .env file.'
    );
    process.exit(1);
  }

  let feeClaimer;
  try {
    // Decode the base58 private key
    const secretKeyBytes = decode(privateKeyString);

    // The secret key for a Keypair is the full 64 bytes.
    // Phantom usually exports just the 32-byte private key part.
    // We need to create a keypair from the seed (private key).
    feeClaimer = Keypair.fromSeed(secretKeyBytes.slice(0, 32));

    console.log(`✅ Successfully created keypair from private key`);
    console.log(`   Public Key: ${feeClaimer.publicKey.toBase58()}`);

    // Optional: If you want to see the entire keypair for debugging purposes, uncomment the line below
    // console.log(`   Secret Key: ${JSON.stringify(Array.from(feeClaimer.secretKey))}`);
  } catch (error) {
    console.error(
      "❌ Error: Could not decode the private key. Make sure it's a valid base58 string from Phantom.",
      error
    );
    process.exit(1);
  }

  console.log('\n🚀 Step 2: Generating Meteora DBC Config for Devnet');
  console.log('==========================================\n');

  // Initialize connection
  const connection = new Connection(DEVNET_RPC, 'confirmed');

  // Generate a new config keypair
  const configKeypair = Keypair.generate();
  console.log(`Fee Claimer: ${feeClaimer.publicKey.toString()}`);
  console.log(`Config Key: ${configKeypair.publicKey.toString()}\n`);

  // Initialize DBC client
  const client = new DynamicBondingCurveClient(connection, 'confirmed');

  try {
    console.log('📝 Creating config...');

    // Create config transaction
    const transaction = await client.partner.createConfig({
      // Basic settings
      payer: feeClaimer.publicKey,
      config: configKeypair.publicKey,
      feeClaimer: feeClaimer.publicKey,
      leftoverReceiver: feeClaimer.publicKey,
      creator: feeClaimer.publicKey,
      quoteMint: SOL_MINT,
      tokenUpdateAuthority: TokenUpdateAuthorityOption.CREATOR,

      // Fee structure
      poolFees: {
        baseFee: {
          cliffFeeNumerator: new BN('2500000'), // 1% fee
          numberOfPeriod: 0,
          reductionFactor: new BN('0'),
          periodFrequency: new BN('0'),
          feeSchedulerMode: 0,
        },
        dynamicFee: null,
      },

      // LP distribution
      partnerLpPercentage: 25,
      creatorLpPercentage: 25,
      partnerLockedLpPercentage: 25,
      creatorLockedLpPercentage: 25,

      // Migration settings
      migrationFee: {
        feePercentage: 25,
        creatorFeePercentage: 50,
      },
      migrationOption: 0,
      migrationFeeOption: 0,
      migrationQuoteThreshold: new BN('500000000'), // 0.5 SOL

      // Token settings
      tokenType: 0,
      tokenDecimal: 9,
      tokenSupply: {
        preMigrationTokenSupply: new BN('10000000000000000000'),
        postMigrationTokenSupply: new BN('10000000000000000000'),
      },

      // Additional settings
      activationType: 0,
      collectFeeMode: 0,
      sqrtStartPrice: new BN('79226673521066979'),
      creatorTradingFeePercentage: 0,

      // Vesting settings
      lockedVesting: {
        amountPerPeriod: new BN('0'),
        cliffDurationFromMigrationTime: new BN('0'),
        frequency: new BN('0'),
        numberOfPeriod: new BN('0'),
        cliffUnlockAmount: new BN('0'),
      },

      // Required parameters
      padding0: [],
      padding1: [],
      curve: [
        {
          sqrtPrice: new BN('233334906748540631'),
          liquidity: new BN('622226417996106429201027821619672729'),
        },
        {
          sqrtPrice: new BN('79226673521066979257578248091'),
          liquidity: new BN('1'),
        },
      ],
    });

    // Setup and send transaction
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = feeClaimer.publicKey;
    transaction.partialSign(configKeypair);

    console.log('📤 Sending transaction...');
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [feeClaimer, configKeypair],
      { commitment: 'confirmed' }
    );

    console.log('✅ Config created successfully!\n');

    // Update .env file with the new config key
    const envPath = path.join(__dirname, '..', '.env');
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    const configKeyLine = `NEXT_PUBLIC_DEVNET_POOL_CONFIG_KEY="${configKeypair.publicKey.toString()}"`;

    if (envContent.includes('NEXT_PUBLIC_DEVNET_POOL_CONFIG_KEY=')) {
      envContent = envContent.replace(/NEXT_PUBLIC_DEVNET_POOL_CONFIG_KEY=.*/g, configKeyLine);
    } else {
      if (!envContent.endsWith('\n') && envContent.length > 0) envContent += '\n';
      envContent += configKeyLine + '\n';
    }
    fs.writeFileSync(envPath, envContent);

    console.log('🎉 Success!');
    console.log(`Config Key: ${configKeypair.publicKey.toString()}`);
    console.log(
      `Explorer: https://explorer.solana.com/address/${configKeypair.publicKey.toString()}?cluster=devnet`
    );
    console.log('✅ .env file updated');
  } catch (error) {
    console.error('\n❌ Error:', error.message);

    if (error.message.includes('insufficient funds')) {
      console.log(`\n💡 Add SOL to: ${feeClaimer.publicKey.toString()}`);
      console.log('   Get SOL: https://faucet.solana.com/');
    } else {
      console.log('\n💡 Alternative: Use Meteora UI at https://launch.meteora.ag/');
    }
  }
}

run().catch(console.error);
