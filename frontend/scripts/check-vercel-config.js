#!/usr/bin/env node

/**
 * Script to check Vercel configuration and environment variables
 * Run this locally to verify your setup before deploying
 */

console.log('🔍 Checking Vercel Configuration...\n');

// Check environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID'
];

console.log('📋 Environment Variables:');
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: ${value.slice(0, 10)}...`);
  } else {
    console.log(`❌ ${envVar}: Missing`);
  }
});

// Check if we're in a Vercel environment
console.log('\n🌐 Environment:');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`VERCEL: ${process.env.VERCEL ? 'Yes' : 'No'}`);
console.log(`VERCEL_ENV: ${process.env.VERCEL_ENV || 'Not set'}`);

// Check package.json for required dependencies
console.log('\n📦 Checking dependencies...');
try {
  const packageJson = require('../package.json');
  const requiredDeps = [
    '@reown/appkit',
    '@reown/appkit-adapter-wagmi',
    'wagmi',
    '@tanstack/react-query'
  ];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep] || packageJson.devDependencies[dep]}`);
    } else {
      console.log(`❌ ${dep}: Missing`);
    }
  });
} catch (error) {
  console.log('❌ Could not read package.json');
}

console.log('\n🎯 Next Steps:');
console.log('1. Make sure NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is set in Vercel');
console.log('2. Deploy to Vercel with: vercel --prod');
console.log('3. Check the browser console for any errors');
console.log('4. Use the debug component to test wallet connection/disconnection');

console.log('\n🔧 To set environment variables in Vercel:');
console.log('vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID'); 