#!/bin/bash

# Aptos Marketplace Deployment Script
# Run this after funding your account!

set -e

echo "🚀 Deploying Marketplace to Aptos Testnet..."
echo ""

ACCOUNT="0x2ea544f3fc41ce923f0fff957464b71678b8d11e7171016d46110ae2622424e9"

echo "📋 Account: $ACCOUNT"
echo ""

# Set config path
export APTOS_CONFIG_PATH="./move/.aptos/config.yaml"

# Check balance
echo "💰 Checking account balance..."
cd move
aptos account balance --account $ACCOUNT --profile testnet 2>&1 || echo "⚠️ Account might not be funded yet"
echo ""

# Deploy contract
echo "📦 Deploying smart contract..."
aptos move publish \
  --named-addresses marketplace=$ACCOUNT \
  --profile testnet \
  --assume-yes

echo ""
echo "✅ Contract deployed!"
echo ""

# Initialize marketplace
echo "🎯 Initializing marketplace..."
aptos move run \
  --function-id "${ACCOUNT}::marketplace::initialize" \
  --profile testnet

echo ""
echo "✅ Marketplace initialized!"
echo ""

# Test: List a sample product
echo "🛍️ Listing test product..."
aptos move run \
  --function-id "${ACCOUNT}::marketplace::list_product" \
  --args \
    address:$ACCOUNT \
    string:"Gaming Laptop RTX 4080" \
    string:"High-performance gaming laptop with NVIDIA RTX 4080" \
    u64:250000000 \
    string:"https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000" \
  --profile testnet

echo ""
echo "✅ Test product listed!"
echo ""

echo "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "📍 Contract Address: $ACCOUNT"
echo "🔍 View on Explorer: https://explorer.aptoslabs.com/account/$ACCOUNT/modules?network=testnet"
echo ""
echo "Next steps:"
echo "1. Update src/config.ts with contract address"
echo "2. npm run dev to test locally"
echo "3. Deploy frontend to Vercel"
echo ""

cd ..
