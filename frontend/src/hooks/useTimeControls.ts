'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { POLICY_REGISTRY_ABI, MOCK_ORACLE_ABI, MOCK_USDC_ABI, ADDRESSES } from '@/config/contracts';

/**
 * Hook for advancing time in the PolicyRegistry.
 */
export function useAdvanceTime() {
  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const advanceTime = (seconds: bigint) => {
    writeContract({
      address: ADDRESSES.policyRegistry,
      abi: POLICY_REGISTRY_ABI,
      functionName: 'advanceTime',
      args: [seconds],
    });
  };

  return { advanceTime, isPending, isSuccess, error, txHash };
}

/**
 * Hook for setting BTC price in MockOracle.
 */
export function useSetBtcPrice() {
  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const setBtcPrice = (price: bigint) => {
    writeContract({
      address: ADDRESSES.mockOracle,
      abi: MOCK_ORACLE_ABI,
      functionName: 'setBtcPrice',
      args: [price],
    });
  };

  return { setBtcPrice, isPending, isSuccess, error, txHash };
}

/**
 * Hook for setting flight status in MockOracle.
 */
export function useSetFlightStatus() {
  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const setFlightStatus = (delayed: boolean) => {
    writeContract({
      address: ADDRESSES.mockOracle,
      abi: MOCK_ORACLE_ABI,
      functionName: 'setFlightStatus',
      args: [delayed],
    });
  };

  return { setFlightStatus, isPending, isSuccess, error, txHash };
}

/**
 * Hook for minting MockUSDC to an address (demo utility).
 */
export function useMintUSDC() {
  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const mint = (to: `0x${string}`, amount: bigint) => {
    writeContract({
      address: ADDRESSES.mockUSDC,
      abi: MOCK_USDC_ABI,
      functionName: 'mint',
      args: [to, amount],
    });
  };

  return { mint, isPending, isSuccess, error, txHash };
}
