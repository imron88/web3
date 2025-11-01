# 🔍 Debug Your Stuck Transaction

## Your transaction is stuck at "Confirming transaction... 21s"

This means the app is polling the API but not finding the transaction. Let's debug this!

## Step 1: Check the Console

Open your browser console (F12) and look for:

```
🚀 Transaction submitted: 0xcaf2271596e1759ffe6a23430d70d32bd9934867d13056a6416c333eace62979
```

Copy that transaction hash!

## Step 2: Check Aptos Explorer

1. Go to: https://explorer.aptoslabs.com/?network=devnet
2. Paste your transaction hash: `0xcaf2271596e1759ffe6a23430d70d32bd9934867d13056a6416c333eace62979`
3. See what the explorer says:
   - ✅ Success = Transaction worked!
   - ❌ Failed = Transaction failed
   - 🔍 Not Found = Transaction wasn't submitted or is on different network

## Step 3: Possible Issues

### Issue 1: Transaction Actually Succeeded
**If explorer shows "Success":**
- The app's API polling is failing
- But your transaction DID work!
- Check your wallet - APT should be deducted
- Refresh the page - product might be marked sold

### Issue 2: Network Mismatch
**If explorer shows "Not Found":**
- Check your Petra wallet is on **Devnet**
- Not Testnet or Mainnet
- Switch network in wallet settings

### Issue 3: Indexer is Very Slow
**If it's been < 60 seconds:**
- This is normal during high traffic
- The app will keep trying for 90 seconds
- Be patient!

### Issue 4: Transaction Failed
**If explorer shows "Failed":**
- Check error message in explorer
- Common causes:
  - Insufficient APT balance
  - Product already sold
  - Invalid seller address

## Step 4: Manual Check via API

Try this in your browser or terminal:

```bash
curl https://api.devnet.aptoslabs.com/v1/transactions/by_hash/0xcaf2271596e1759ffe6a23430d70d32bd9934867d13056a6416c333eace62979
```

**If you get 404:**
- Transaction not indexed yet (wait)
- Or transaction doesn't exist (check hash)

**If you get JSON:**
- Transaction is indexed!
- Check the `success` field
- Look for `"vm_status": "Executed successfully"`

## Step 5: What I Added (Auto-logging)

The new code will now log in console:
```
✅ Transaction found on attempt 3!
📦 Raw response: { ... full JSON ... }
📦 Checking transaction status...
   success field: true
   vm_status: Executed successfully
   type: user_transaction
✅ Transaction confirmed successfully!
```

If you see the raw response but it still says "Confirming...", there's a bug in the success detection.

## Step 6: Force Refresh

If stuck after 90 seconds:
1. Press Ctrl+C to stop the dev server
2. Restart: `npm run dev`
3. Refresh browser
4. Check if product is marked sold

## Quick Fixes

### If it's stuck but transaction succeeded:
```javascript
// Check in browser console:
localStorage.clear();
location.reload();
```

### If you want to see raw API response:
```javascript
// In browser console:
fetch('https://api.devnet.aptoslabs.com/v1/transactions/by_hash/YOUR_HASH')
  .then(r => r.json())
  .then(d => console.log('Transaction:', d))
  .catch(e => console.log('Error:', e));
```

## Expected Console Output (Normal Flow)

```
💳 Submitting transaction to wallet...
🚀 Transaction submitted: 0xcaf2...
⏳ Waiting for blockchain indexer (this is normal)...
Confirming transaction... 3s
Confirming transaction... 6s
Confirming transaction... 9s
✅ Transaction found on attempt 4!
📦 Raw response: { "success": true, ... }
📦 Checking transaction status...
   success field: true
   vm_status: Executed successfully
   type: user_transaction
✅ Transaction confirmed successfully!
```

## Need Help?

1. Copy ALL console output
2. Copy the transaction hash
3. Check what Aptos Explorer shows
4. Report back what you see!

---

**The new code should now show you exactly what's happening!** 🔍
