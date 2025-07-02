'use client';

import React from 'react';
import { useENSForAddress } from '@/hooks/useENS';
import { formatAddress } from '@/lib/utils';
import { User, Loader2 } from 'lucide-react';

interface RecipientDisplayProps {
  address: string;
  className?: string;
  showAvatar?: boolean;
}

export function RecipientDisplay({ address, className = '', showAvatar = false }: RecipientDisplayProps) {
  const { ensName, ensAvatar, isLoading, hasENS } = useENSForAddress(address);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showAvatar && ensAvatar ? (
        <img 
          src={ensAvatar} 
          alt="ENS Avatar" 
          className="w-4 h-4 rounded-full"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <User className="h-4 w-4 text-gray-400" />
      )}
      
      <span className="text-sm font-mono text-gray-700">
        {isLoading ? (
          <span className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Loading...
          </span>
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

interface RecipientsListProps {
  addresses: string[];
  className?: string;
  showAvatars?: boolean;
}

export function RecipientsList({ addresses, className = '', showAvatars = false }: RecipientsListProps) {
  if (addresses.length === 0) return null;

  return (
    <div className={`space-y-1 ${className}`}>
      {addresses.map((address, index) => (
        <RecipientDisplay
          key={`${address}-${index}`}
          address={address}
          showAvatar={showAvatars}
        />
      ))}
    </div>
  );
} 