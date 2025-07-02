'use client';

import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useENS } from '@/hooks/useENS';

export function WalletDebug() {
  const { address, isConnected, status } = useAccount();
  const { disconnect } = useDisconnect();
  const { ensName, ensAvatar, hasENS, isLoading } = useENS();

  const handleForceDisconnect = () => {
    try {
      // Clear all wallet-related storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        // Force reload the page
        window.location.reload();
      }
    } catch (error) {
      console.error('Force disconnect failed:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg max-w-sm">
      <h3 className="font-semibold text-sm mb-2">Wallet Debug Info</h3>
      <div className="text-xs space-y-1">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}</p>
        <p><strong>Address:</strong> {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'None'}</p>
        <p><strong>ENS Name:</strong> {isLoading ? 'Loading...' : hasENS ? ensName : 'None'}</p>
        <p><strong>ENS Avatar:</strong> {ensAvatar ? 'Yes' : 'No'}</p>
        <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ? 'Set' : 'Missing'}</p>
        <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
      </div>
      <div className="mt-3 space-y-2">
        <button
          onClick={() => disconnect()}
          className="w-full px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
        >
          Normal Disconnect
        </button>
        <button
          onClick={handleForceDisconnect}
          className="w-full px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
        >
          Force Disconnect
        </button>
      </div>
    </div>
  );
} 