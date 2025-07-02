'use client';

import React from 'react';
import { Wallet } from 'lucide-react';
import { useENS } from '@/hooks/useENS';
import { formatAddress } from '@/lib/utils';

interface WalletDisplayProps {
  className?: string;
  showAvatar?: boolean;
}

export function WalletDisplay({ className = '', showAvatar = true }: WalletDisplayProps) {
  const { address, ensName, ensAvatar, isLoading, hasENS } = useENS();

  if (!address) return null;

  return (
    <div className={`flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg ${className}`}>
      {showAvatar && ensAvatar ? (
        <img 
          src={ensAvatar} 
          alt="ENS Avatar" 
          className="w-4 h-4 rounded-full"
          onError={(e) => {
            // Fallback to wallet icon if avatar fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <Wallet className="h-4 w-4 text-gray-600" />
      )}
      
      <span className="text-sm font-mono text-gray-700">
        {isLoading ? (
          <span className="animate-pulse">Loading...</span>
        ) : hasENS ? (
          <span className="flex items-center gap-1">
            <span className="text-blue-600 font-medium">{ensName}</span>
            <span className="text-gray-400">({formatAddress(address, 4)})</span>
          </span>
        ) : (
          formatAddress(address, 6)
        )}
      </span>
    </div>
  );
} 