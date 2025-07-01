# Airdrop Manager - Farcaster Mini App

A modern, user-friendly Farcaster Mini App for managing token airdrops on Base mainnet. Built with Next.js, TypeScript, and the Farcaster Mini App SDK.

## Features

- **Batch Airdrops**: Execute airdrops to multiple recipients with individual or same amounts
- **Farcaster Integration**: Native Farcaster Mini App with seamless wallet connection
- **Real-time Validation**: Live validation of addresses, amounts, and contract state
- **Contract Status**: View contract information, balances, and authorization status
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Base Mainnet**: Optimized for Base network with verified contract

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi + Viem
- **Farcaster**: Mini App SDK
- **UI Components**: Custom components with Lucide React icons
- **State Management**: React Query for data fetching

## Quick Start

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
├── components/            # React components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── .well-known/          # Farcaster manifest
└── public/               # Static assets
```

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect your Ethereum wallet
2. **Enter Token Address**: Paste the ERC20 token contract address
3. **Choose Airdrop Type**: Select "Same Amount" or "Individual Amounts"
4. **Add Recipients**: Enter recipient addresses (one per line)
5. **Set Amounts**: Enter the amount(s) to airdrop
6. **Review & Execute**: Review the summary and execute the airdrop

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push to main

### Manual Deployment

1. Build: `npm run build`
2. Start: `npm start`
3. Upload to your hosting provider

## Farcaster Mini App Features

- **Native Integration**: Seamless integration with Farcaster client
- **Wallet Connection**: Automatic wallet connection in Farcaster environment
- **Social Discovery**: App appears in Farcaster search and directories

## License

MIT License 