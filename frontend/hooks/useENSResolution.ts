import { useEnsAddress } from 'wagmi';
import { isValidAddress, isValidENSName } from '@/lib/utils';

/**
 * Hook to resolve a single ENS name to address
 */
export function useENSResolution(input: string) {
  const { data: resolvedAddress, isLoading, error } = useEnsAddress({
    name: isValidENSName(input) ? input : undefined,
    chainId: 1, // Force ENS lookup on Ethereum Mainnet
  });

  return {
    resolvedAddress: resolvedAddress || (isValidAddress(input) ? input : null),
    isLoading,
    error,
    isENS: isValidENSName(input),
    isAddress: isValidAddress(input),
  };
}

/**
 * Hook to resolve multiple ENS names/addresses
 * Returns a map of input -> resolved address
 */
export function useMultipleENSResolution(inputs: string[]) {
  const results = inputs.map(input => useENSResolution(input));
  
  const isLoading = results.some(result => result.isLoading);
  const errors = results.filter(result => result.error).map(result => result.error);
  
  const resolvedMap = new Map<string, string>();
  inputs.forEach((input, index) => {
    const result = results[index];
    if (result.resolvedAddress) {
      resolvedMap.set(input, result.resolvedAddress);
    }
  });

  return {
    resolvedMap,
    isLoading,
    errors,
    allResolved: inputs.every(input => resolvedMap.has(input)),
  };
} 