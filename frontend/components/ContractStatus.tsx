'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useContractReadState, useIsAuthorizedOperator } from '@/hooks/useContract';
import { formatAddress } from '@/lib/utils';
import { Shield, Users, Settings, Copy, ExternalLink } from 'lucide-react';
import { CONTRACT_CONFIG } from '@/lib/contracts';

interface ContractStatusProps {
  userAddress?: string;
}

export function ContractStatus({ userAddress }: ContractStatusProps) {
  const { maxBatchSize, paused, owner } = useContractReadState();
  const isAuthorized = useIsAuthorizedOperator(userAddress || '');

  const handleCopyAddress = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(CONTRACT_CONFIG.address);
    }
  };

  const handleViewOnExplorer = () => {
    window.open(`https://basescan.org/address/${CONTRACT_CONFIG.address}`, '_blank');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary-500" />
          Contract Status
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Contract Address */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-700">Contract Address</p>
            <p className="font-mono text-sm">{formatAddress(CONTRACT_CONFIG.address, 10)}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyAddress}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewOnExplorer}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contract State */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Max Batch Size</span>
            </div>
            <p className="text-lg font-semibold text-blue-800">{maxBatchSize}</p>
          </div>

          <div className={`p-3 rounded-lg ${paused ? 'bg-red-50' : 'bg-green-50'}`}>
            <div className="flex items-center gap-2">
              <Shield className={`h-4 w-4 ${paused ? 'text-red-600' : 'text-green-600'}`} />
              <span className={`text-sm font-medium ${paused ? 'text-red-900' : 'text-green-900'}`}>
                Status
              </span>
            </div>
            <p className={`text-lg font-semibold ${paused ? 'text-red-800' : 'text-green-800'}`}>
              {paused ? 'Paused' : 'Active'}
            </p>
          </div>

          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Owner</span>
            </div>
            <p className="font-mono text-sm text-purple-800">
              {formatAddress(owner, 8)}
            </p>
          </div>
        </div>

        {/* User Authorization Status */}
        {userAddress && (
          <div className={`p-4 rounded-lg border ${isAuthorized ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-center gap-2">
              <Shield className={`h-4 w-4 ${isAuthorized ? 'text-green-600' : 'text-yellow-600'}`} />
              <span className={`font-medium ${isAuthorized ? 'text-green-900' : 'text-yellow-900'}`}>
                Your Authorization Status
              </span>
            </div>
            <p className={`text-sm mt-1 ${isAuthorized ? 'text-green-800' : 'text-yellow-800'}`}>
              {isAuthorized 
                ? 'You are authorized to execute airdrops on this contract.'
                : 'You are not authorized to execute airdrops. Only the owner and authorized operators can perform airdrops.'
              }
            </p>
            {!isAuthorized && (
              <p className="text-xs text-yellow-700 mt-2">
                Contact the contract owner to get authorization.
              </p>
            )}
          </div>
        )}

        {/* Network Info */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Network:</span> Base Mainnet (Chain ID: {CONTRACT_CONFIG.chainId})
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 