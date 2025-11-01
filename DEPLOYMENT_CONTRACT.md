# 🔷 Deploy Move Smart Contract to Aptos

## Prerequisites

1. **Install Aptos CLI**
```bash
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
```

2. **Verify Installation**
```bash
aptos --version
```

## Step 1: Initialize Your Account

```bash
# Create a new account profile
aptos init --profile testnet

# Follow prompts:
# - Network: testnet
# - Private key: Press enter to generate new one
# - This will create ~/.aptos/config.yaml
```

Your address will be shown - **SAVE IT!**

## Step 2: Fund Your Account

```bash
# Get test APT tokens
aptos account fund-with-faucet --account default --profile testnet
```

Or visit: https://www.aptos.dev/en/network/faucet

## Step 3: Compile the Contract

```bash
cd /home/linux/Desktop/web3-hackathon/move

# Compile
aptos move compile --named-addresses marketplace=default --profile testnet
```

**Expected output:** `Success`

## Step 4: Test the Contract (Optional)

```bash
aptos move test --named-addresses marketplace=default --profile testnet
```

## Step 5: Deploy to Testnet

```bash
aptos move publish --named-addresses marketplace=default --profile testnet --assume-yes
```

**This will:**
- Deploy the contract to Testnet
- Show you the transaction hash
- Display the module address

**SAVE THE MODULE ADDRESS!** You'll need it in the frontend.

## Step 6: Initialize the Marketplace

After deployment, initialize it:

```bash
aptos move run \
  --function-id 'YOUR_ADDRESS::marketplace::initialize' \
  --profile testnet \
  --assume-yes
```

Replace `YOUR_ADDRESS` with the address from Step 1.

## Step 7: Update Frontend Config

Edit `src/config.ts`:

```typescript
export const NETWORK = 'Testnet';
export const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_ADDRESS'; // From Step 5
export const MODULE_NAME = 'marketplace';
```

## Example Output

```bash
$ aptos move publish --named-addresses marketplace=default --profile testnet

Compiling, may take a little while to download git dependencies...
INCLUDING DEPENDENCY AptosFramework
INCLUDING DEPENDENCY AptosStdlib
INCLUDING DEPENDENCY MoveStdlib
BUILDING marketplace
package size 3916 bytes
Do you want to submit a transaction for a range of [766400 - 1149600] Octas at a gas unit price of 100 Octas? [yes/no] >
yes

Transaction submitted: https://explorer.aptoslabs.com/txn/0x...
{
  "Result": {
    "transaction_hash": "0x...",
    "gas_used": 7664,
    "gas_unit_price": 100,
    "sender": "0xYOUR_ADDRESS",
    "success": true,
    "version": 12345678,
    "vm_status": "Executed successfully"
  }
}
```

**Your contract is deployed at:** `0xYOUR_ADDRESS::marketplace`

## Step 8: Verify Deployment

Check on explorer:
```
https://explorer.aptoslabs.com/account/YOUR_ADDRESS/modules?network=testnet
```

You should see the `marketplace` module!

## Using the Contract

### List a Product (from CLI)
```bash
aptos move run \
  --function-id 'YOUR_ADDRESS::marketplace::list_product' \
  --args address:YOUR_ADDRESS string:"Gaming Laptop" string:"RTX 4080" u64:250000000 string:"https://example.com/img.jpg" \
  --profile testnet \
  --assume-yes
```

### Purchase a Product (from CLI)
```bash
aptos move run \
  --function-id 'YOUR_ADDRESS::marketplace::purchase_product' \
  --args address:YOUR_ADDRESS u64:1 \
  --profile testnet \
  --assume-yes
```

## Contract Functions

### Entry Functions
- `initialize(account: &signer)` - Initialize marketplace (run once)
- `list_product(seller, marketplace_addr, name, description, price, image_url)` - List a product
- `purchase_product(buyer, marketplace_addr, product_id)` - Buy a product
- `cancel_product(seller, marketplace_addr, product_id)` - Cancel a listing

### View Functions
- `get_product(marketplace_addr, product_id)` - Get product details
- `get_next_product_id(marketplace_addr)` - Get next available ID

## Troubleshooting

### "Module not found"
- Make sure you initialized after deployment
- Check the address is correct

### "Insufficient balance"
- Fund your account from faucet
- Need at least 1 APT for gas

### "Compilation failed"
- Check Move.toml dependencies
- Make sure Aptos CLI is updated

## Next Steps

1. **Deploy contract** using steps above
2. **Update frontend** with contract address
3. **Integrate contract calls** in React app
4. **Deploy frontend** to Vercel/Netlify

## Contract Features

✅ Product listing with metadata
✅ Direct peer-to-peer purchases
✅ Seller can cancel listings
✅ Event emission for indexing
✅ View functions for querying
✅ Unit tests included
✅ Gas optimized

**Your marketplace is now on-chain!** 🎉
