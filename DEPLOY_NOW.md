# 🚀 Deploy to Aptos Testnet - RIGHT NOW!

## Your Account Details

**Account Address:**
```
0x2ea544f3fc41ce923f0fff957464b71678b8d11e7171016d46110ae2622424e9
```

**✅ Contract Compiled Successfully!**

## Step 1: Fund Your Account (REQUIRED)

Visit this link to get test APT:
```
https://aptos.dev/network/faucet?address=0x2ea544f3fc41ce923f0fff957464b71678b8d11e7171016d46110ae2622424e9
```

Or scan this QR at the faucet website.

**You need at least 1 APT to deploy the contract.**

## Step 2: Deploy the Contract

Once funded, run:

```bash
cd /home/linux/Desktop/web3-hackathon/move

aptos move publish \
  --named-addresses marketplace=0x2ea544f3fc41ce923f0fff957464b71678b8d11e7171016d46110ae2622424e9 \
  --assume-yes
```

This will:
1. ✅ Compile the contract
2. ✅ Deploy to Aptos Testnet
3. ✅ Show transaction hash
4. ✅ Display gas used

## Step 3: Initialize the Marketplace

After deployment succeeds, initialize it:

```bash
aptos move run \
  --function-id '0x2ea544f3fc41ce923f0fff957464b71678b8d11e7171016d46110ae2622424e9::marketplace::initialize'
```

## Step 4: Verify Deployment

Check on Aptos Explorer:
```
https://explorer.aptoslabs.com/account/0x2ea544f3fc41ce923f0fff957464b71678b8d11e7171016d46110ae2622424e9/modules?network=testnet
```

You should see your `marketplace` module!

## Step 5: Update Frontend

Edit `src/config.ts`:

```typescript
export const NETWORK = 'Testnet';
export const CONTRACT_ADDRESS = '0x2ea544f3fc41ce923f0fff957464b71678b8d11e7171016d46110ae2622424e9';
export const MODULE_NAME = 'marketplace';
export const FUNCTION_NAME = 'purchase_product';
```

## Step 6: Test the Contract

List a test product:

```bash
aptos move run \
  --function-id '0x2ea544f3fc41ce923f0fff957464b71678b8d11e7171016d46110ae2622424e9::marketplace::list_product' \
  --args \
    address:0x2ea544f3fc41ce923f0fff957464b71678b8d11e7171016d46110ae2622424e9 \
    string:"Test Product" \
    string:"A test description" \
    u64:100000000 \
    string:"https://via.placeholder.com/300"
```

## Alternative: I Can Deploy It

If you want me to deploy it, just:

1. **Fund the account** at the faucet link above
2. **Tell me when funded**
3. **I'll run the deployment commands**

## Expected Output

```bash
$ aptos move publish --named-addresses marketplace=0x2ea... --assume-yes

Compiling, may take a little while to download git dependencies...
INCLUDING DEPENDENCY AptosFramework
INCLUDING DEPENDENCY AptosStdlib  
INCLUDING DEPENDENCY MoveStdlib
BUILDING marketplace
package size 4120 bytes
Transaction submitted: https://explorer.aptoslabs.com/txn/0x...?network=testnet
{
  "Result": {
    "transaction_hash": "0x...",
    "gas_used": 872,
    "gas_unit_price": 100,
    "sender": "0x2ea544f3fc41ce923f0fff957464b71678b8d11e7171016d46110ae2622424e9",
    "success": true,
    "version": 891234567,
    "vm_status": "Executed successfully"
  }
}
```

## Quick Commands Reference

```bash
# Check account balance
aptos account balance --account 0x2ea544f3fc41ce923f0fff957464b71678b8d11e7171016d46110ae2622424e9

# Deploy
cd /home/linux/Desktop/web3-hackathon/move
aptos move publish --named-addresses marketplace=0x2ea544f3fc41ce923f0fff957464b71678b8d11e7171016d46110ae2622424e9 --assume-yes

# Initialize
aptos move run --function-id '0x2ea544f3fc41ce923f0fff957464b71678b8d11e7171016d46110ae2622424e9::marketplace::initialize'

# List product
aptos move run --function-id '0x2ea544f3fc41ce923f0fff957464b71678b8d11e7171016d46110ae2622424e9::marketplace::list_product' --args address:0x2ea544f3fc41ce923f0fff957464b71678b8d11e7171016d46110ae2622424e9 string:"Product Name" string:"Description" u64:100000000 string:"https://image.url"
```

## What You'll Have After Deployment

✅ Smart contract deployed on Aptos Testnet
✅ Marketplace initialized and ready
✅ Contract address to use in frontend
✅ Verified on Aptos Explorer
✅ Can list/buy products on-chain
✅ Events emitted for indexing
✅ Fully decentralized P2P marketplace

## Next: Integrate with Frontend

Once deployed, I'll help you:
1. Update the frontend to use the smart contract
2. Replace Supabase with on-chain storage
3. Deploy frontend to Vercel
4. Have a fully on-chain marketplace!

---

**Ready to deploy? Fund the account and let me know!** 🚀
