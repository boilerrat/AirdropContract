'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CSVUpload } from '@/components/CSVUpload';
import { useAirdropSameAmount, useAirdropIndividualAmounts, useTokenInfo, useContractTokenBalance } from '@/hooks/useContract';
import { parseRecipients, parseAmounts, formatNumber, isValidAddress, isValidAmount } from '@/lib/utils';
import { Users, Coins, AlertCircle, CheckCircle, Copy, Upload } from 'lucide-react';

interface AirdropFormProps {
  userAddress?: string;
}

export function AirdropForm({ userAddress }: AirdropFormProps) {
  const [tokenAddress, setTokenAddress] = useState('');
  const [recipients, setRecipients] = useState('');
  const [amounts, setAmounts] = useState('');
  const [airdropType, setAirdropType] = useState<'same' | 'individual'>('same');
  const [sameAmount, setSameAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);

  // Contract hooks
  const { executeAirdrop: executeSameAmount, isLoading: sameLoading, isSuccess: sameSuccess, error: sameError } = useAirdropSameAmount();
  const { executeAirdrop: executeIndividual, isLoading: individualLoading, isSuccess: individualSuccess, error: individualError } = useAirdropIndividualAmounts();
  
  // Token info
  const { name: tokenName, symbol: tokenSymbol, decimals } = useTokenInfo(tokenAddress);
  const contractBalance = useContractTokenBalance(tokenAddress);

  const isLoading = sameLoading || individualLoading;
  const isSuccess = sameSuccess || individualSuccess;
  const error = sameError || individualError;

  // Validation
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (tokenAddress && !isValidAddress(tokenAddress)) {
      newErrors.tokenAddress = 'Invalid token address';
    }

    if (recipients) {
      const parsedRecipients = parseRecipients(recipients);
      if (parsedRecipients.length === 0) {
        newErrors.recipients = 'No valid addresses found';
      }
    }

    if (airdropType === 'same') {
      if (sameAmount && !isValidAmount(sameAmount)) {
        newErrors.sameAmount = 'Invalid amount';
      }
    } else {
      if (amounts) {
        const parsedAmounts = parseAmounts(amounts);
        if (parsedAmounts.length === 0) {
          newErrors.amounts = 'No valid amounts found';
        }
      }
    }

    setErrors(newErrors);
  }, [tokenAddress, recipients, amounts, sameAmount, airdropType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);

    try {
      const parsedRecipients = parseRecipients(recipients);
      
      if (airdropType === 'same') {
        if (!sameAmount || !isValidAmount(sameAmount)) {
          setErrors({ sameAmount: 'Invalid amount' });
          return;
        }
        executeSameAmount(tokenAddress, parsedRecipients, sameAmount, decimals);
      } else {
        const parsedAmounts = parseAmounts(amounts);
        if (parsedAmounts.length !== parsedRecipients.length) {
          setErrors({ amounts: 'Number of amounts must match number of recipients' });
          return;
        }
        executeIndividual(tokenAddress, parsedRecipients, parsedAmounts, decimals);
      }
    } catch (err) {
      console.error('Airdrop error:', err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleCopyAddress = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(tokenAddress);
    }
  };

  const handleCSVUpload = (addresses: string[], amounts?: string[]) => {
    setRecipients(addresses.join('\n'));
    if (amounts && amounts.length > 0) {
      setAmounts(amounts.join('\n'));
      setAirdropType('individual');
    }
    setShowCSVUpload(false);
  };

  const parsedRecipients = parseRecipients(recipients);
  const parsedAmounts = parseAmounts(amounts);
  const totalRecipients = parsedRecipients.length;
  const totalAmount = airdropType === 'same' 
    ? (sameAmount ? parseFloat(sameAmount) * totalRecipients : 0)
    : parsedAmounts.reduce((sum, amount) => sum + parseFloat(amount), 0);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary-500" />
          Airdrop Tokens
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Token Address */}
          <div className="space-y-2">
            <Input
              label="Token Contract Address"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x..."
              error={errors.tokenAddress}
              helperText="Enter the ERC20 token contract address"
            />
            
            {tokenAddress && tokenName && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{tokenName} ({tokenSymbol})</p>
                  <p className="text-sm text-gray-600">
                    Contract Balance: {formatNumber(contractBalance, decimals)} {tokenSymbol}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyAddress}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Airdrop Type Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Airdrop Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="same"
                  checked={airdropType === 'same'}
                  onChange={(e) => setAirdropType(e.target.value as 'same' | 'individual')}
                  className="mr-2"
                />
                Same Amount for All
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="individual"
                  checked={airdropType === 'individual'}
                  onChange={(e) => setAirdropType(e.target.value as 'same' | 'individual')}
                  className="mr-2"
                />
                Individual Amounts
              </label>
            </div>
          </div>

          {/* Recipients */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Recipient Addresses
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCSVUpload(!showCSVUpload)}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {showCSVUpload ? 'Hide CSV Upload' : 'Upload CSV'}
              </Button>
            </div>
            
            {showCSVUpload ? (
              <CSVUpload
                onAddressesLoaded={handleCSVUpload}
                currentAddresses={parsedRecipients}
                currentAmounts={parsedAmounts}
              />
            ) : (
              <Textarea
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="0x1234...&#10;0x5678...&#10;0x9abc..."
                error={errors.recipients}
                helperText="Enter one address per line"
              />
            )}
          </div>

          {/* Amount Input */}
          {airdropType === 'same' ? (
            <Input
              label="Amount per Recipient"
              type="number"
              step="any"
              value={sameAmount}
              onChange={(e) => setSameAmount(e.target.value)}
              placeholder="0.0"
              error={errors.sameAmount}
              helperText={`Amount in ${tokenSymbol || 'tokens'} to send to each recipient`}
            />
          ) : (
            <Textarea
              label="Individual Amounts"
              value={amounts}
              onChange={(e) => setAmounts(e.target.value)}
              placeholder="1.5&#10;2.0&#10;0.5"
              error={errors.amounts}
              helperText="Enter one amount per line (must match number of recipients)"
            />
          )}

          {/* Summary */}
          {totalRecipients > 0 && totalAmount > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Airdrop Summary</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p>• Recipients: {totalRecipients}</p>
                <p>• Total Amount: {totalAmount.toFixed(4)} {tokenSymbol}</p>
                <p>• Contract Balance: {formatNumber(contractBalance, decimals)} {tokenSymbol}</p>
                {totalAmount > Number(formatNumber(contractBalance, decimals)) && (
                  <p className="text-red-600 font-medium">
                    ⚠️ Insufficient contract balance
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Transaction Failed</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                {error.message || 'An error occurred during the transaction'}
              </p>
            </div>
          )}

          {/* Success Display */}
          {isSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Airdrop Successful!</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Tokens have been distributed to all recipients
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            loading={isLoading || isValidating}
            disabled={
              !tokenAddress ||
              !recipients ||
              (airdropType === 'same' ? !sameAmount : !amounts) ||
              Object.keys(errors).length > 0 ||
              totalRecipients === 0 ||
              totalAmount === 0
            }
          >
            {isLoading ? 'Processing...' : `Execute Airdrop (${totalRecipients} recipients)`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 