'use client';

import React, { useState } from 'react';
import { 
  useWriteContract, 
  useWaitForTransactionReceipt, 
  useAccount,
  useBalance,
  useChainId,
  useSwitchChain
} from 'wagmi';
import { parseUnits } from 'viem';
import { toast } from 'sonner';
import { 
  NEXT_PUBLIC_VAULT_MANAGER_ADDRESS, 
  VAULT_MANAGER_ABI, 
  ERC20_ABI,
  getExplorerLink,
  NEXT_PUBLIC_USDC_ADDRESS
} from '@/lib/contracts';
import { TARGET_CHAIN_ID } from '@/lib/wagmi';

const USDC_ADDRESS = NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`;

export function VaultInteraction() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [amount, setAmount] = useState('');
  const isWrongNetwork = isConnected && chainId !== TARGET_CHAIN_ID;

  // 1. Transaction Hooks
  const { writeContract: write, data: hash } = useWriteContract();
  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({ hash });

  // 2. Fetch Balances
  const { data: usdcBalance } = useBalance({
    address,
    token: USDC_ADDRESS,
  });

  // 3. Handlers
  const handleApprove = async () => {
    if (!amount || isNaN(Number(amount))) return;
    try {
      const units = parseUnits(amount, 6);
      toast.info('Requesting Governance Approval...');
      write({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [NEXT_PUBLIC_VAULT_MANAGER_ADDRESS, units],
      }, {
        onSuccess: (txHash) => {
          toast.success('Approval Anchored!', {
            description: 'Execute Deposit to finalize.',
            action: {
              label: 'View',
              onClick: () => window.open(getExplorerLink(txHash), '_blank'),
            }
          });
        },
        onError: (err) => {
          toast.error('Approval Failed', { description: err.message });
        }
      });
    } catch (err: any) {
      toast.error('Hardware Error', { description: err.message });
    }
  };

  const executeVaultDeposit = () => {
    if (!address || !amount) return;
    const units = parseUnits(amount, 6);

    write({
      address: NEXT_PUBLIC_VAULT_MANAGER_ADDRESS as `0x${string}`,
      abi: VAULT_MANAGER_ABI,
      functionName: 'deposit',
      args: [units, address] as const,
    }, {
      onSuccess: (txHash) => {
        toast.success('Strategy Seeded!', {
          description: 'nUSD has been deployed to the vault.',
          action: {
            label: 'Audit',
            onClick: () => window.open(getExplorerLink(txHash), '_blank'),
          }
        });
      },
      onError: (err) => {
        toast.error('Deposit Failed', { description: err.message });
      }
    });
  };

  // Global Popup effect
  React.useEffect(() => {
    if (isSuccess && hash) {
       toast.success('Transaction Settled', {
         description: 'Ledger has been updated.',
         action: {
           label: 'View Scan',
           onClick: () => window.open(getExplorerLink(hash), '_blank'),
         }
       });
    }
  }, [isSuccess, hash]);

  return (
    <div className="p-8 bg-zinc-900/50 backdrop-blur-xl border border-white/5 space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black tracking-[0.3em] text-white/40 uppercase">Capital_Control</span>
        <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-white/60 uppercase">Initia_Settlement_Active</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest pl-1">Input_Strategy_Capital</label>
        <div className="relative group">
          <input 
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-black/40 border border-white/5 p-4 pl-12 text-2xl font-black font-mono focus:border-white/20 focus:outline-none transition-all placeholder:text-white/5"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-black">n</div>
          <button 
            onClick={() => setAmount(usdcBalance?.formatted || '0')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 hover:text-white transition-colors"
          >
            MAX
          </button>
        </div>
        <div className="flex justify-end pt-1">
           <button 
             onClick={() => window.open('https://faucet.testnet.initia.xyz', '_blank')} 
             className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:brightness-125 transition-all"
           >
             + Request Liquidity
           </button>
        </div>
      </div>

      {isWrongNetwork ? (
        <button 
          onClick={() => switchChain({ chainId: TARGET_CHAIN_ID })}
          className="w-full panel-monolith bg-brand text-white p-4 text-[13px] font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all font-bold"
        >
          Switch to NEURALIS Network
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleApprove}
            disabled={!isConnected || isWaiting}
            className="panel-monolith bg-white text-black p-4 text-[13px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all disabled:opacity-50 font-bold"
          >
            Approve
          </button>
          <button 
            onClick={executeVaultDeposit}
            disabled={!isConnected || isWaiting}
            className="panel-monolith bg-transparent border border-white/10 text-white p-4 text-[13px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all disabled:opacity-50 font-bold"
          >
            Deposit
          </button>
        </div>
      )}

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Available_nUSD_Balance</span>
        <span className="text-[11px] font-bold text-white/60 font-mono">
          {usdcBalance ? `${Number(usdcBalance.formatted).toLocaleString()} nUSD` : '0.00 nUSD'}
        </span>
      </div>
    </div>
  );
}
