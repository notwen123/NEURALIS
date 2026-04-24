'use client';

import { useChainId, useSwitchChain, useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { TARGET_CHAIN_ID } from '@/lib/wagmi';

export function GlobalNetworkGuard({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { switchChain } = useSwitchChain();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <>{children}</>;

  // Trigger if connected to WRONG chain, or if we strictly detected Sepolia/Foreign Chain
  const isWrongNetwork = isConnected && chainId !== TARGET_CHAIN_ID;

  if (!isWrongNetwork) return <>{children}</>;

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto" />
        
        <div className="relative z-10 max-w-lg w-full px-6 pointer-events-auto">
          <div className="glass-card p-10 text-center border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.15)]">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 text-4xl animate-pulse">
                !
              </div>
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight text-white mb-4 uppercase">
              Systemic Oversight
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-10">
              Your connection to the Agent Economy is misaligned. To interact with the NEURALIS sovereign ledger, please anchor your wallet to the correct network.
            </p>
            
            <button
              onClick={() => switchChain({ chainId: TARGET_CHAIN_ID })}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Anchor to NEURALIS L2
            </button>
            
            <p className="mt-6 text-[10px] uppercase tracking-widest text-red-500/40 font-black">
              Security Protocol Active · EVM-1 Verification Failed
            </p>
          </div>
        </div>
      </div>
      <div className="opacity-20 pointer-events-none filter blur-sm">
        {children}
      </div>
    </>
  );
}
