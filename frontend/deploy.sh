#!/bin/bash

# Airdrop Manager - Vercel Deployment Script
echo "🚀 Preparing Airdrop Manager for Vercel deployment..."

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "Please create .env.local with your WalletConnect Project ID:"
    echo "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run type check
echo "🔍 Running type check..."
npm run type-check

# Build the project
echo "🏗️  Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Your project is ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub/GitLab/Bitbucket"
    echo "2. Go to https://vercel.com and create a new project"
    echo "3. Import your repository"
    echo "4. Set the root directory to 'frontend' (if needed)"
    echo "5. Add environment variable: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"
    echo "6. Deploy!"
    echo ""
    echo "After deployment, don't forget to:"
    echo "- Update the manifest URLs in app/api/farcaster-manifest/route.ts"
    echo "- Register your app with Farcaster Mini Apps"
else
    echo "❌ Build failed! Please fix the errors above."
    exit 1
fi 