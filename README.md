## Contract Address
0x606ab54655e0dfe17fe1031411d8636dc75e1cba6d2b2ab40504649030656880

# P2P E-Commerce Marketplace on Aptos Blockchain

A decentralized peer-to-peer marketplace built on the Aptos blockchain with optional EVM/MetaMask support. Buy and sell products using cryptocurrency with secure, transparent transactions.

![Marketplace Banner](./src/logo.png)

## 🚀 Features

- **Dual Wallet Support**: Connect with Petra Wallet (Aptos) or MetaMask (EVM)
- **Product Marketplace**: Browse, buy, and sell products with beautiful UI
- **Blockchain Transactions**: Secure payments using APT tokens
- **Real-time Updates**: Product status updates stored in Supabase
- **Responsive Design**: Beautiful lavender-themed UI with Framer Motion animations
- **Transaction Retry Logic**: Automatic retry on gas estimation failures

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (Build Tool)
- TailwindCSS (Styling)
- Framer Motion (Animations)
- React Router (Navigation)

### Blockchain
- Aptos SDK (@aptos-labs/ts-sdk)
- Petra Wallet Adapter
- Ethers.js v6 (MetaMask support)

### Backend
- Supabase (PostgreSQL database)
- Row Level Security (RLS) policies

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Petra Wallet browser extension (for Aptos transactions)
- MetaMask browser extension (optional, for EVM transactions)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   cd /home/linux/Desktop/web3-hackathon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   The `.env` file is already configured with Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://phrmchigtabmmozhsjuz.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   DATABASE_URL=your_database_url
   ```

4. **Database Setup** (if needed)
   
   The Supabase database is already configured. If you need to apply migrations:
   ```bash
   # Apply migrations using the script
   ./scripts/apply_supabase_migrations.sh
   
   # Or insert dummy products
   psql $DATABASE_URL -f scripts/insert_dummy_products.sql
   ```

## 🚀 Running the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   
   Navigate to: **http://localhost:5173**

3. **Connect Your Wallet**
   - Click "Connect Petra Wallet" to connect your Aptos wallet
   - Or click "Connect MetaMask" for EVM wallet (optional)

## 📱 Usage

### Browsing Products
1. The homepage displays all active products
2. Products show price in APT (Aptos tokens)
3. Featured product is highlighted at the top

### Buying Products
1. Connect your Petra or MetaMask wallet
2. Click "Buy Now" on any product
3. Approve the transaction in your wallet
4. Wait for blockchain confirmation
5. Product status updates to "sold"

### Selling Products
1. Connect your Petra wallet
2. Navigate to the "Sell" page
3. Fill in product details:
   - Product name
   - Description
   - Price (in APT)
   - Image URL
4. Click "List Product"
5. Product appears in the marketplace

## 🗂️ Project Structure

```
web3-hackathon/
├── src/
│   ├── components/
│   │   ├── WalletConnect.tsx       # Petra wallet connector
│   │   ├── EvmWalletConnect.tsx    # MetaMask connector
│   │   ├── ProductCard.tsx         # Product display card
│   │   └── SellProductForm.tsx     # Product listing form
│   ├── lib/
│   │   ├── aptosClient.ts          # Aptos blockchain client
│   │   ├── supabase.ts             # Supabase client
│   │   └── transactions.ts         # Transaction service
│   ├── types/
│   │   └── supabase.ts             # Database types
│   ├── App.tsx                     # Main application
│   ├── config.ts                   # Configuration
│   └── main.tsx                    # Entry point
├── supabase/
│   └── migrations/                 # Database migrations
├── scripts/
│   ├── insert_dummy_products.sql   # Sample data
│   └── apply_supabase_migrations.sh
└── docs/
    └── EVMMetaMask.md              # EVM integration docs
```

## 🔑 Key Features Explained

### Transaction Service
- Automatic retry on gas estimation failures
- Exponential backoff for transaction confirmation
- Handles "transaction not found" errors gracefully
- Configurable gas options

### Wallet Integration
- **Petra Wallet**: Primary wallet for Aptos blockchain
- **MetaMask**: Optional EVM wallet support
- Both can be connected simultaneously
- Automatic address validation

### Database Schema
```sql
products table:
  - id (uuid, primary key)
  - name (text)
  - description (text)
  - price (numeric)
  - image_url (text)
  - seller_address (text)
  - created_at (timestamptz)
  - status ('active' or 'sold')
```

## 🎨 Customization

### Changing Theme Colors
Edit `tailwind.config.js`:
```js
colors: {
  lavender: {
    50: '#f5f3ff',
    // ... customize colors
  }
}
```

### Configuring Blockchain Network
Edit `src/lib/aptosClient.ts`:
```typescript
const config = new AptosConfig({ network: Network.DEVNET });
// Change to Network.MAINNET for production
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🐛 Troubleshooting

### Wallet Connection Issues
- Ensure Petra wallet extension is installed
- Refresh the page after installing the wallet
- Check wallet is connected to Devnet

### Transaction Failures
- Ensure sufficient APT balance in your wallet
- Check network connectivity
- Wait for previous transactions to confirm

### Database Errors
- Verify Supabase credentials in `.env`
- Check RLS policies allow your operations
- Review console logs for detailed errors

## 🔐 Security Notes

- Never commit `.env` files to version control
- Use Row Level Security (RLS) in production
- Validate all user inputs
- Use HTTPS in production

## 📚 Resources

- [Aptos Documentation](https://aptos.dev/)
- [Petra Wallet](https://petra.app/)
- [Supabase Documentation](https://supabase.com/docs)
- [TailwindCSS](https://tailwindcss.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For issues or questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

---

**Built with ❤️ for the Web3 Hackathon**

🌐 **App is now running at: http://localhost:5173**
