#!/bin/bash

echo "🚀 Setting up Airdrop Manager Mini App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cat > .env.local << EOF
# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Contract address (already configured in lib/contracts.ts)
# NEXT_PUBLIC_CONTRACT_ADDRESS=0x23EaD064d774dA51Ed67ea6F387cD03A2F38e40c
EOF
    echo "⚠️  Please update .env.local with your WalletConnect Project ID"
fi

# Create public directory if it doesn't exist
mkdir -p public

# Create placeholder icon
if [ ! -f public/icon.png ]; then
    echo "🎨 Creating placeholder icon..."
    # Create a simple SVG icon as placeholder
    cat > public/icon.svg << EOF
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="12" fill="#0ea5e9"/>
  <path d="M32 16L40 28H24L32 16Z" fill="white"/>
  <path d="M32 48L24 36H40L32 48Z" fill="white"/>
  <circle cx="32" cy="32" r="4" fill="white"/>
</svg>
EOF
    echo "✅ Created placeholder icon (public/icon.svg)"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your WalletConnect Project ID"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For production deployment:"
echo "1. Update .well-known/farcaster.json with your domain"
echo "2. Deploy to a production domain (not localhost)"
echo "3. Register your Mini App with Farcaster"
echo ""
echo "Happy building! 🚀" 