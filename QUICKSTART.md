# Quick Start Guide

## 🎯 Get Running in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Server
```bash
npm run dev
```

### Step 3: Open in Browser
Navigate to: **http://localhost:5173**

---

## ✅ Prerequisites Checklist

- [ ] Node.js v18+ installed
- [ ] Petra Wallet browser extension installed ([Get it here](https://petra.app/))
- [ ] Connected to Aptos Devnet in Petra wallet

---

## 🎮 Quick Actions

### Browse Products
1. Open http://localhost:5173
2. Scroll through available products
3. No wallet needed to browse!

### Buy a Product
1. Click "Connect Petra Wallet"
2. Approve the connection
3. Click "Buy Now" on any product
4. Confirm transaction in wallet popup
5. Wait for confirmation (usually ~3-5 seconds)

### Sell a Product
1. Connect Petra Wallet
2. Click "Sell" in navigation
3. Fill in product details
4. Click "List Product"
5. Done! Your product is now live

---

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Check for errors
```

---

## 💡 Quick Tips

1. **No APT tokens?** 
   - Visit [Aptos Faucet](https://www.aptos.dev/en/network/faucet) to get test tokens

2. **Transaction pending?**
   - Transactions take 3-10 seconds on Devnet
   - Check the toast notifications for status

3. **Can't connect wallet?**
   - Ensure Petra extension is installed
   - Refresh the page after installing
   - Make sure you're on Devnet network

4. **Product not updating after purchase?**
   - This is expected - see README for RLS policy setup
   - Transaction is still recorded on-chain

---

## 🎨 What's Running?

When you run `npm run dev`:
- **Frontend**: React app with hot reload
- **Port**: 5173 (http://localhost:5173)
- **Database**: Supabase (already configured)
- **Blockchain**: Aptos Devnet

---

## 📱 Test the App

Try these actions:
1. ✅ Browse products on homepage
2. ✅ Connect Petra wallet
3. ✅ View product details
4. ✅ List a new product (Navigate to /sell)
5. ✅ Purchase a product (requires APT tokens)

---

## 🆘 Need Help?

- **Error messages?** Check the browser console (F12)
- **Wallet issues?** See [Petra Wallet docs](https://petra.app/)
- **More details?** Read the full [README.md](./README.md)

---

**Happy Trading! 🚀**