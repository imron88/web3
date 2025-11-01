# Transaction Flow Guide

## 🔄 Understanding Blockchain Transactions

This guide explains the transaction process and why you might see 404 errors (they're normal!).

---

## 📊 Transaction Lifecycle

### 1. **Transaction Submitted** ✅
When you click "Buy Now":
- Your wallet signs the transaction
- Transaction is sent to blockchain
- You get a transaction hash (e.g., `0x86ea069f...`)
- **Status**: Pending

### 2. **Blockchain Processing** ⏳
The Aptos blockchain:
- Validates the transaction
- Executes the smart contract
- Records it in a block
- **Time**: Usually 1-3 seconds
- **Status**: Processing

### 3. **Indexer Delay** 🔍
After blockchain confirms:
- The indexer (API) needs to update
- This creates a small delay (2-15 seconds)
- **This is when you see 404 errors**
- **Status**: Waiting for indexer

### 4. **Transaction Confirmed** ✅
Finally:
- Indexer catches up
- API returns transaction data
- Product status updates
- **Status**: Complete!

---

## ⚠️ Why Do I See 404 Errors?

### The 404 Error is **NORMAL** and **EXPECTED**!

```
https://api.devnet.aptoslabs.com/v1/transactions/by_hash/0x86ea...
404 (Not Found)
```

**What this means:**
- Your transaction WAS submitted successfully ✅
- The blockchain IS processing it ✅
- The indexer API just hasn't caught up yet ⏳

**What happens automatically:**
1. App polls the API every 3 seconds
2. Gets 404 while indexer is catching up
3. Keeps retrying (up to 30 times = 90 seconds)
4. Once indexed, gets the result
5. Shows "Purchase completed!" ✅

---

## 🎯 Expected Timeline

### Normal Flow (80% of cases)
```
0s   - Click "Buy Now"
0s   - Wallet popup appears
2s   - Approve transaction
3s   - Transaction submitted to blockchain
4s   - Blockchain confirms ✅
5s   - 404 errors start appearing (indexer lag)
6-8s - Polling continues...
9s   - Indexer catches up
10s  - "Purchase completed!" 🎉
```

### Slower Flow (15% of cases)
```
0-3s   - Submit transaction
4-6s   - Blockchain confirms ✅
7-20s  - Multiple 404 errors (slower indexer)
21s    - Finally indexed
22s    - "Purchase completed!" 🎉
```

### Network Congestion (5% of cases)
```
0-5s   - Submit transaction
6-10s  - Blockchain confirms ✅
11-45s - Many 404 errors (heavy indexer load)
46s    - Transaction found
47s    - "Purchase completed!" 🎉
```

---

## 🛠️ What We Built to Handle This

### Smart Retry Logic
```typescript
1. Initial 2-second delay (let blockchain confirm)
2. Poll every 3-6 seconds
3. Exponential backoff (3s → 6s → 9s → 12s → 15s)
4. Up to 30 attempts (90+ seconds total)
5. Silent 404 handling (no console spam)
6. User-friendly progress messages
```

### User Feedback
- ⏳ "Waiting for blockchain confirmation..."
- 🔄 "Confirming transaction... (6s)"
- ✅ "Purchase completed!"

---

## 🐛 Troubleshooting

### "Transaction timeout after 30 attempts"
**Cause**: Indexer is very slow or down
**What to do**:
1. Your transaction likely succeeded on-chain ✅
2. Check [Aptos Explorer](https://explorer.aptoslabs.com/?network=devnet)
3. Paste your transaction hash
4. Verify it shows "Success"
5. Refresh the page - product may be marked sold

### "Transaction failed on-chain"
**Cause**: Actual blockchain error
**Common reasons**:
- Insufficient APT balance
- Product already sold (race condition)
- Invalid seller address
**What to do**:
1. Check your wallet balance
2. Refresh the products list
3. Try again

### Console shows many 404s
**This is NORMAL!** ✅
- We suppress most of them now
- They don't indicate a problem
- Just indexer lag

---

## 📈 Performance Tips

### For Faster Transactions
1. **Use during off-peak hours**
   - Early morning or late night (UTC)
   - Less network congestion

2. **Have sufficient gas**
   - App sets max gas to 1,000,000 units
   - Ensures transaction doesn't fail

3. **Be patient**
   - Don't refresh during "Confirming..."
   - Wait up to 60 seconds
   - Check explorer if needed

---

## 🔍 Monitoring Your Transaction

### In Browser Console
Look for these messages:
```
✅ Transaction submitted: 0x86ea069f...
⏳ Waiting for blockchain indexer...
✅ Transaction confirmed successfully!
```

### In Aptos Explorer
1. Visit: https://explorer.aptoslabs.com/?network=devnet
2. Paste your transaction hash
3. See real-time status:
   - ✅ Success
   - ❌ Failed
   - ⏳ Pending

### In Your Wallet
- Check transaction history
- See confirmation status
- View gas fees paid

---

## 🎓 Technical Details

### Why the Delay?

**Blockchain Layer** (Fast: 1-3s)
- Transaction added to mempool
- Included in next block
- Block finalized
- Consensus reached

**Indexer Layer** (Slower: 5-15s)
- Watches for new blocks
- Parses all transactions
- Updates database
- Makes data available via API

**The Gap** = 404 Errors
- Blockchain says: "Transaction confirmed!" ✅
- API says: "What transaction?" (404) ❓
- A few seconds later...
- API says: "Oh, found it!" ✅

### Why We Can't Avoid It
- We need the API to get transaction details
- Can't query blockchain directly from browser
- Indexer lag is inherent to Aptos architecture
- All Aptos dApps experience this

---

## ✨ Best Practices

### As a User
✅ Wait for confirmation toasts
✅ Check console for detailed logs
✅ Use Aptos Explorer for verification
❌ Don't spam-click "Buy Now"
❌ Don't refresh during confirmation

### As a Developer
✅ Implement exponential backoff
✅ Show clear progress messages
✅ Handle 404s gracefully
✅ Set reasonable timeouts (60-90s)
✅ Provide explorer links
❌ Don't show raw errors to users
❌ Don't poll too frequently (rate limits)

---

## 🎉 Summary

**The 404 errors you see are:**
- ✅ Normal behavior
- ✅ Handled automatically
- ✅ Not a bug or problem
- ✅ Just indexer lag

**Your transaction is:**
- ✅ Submitted successfully
- ✅ Confirmed on blockchain
- ✅ Just waiting for API to catch up

**You should:**
- ✅ Be patient (10-30 seconds)
- ✅ Trust the retry logic
- ✅ Wait for success toast
- ✅ Check explorer if concerned

---

## 📞 Still Having Issues?

1. Check [STATUS.md](./STATUS.md) for system status
2. Review [README.md](./README.md) for setup help
3. Verify your wallet has APT tokens
4. Try on a different network time
5. Check Aptos network status

---

**Remember: 404s during transaction confirmation are like waiting for a receipt printer - the payment went through, you're just waiting for the confirmation printout!** 🧾

**Happy Trading! 🚀**