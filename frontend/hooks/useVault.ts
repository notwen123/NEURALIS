'use client';

import { 
  useReadContract, 
  useAccount, 
  useWriteContract, 
  useWaitForTransactionReceipt,
  useChainId
} from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { 
  VAULT_MANAGER_ABI, 
  ERC20_ABI, 
  NEXT_PUBLIC_VAULT_MANAGER_ADDRESS,
  NEXT_PUBLIC_USDC_ADDRESS 
} from '@/lib/contracts';
import { TARGET_CHAIN_ID } from '@/lib/wagmi';

const USDC_DECIMALS = 6;

export function useVault() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const isWrongNetwork = isConnected && chainId !== TARGET_CHAIN_ID;

  const vaultManagerConfig = {
    address: NEXT_PUBLIC_VAULT_MANAGER_ADDRESS as `0x${string}`,
    abi: VAULT_MANAGER_ABI,
  };

  const assetAddress = NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`;

  // 1. Core Data Reads
  const totalAssets = useReadContract({
    ...vaultManagerConfig,
    functionName: 'totalAssets',
    query: { enabled: !isWrongNetwork }
  });

  const totalSupply = useReadContract({
    ...vaultManagerConfig,
    functionName: 'totalSupply',
    query: { enabled: !isWrongNetwork }
  });

  const userShares = useReadContract({
    ...vaultManagerConfig,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !isWrongNetwork }
  });

  // 2. Write Operations
  const { writeContractAsync: writeDeposit } = useWriteContract();
  const { writeContractAsync: writeRedeem } = useWriteContract();
  const { writeContractAsync: writeApprove } = useWriteContract();

  async function deposit(usdcAmount: string) {
    if (!address) throw new Error('Wallet not connected');
    const assets = parseUnits(usdcAmount, USDC_DECIMALS);
    return writeDeposit({
      ...vaultManagerConfig,
      functionName: 'deposit',
      args: [assets, address],
    });
  }

  async function redeem(shareAmount: string) {
    if (!address) throw new Error('Wallet not connected');
    const shares = parseUnits(shareAmount, 18); // Shares usually 18 decimals
    return writeRedeem({
      ...vaultManagerConfig,
      functionName: 'redeem',
      args: [shares, address, address],
    });
  }

  async function approve(usdcAmount: string) {
    const assets = parseUnits(usdcAmount, USDC_DECIMALS);
    return writeApprove({
      address: assetAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [vaultManagerConfig.address, assets],
    });
  }

  const refetch = async () => {
    await Promise.all([
      totalAssets.refetch(),
      totalSupply.refetch(),
      userShares.refetch()
    ]);
  };

  return {
    totalAssets: totalAssets.data,
    totalAssetsFormatted: (!isWrongNetwork && totalAssets.data !== undefined) 
      ? formatUnits(totalAssets.data, USDC_DECIMALS) 
      : '0.00',
    totalSupply: isWrongNetwork ? BigInt(0) : (totalSupply.data ?? BigInt(0)),
    userSharesRaw: isWrongNetwork ? BigInt(0) : (userShares.data ?? BigInt(0)),
    userSharesFormatted: (!isWrongNetwork && userShares.data !== undefined)
      ? formatUnits(userShares.data, 18)
      : '0.00',
    deposit,
    redeem,
    approve,
    refetch,
    isLoading: totalAssets.isLoading || userShares.isLoading,
    assetAddress,
    isWrongNetwork
  };
}
