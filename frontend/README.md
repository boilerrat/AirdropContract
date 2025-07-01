# Airdrop Manager - Farcaster Mini App

A Farcaster Mini App for managing token airdrops on Base mainnet. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🚀 **CSV Upload**: Upload recipient addresses via CSV files
- 💰 **Batch Airdrops**: Execute airdrops to multiple recipients
- 🔗 **Wallet Integration**: Seamless wallet connection with Reown AppKit
- 📱 **Farcaster Ready**: Optimized for Farcaster Mini App ecosystem
- 🎨 **Modern UI**: Beautiful, responsive interface with Tailwind CSS

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- WalletConnect Project ID from [Reown Cloud](https://cloud.reown.com)

### Local Development

1. **Clone and install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your WalletConnect Project ID:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### 1. Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Set Up Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Configure the project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend` (if your frontend is in a subdirectory)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3. Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id
   ```

### 4. Deploy

1. Click **Deploy**
2. Vercel will automatically build and deploy your app
3. Your app will be available at `https://your-project.vercel.app`

### 5. Update Farcaster Manifest

After deployment, update the manifest URLs in `app/api/farcaster-manifest/route.ts`:

```typescript
iconUrl: "https://your-actual-domain.vercel.app/icon.png",
homeUrl: "https://your-actual-domain.vercel.app",
postUrl: "https://your-actual-domain.vercel.app/api/frame",
```

### 6. Register with Farcaster

1. Visit [Farcaster Mini Apps](https://miniapps.farcaster.xyz)
2. Use the manifest tool to register your app
3. Add your deployed domain to the manifest

## CSV Upload Format

The app supports two CSV formats:

### Simple Address List
```csv
address
0x1234567890123456789012345678901234567890
0x0987654321098765432109876543210987654321
```

### Address + Amount List
```csv
address,amount
0x1234567890123456789012345678901234567890,1.5
0x0987654321098765432109876543210987654321,2.0
```

## Smart Contract

This app interacts with an airdrop smart contract deployed on Base mainnet. The contract supports:

- Batch airdrops to multiple recipients
- Same amount or individual amounts per recipient
- ERC20 token transfers
- Owner withdrawal functionality

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Wallet**: Reown AppKit (WalletConnect v3)
- **Blockchain**: Viem, Wagmi v2
- **Network**: Base mainnet
- **Deployment**: Vercel

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, please open an issue on GitHub or reach out to the Farcaster community. 