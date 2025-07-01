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

const metadata = {
  name: 'Airdrop MiniApp',
  description: 'Manage token airdrops on Base mainnet with ease',
  url: 'https://yourdomain.com', // <-- update to your production domain
  icons: ['https://yourdomain.com/icon.png'],
};

// Initialize AppKit
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [base],
  defaultNetwork: base,
  metadata,
  features: { analytics: true },
});

export default function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
} 