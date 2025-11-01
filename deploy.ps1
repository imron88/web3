# Aptos Marketplace Deployment Script
# Run this after funding your account!
# PowerShell version for Windows

$ErrorActionPreference = "Stop"

Write-Host "🚀 Deploying Marketplace to Aptos Testnet..." -ForegroundColor Green
Write-Host ""

$ACCOUNT = "0x2ea544f3fc41ce923f0fff957464b71678b8d11e7171016d46110ae2424e9"

Write-Host "📋 Account: $ACCOUNT" -ForegroundColor Cyan
Write-Host ""

# Set config path
$env:APTOS_CONFIG_PATH = ".\move\.aptos\config.yaml"

# Check balance
Write-Host "💰 Checking account balance..." -ForegroundColor Yellow
Set-Location move
try {
    aptos account balance --account $ACCOUNT --profile testnet 2>&1
} catch {
    Write-Host "⚠️ Account might not be funded yet" -ForegroundColor Red
}
Write-Host ""

# Deploy contract
Write-Host "📦 Deploying smart contract..." -ForegroundColor Yellow
aptos move publish `
  --named-addresses marketplace=$ACCOUNT `
  --profile testnet `
  --assume-yes

Write-Host ""
Write-Host "✅ Contract deployed!" -ForegroundColor Green
Write-Host ""

# Initialize marketplace
Write-Host "🎯 Initializing marketplace..." -ForegroundColor Yellow
aptos move run `
  --function-id "${ACCOUNT}::marketplace::initialize" `
  --profile testnet

Write-Host ""
Write-Host "✅ Marketplace initialized!" -ForegroundColor Green
Write-Host ""

# Test: List a sample product
Write-Host "🛍️ Listing test product..." -ForegroundColor Yellow
aptos move run `
  --function-id "${ACCOUNT}::marketplace::list_product" `
  --args `
    address:$ACCOUNT `
    string:"Gaming Laptop RTX 4080" `
    string:"High-performance gaming laptop with NVIDIA RTX 4080" `
    u64:250000000 `
    string:"https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000" `
  --profile testnet

Write-Host ""
Write-Host "✅ Test product listed!" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Contract Address: $ACCOUNT" -ForegroundColor Cyan
Write-Host "🔍 View on Explorer: https://explorer.aptoslabs.com/account/$ACCOUNT/modules?network=testnet" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Update src/config.ts with contract address"
Write-Host "2. npm run dev to test locally"
Write-Host "3. Deploy frontend to Vercel"
Write-Host ""

Set-Location ..

