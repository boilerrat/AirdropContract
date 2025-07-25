import { useAccount, useEnsName, useEnsAvatar } from 'wagmi';

/**
 * Hook to get ENS information for the connected wallet
 */
export function useENS() {
  const { address } = useAccount();
  
  const { data: ensName, isLoading: isLoadingName } = useEnsName({
    address: address as `0x${string}`,
    chainId: 1,
  });

  const { data: ensAvatar, isLoading: isLoadingAvatar } = useEnsAvatar({
    name: ensName || undefined,
    chainId: 1,
  });

  return {
    address,
    ensName: ensName || undefined,
    ensAvatar,
    isLoading: isLoadingName || isLoadingAvatar,
    hasENS: !!ensName,
  };
}

/**
 * Hook to get ENS information for any address
 */
export function useENSForAddress(address: string | undefined) {
  const { data: ensName, isLoading: isLoadingName } = useEnsName({
    address: address as `0x${string}`,
    chainId: 1,
  });

  const { data: ensAvatar, isLoading: isLoadingAvatar } = useEnsAvatar({
    name: ensName || undefined,
    chainId: 1,
  });

  return {
    ensName: ensName || undefined,
    ensAvatar,
    isLoading: isLoadingName || isLoadingAvatar,
    hasENS: !!ensName,
  };
} 