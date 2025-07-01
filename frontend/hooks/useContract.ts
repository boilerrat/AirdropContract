import { useContractRead, useContractWrite, useTransactionReceipt } from 'wagmi';
import { CONTRACT_CONFIG, ERC20_ABI } from '@/lib/contracts';
import { stringToBigInt, bigIntToString } from '@/lib/utils';

/**
 * Hook for reading contract state
 */
export function useContractReadState() {
  const { data: maxBatchSize } = useContractRead({
    ...CONTRACT_CONFIG,
    functionName: 'maxBatchSize',
  });

  const { data: paused } = useContractRead({
    ...CONTRACT_CONFIG,
    functionName: 'paused',
  });

  const { data: owner } = useContractRead({
    ...CONTRACT_CONFIG,
    functionName: 'owner',
  });

  return {
    maxBatchSize: maxBatchSize ? Number(maxBatchSize) : 100,
    paused: paused || false,
    owner: owner || '',
  };
}

/**
 * Hook for checking if an address is an authorized operator
 */
export function useIsAuthorizedOperator(address: string) {
  const { data: isAuthorized } = useContractRead({
    ...CONTRACT_CONFIG,
    functionName: 'isAuthorizedOperator',
    args: [address as `0x${string}`],
    enabled: !!address,
  });

  return isAuthorized || false;
}

/**
 * Hook for getting token balance in the contract
 */
export function useContractTokenBalance(tokenAddress: string) {
  const { data: balance } = useContractRead({
    ...CONTRACT_CONFIG,
    functionName: 'getTokenBalance',
    args: [tokenAddress as `0x${string}`],
    enabled: !!tokenAddress,
  });

  return balance || BigInt(0);
}

/**
 * Hook for airdropping same amount to multiple recipients
 */
export function useAirdropSameAmount() {
  const { data, write, isLoading, error } = useContractWrite({
    ...CONTRACT_CONFIG,
    functionName: 'airdropSameAmount',
  });

  const { isLoading: isConfirming, isSuccess } = useTransactionReceipt({
    hash: data?.hash,
  });

  const executeAirdrop = (
    tokenAddress: string,
    recipients: string[],
    amount: string,
    decimals: number = 18
  ) => {
    if (!write) return;
    
    const amountBigInt = stringToBigInt(amount, decimals);
    write({
      args: [
        tokenAddress as `0x${string}`,
        recipients as `0x${string}`[],
        amountBigInt,
      ],
    });
  };

  return {
    executeAirdrop,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
    hash: data?.hash,
  };
}

/**
 * Hook for airdropping individual amounts to recipients
 */
export function useAirdropIndividualAmounts() {
  const { data, write, isLoading, error } = useContractWrite({
    ...CONTRACT_CONFIG,
    functionName: 'airdropIndividualAmounts',
  });

  const { isLoading: isConfirming, isSuccess } = useTransactionReceipt({
    hash: data?.hash,
  });

  const executeAirdrop = (
    tokenAddress: string,
    recipients: string[],
    amounts: string[],
    decimals: number = 18
  ) => {
    if (!write) return;
    
    const amountsBigInt = amounts.map(amount => stringToBigInt(amount, decimals));
    write({
      args: [
        tokenAddress as `0x${string}`,
        recipients as `0x${string}`[],
        amountsBigInt,
      ],
    });
  };

  return {
    executeAirdrop,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
    hash: data?.hash,
  };
}

/**
 * Hook for withdrawing tokens (owner only)
 */
export function useWithdrawTokens() {
  const { data, write, isLoading, error } = useContractWrite({
    ...CONTRACT_CONFIG,
    functionName: 'withdrawTokens',
  });

  const { isLoading: isConfirming, isSuccess } = useTransactionReceipt({
    hash: data?.hash,
  });

  const executeWithdraw = (
    tokenAddress: string,
    amount: string,
    decimals: number = 18
  ) => {
    if (!write) return;
    
    const amountBigInt = stringToBigInt(amount, decimals);
    write({
      args: [tokenAddress as `0x${string}`, amountBigInt],
    });
  };

  return {
    executeWithdraw,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
    hash: data?.hash,
  };
}

/**
 * Hook for getting ERC20 token info
 */
export function useTokenInfo(tokenAddress: string) {
  const { data: name } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'name',
    enabled: !!tokenAddress,
  });

  const { data: symbol } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'symbol',
    enabled: !!tokenAddress,
  });

  const { data: decimals } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
    enabled: !!tokenAddress,
  });

  return {
    name: name || '',
    symbol: symbol || '',
    decimals: decimals || 18,
  };
} 