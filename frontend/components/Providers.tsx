'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { useAccount, useDisconnect } from 'wagmi';

// Create wagmi config
const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
        {isConnected && (
          <button onClick={handleDisconnect} className="disconnect-button">
            Disconnect Wallet
          </button>
        )}
      </QueryClientProvider>
    </WagmiProvider>
  );
} 