'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { useEnsName, useEnsAddress } from 'wagmi';
import { isValidAddress, isValidENSName, isENSOrAddress } from '@/lib/utils';
import { Search, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ENSAddressInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  className?: string;
  disabled?: boolean;
}

export function ENSAddressInput({
  label = "Address or ENS Name",
  value,
  onChange,
  placeholder = "0x... or name.eth",
  error,
  helperText,
  className = "",
  disabled = false
}: ENSAddressInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [resolvedAddress, setResolvedAddress] = useState<string>('');
  const [resolvedName, setResolvedName] = useState<string>('');
  const [isResolving, setIsResolving] = useState(false);

  // Determine input type
  const inputType = isENSOrAddress(inputValue);

  // Resolve ENS name to address
  const { data: ensAddress, isLoading: isLoadingAddress } = useEnsAddress({
    name: inputType === 'ens' ? inputValue : undefined,
  });

  // Resolve address to ENS name
  const { data: ensName, isLoading: isLoadingName } = useEnsName({
    address: inputType === 'address' ? inputValue as `0x${string}` : undefined,
  });

  // Handle resolution updates
  useEffect(() => {
    if (inputType === 'ens' && ensAddress) {
      setResolvedAddress(ensAddress);
      onChange(ensAddress); // Pass the resolved address to parent
    } else if (inputType === 'address' && ensName) {
      setResolvedName(ensName);
    }
  }, [ensAddress, ensName, inputType, onChange]);

  // Update internal state when external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // If it's a valid address, pass it directly
    if (isValidAddress(newValue)) {
      onChange(newValue);
    } else if (isValidENSName(newValue)) {
      // For ENS names, we'll wait for resolution
      setIsResolving(true);
    } else {
      // For invalid input, pass the raw value
      onChange(newValue);
    }
  };

  // Determine loading state
  const isLoading = isLoadingAddress || isLoadingName || isResolving;

  // Determine validation state
  const isValid = inputType !== 'invalid' && !isLoading;
  const hasENS = !!resolvedName;

  // Generate helper text
  const getHelperText = () => {
    if (isLoading) return 'Resolving...';
    if (inputType === 'invalid' && inputValue) return 'Invalid address or ENS name';
    if (inputType === 'ens' && resolvedAddress) return `Resolved: ${resolvedAddress}`;
    if (inputType === 'address' && hasENS) return `ENS: ${resolvedName}`;
    return helperText || 'Enter an Ethereum address or ENS name';
  };

  // Generate error text
  const getErrorText = () => {
    if (error) return error;
    if (inputType === 'invalid' && inputValue) return 'Invalid format';
    return '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        <Input
          label={label}
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          error={getErrorText()}
          helperText={getHelperText()}
          disabled={disabled}
          className="pr-10"
        />
        
        {/* Status indicator */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : inputValue && isValid ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : inputValue && inputType === 'invalid' ? (
            <AlertCircle className="h-4 w-4 text-red-500" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Additional info display */}
      {inputType === 'address' && hasENS && (
        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
          <CheckCircle className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-blue-700">
            ENS Name: <span className="font-mono">{resolvedName}</span>
          </span>
        </div>
      )}

      {inputType === 'ens' && resolvedAddress && (
        <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-700">
            Resolved Address: <span className="font-mono">{resolvedAddress}</span>
          </span>
        </div>
      )}
    </div>
  );
} 