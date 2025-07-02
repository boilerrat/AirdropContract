import { useAccount, useEnsName, useEnsAvatar } from 'wagmi';

/**
 * Hook to get ENS information for the connected wallet
 */
export function useENS() {
  const { address } = useAccount();
  
  const { data: ensName, isLoading: isLoadingName } = useEnsName({
    address: address as `0x${string}`,
  });

  const { data: ensAvatar, isLoading: isLoadingAvatar } = useEnsAvatar({
    name: ensName || undefined,
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
  });

  const { data: ensAvatar, isLoading: isLoadingAvatar } = useEnsAvatar({
    name: ensName || undefined,
  });

  return {
    ensName: ensName || undefined,
    ensAvatar,
    isLoading: isLoadingName || isLoadingAvatar,
    hasENS: !!ensName,
  };
} 