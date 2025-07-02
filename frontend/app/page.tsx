'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { AirdropForm } from '@/components/AirdropForm';
import { ContractStatus } from '@/components/ContractStatus';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatAddress } from '@/lib/utils';
import { 
  Wallet, 
  Users, 
  Coins, 
  Shield, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';

console.log('WalletConnect Project ID:', process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID);

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'airdrop' | 'status'>('airdrop');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Airdrop Manager</h1>
                <p className="text-sm text-gray-600">Farcaster Mini App</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isConnected ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <Wallet className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-mono text-gray-700">
                    {formatAddress(address || '', 6)}
                  </span>
                </div>
              ) : (
                <w3m-button />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Powered by Farcaster
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Your Token Airdrops
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Execute batch airdrops to multiple recipients with ease. 
            Built for the Farcaster community on Base mainnet.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('airdrop')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'airdrop'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Coins className="h-4 w-4 inline mr-2" />
              Airdrop
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'status'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="h-4 w-4 inline mr-2" />
              Contract Status
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'airdrop' ? (
            <div className="space-y-8">
              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Max Batch Size</p>
                        <p className="text-lg font-semibold text-gray-900">100</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Coins className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Network</p>
                        <p className="text-lg font-semibold text-gray-900">Base</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Contract</p>
                        <p className="text-lg font-semibold text-gray-900">Verified</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Airdrop Form */}
              <AirdropForm userAddress={address} />
            </div>
          ) : (
            <ContractStatus userAddress={address} />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://basescan.org/address/0x23EaD064d774dA51Ed67ea6F387cD03A2F38e40c', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Contract
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://github.com/your-repo/airdrop-contract', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Source Code
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Built with ❤️ for the Farcaster community
          </p>
        </footer>
      </main>
    </div>
  );
} 