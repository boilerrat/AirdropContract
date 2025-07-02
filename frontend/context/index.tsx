'use client';

import { wagmiAdapter, projectId } from '@/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { base } from '@reown/appkit/networks';
import React, { type ReactNode } from 'react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// Set up metadata
const metadata = {
  name: 'Airdrop Manager',
  description: 'Manage token airdrops on Base mainnet with ease',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com',
  icons: [typeof window !== 'undefined' ? `${window.location.origin}/icon.svg` : 'https://yourdomain.com/icon.svg'],
};

// Initialize AppKit
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [base],
  defaultNetwork: base,
  metadata: metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  },
  // Add additional configuration for better compatibility
  options: {
    enableAnalytics: true,
    enableExplorer: true,
  }
});

export default function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  try {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);
    console.log('WagmiAdapter initialized with project ID:', projectId);
    console.log('Initial state:', initialState);
    
    return (
      <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    );
  } catch (error) {
    console.error('Error initializing ContextProvider:', error);
    // Fallback to basic provider if there's an error
    return (
      <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    );
  }
} 