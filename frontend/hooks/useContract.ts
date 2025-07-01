import { useContractRead, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
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
  });

  return balance || BigInt(0);
}

/**
 * Hook for airdropping same amount to multiple recipients
 */
export function useAirdropSameAmount() {
  const { data, isPending, isSuccess, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: data,
  });

  const executeAirdrop = (
    tokenAddress: string,
    recipients: string[],
    amount: string,
    decimals: number = 18
  ) => {
    if (!writeContract) return;
    const amountBigInt = stringToBigInt(amount, decimals);
    writeContract({
      ...CONTRACT_CONFIG,
      functionName: 'airdropSameAmount',
      args: [
        tokenAddress as `0x${string}`,
        recipients as `0x${string}`[],
        amountBigInt,
      ],
    });
  };

  return {
    executeAirdrop,
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
    txHash: data,
  };
}

/**
 * Hook for airdropping individual amounts to recipients
 */
export function useAirdropIndividualAmounts() {
  const { data, isPending, isSuccess, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: data,
  });

  const executeAirdrop = (
    tokenAddress: string,
    recipients: string[],
    amounts: string[],
    decimals: number = 18
  ) => {
    if (!writeContract) return;
    const amountsBigInt = amounts.map(amount => stringToBigInt(amount, decimals));
    writeContract({
      ...CONTRACT_CONFIG,
      functionName: 'airdropIndividualAmounts',
      args: [
        tokenAddress as `0x${string}`,
        recipients as `0x${string}`[],
        amountsBigInt,
      ],
    });
  };

  return {
    executeAirdrop,
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
    txHash: data,
  };
}

/**
 * Hook for withdrawing tokens (owner only)
 */
export function useWithdrawTokens() {
  const { data, isPending, isSuccess, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: data,
  });

  const executeWithdraw = (
    tokenAddress: string,
    amount: string,
    decimals: number = 18
  ) => {
    if (!writeContract) return;
    const amountBigInt = stringToBigInt(amount, decimals);
    writeContract({
      ...CONTRACT_CONFIG,
      functionName: 'withdrawTokens',
      args: [tokenAddress as `0x${string}`, amountBigInt],
    });
  };

  return {
    executeWithdraw,
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
    txHash: data,
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
  });

  const { data: symbol } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'symbol',
  });

  const { data: decimals } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  return {
    name: name || '',
    symbol: symbol || '',
    decimals: decimals || 18,
  };
} 