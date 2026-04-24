'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  useChainId, 
  useAccount, 
  useSwitchChain, 
  useBalance 
} from 'wagmi';
import { useInterwovenKit } from '@initia/interwovenkit-react';
import { TARGET_CHAIN_ID } from '@/lib/wagmi';
import { NEXT_PUBLIC_USDC_ADDRESS } from '@/lib/contracts';

const USDC_ADDRESS = NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`;

export function AppHeader() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  useEffect(() => { setMounted(true); }, []);

  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { data: usdcBalance } = useBalance({ address: evmAddress as `0x${string}`, token: USDC_ADDRESS });
  const { data: initBalance } = useBalance({ address: evmAddress as `0x${string}` });
  
  const { address, username, openConnect, openWallet } = useInterwovenKit();
  
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const isWrongNetwork = isEvmConnected && chainId !== TARGET_CHAIN_ID;

  const NAV_LINKS = [
    { name: 'Vault',     path: '/vault' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Arena',     path: '/arena' },
    { name: 'System',    path: '/system' },
  ];

  if (!mounted) return null;

  return (
    <header className="h-[72px] border-b border-white/5 bg-black/40 backdrop-blur-2xl px-8 flex items-center justify-between sticky top-0 z-[100]">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-brand flex items-center justify-center rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xs">N</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-black tracking-tighter text-white uppercase italic">Neuralis</span>
            <span className="text-[9px] font-bold text-white/30 tracking-[0.3em] uppercase leading-none">Sovereign_OS</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link 
              key={link.path}
              href={link.path}
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-white ${pathname === link.path ? 'text-white border-b-2 border-brand pb-1' : 'text-white/40'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              {isEvmConnected && (
                <div className="flex flex-col items-end px-3 py-1 bg-white/5 border border-white/5 rounded-lg">
                  <span className="text-[9px] font-black text-white/20 uppercase">Vault_Liquidity</span>
                  <span className="text-[11px] font-bold text-white/70 font-mono">
                    {usdcBalance ? `${Number(usdcBalance.formatted).toFixed(2)} nUSD` : '0.00 nUSD'}
                  </span>
                  <div className="w-full h-[1px] bg-white/5 my-1" />
                  <span className="text-[9px] font-black text-white/20 uppercase leading-none">Gas_Reserves</span>
                  <span className="text-[10px] font-bold text-blue-400 font-mono">
                    {initBalance ? `${Number(initBalance.formatted).toFixed(4)} INIT` : '0.0000 INIT'}
                  </span>
                </div>
              )}
              <button
                onClick={isWrongNetwork ? () => switchChain({ chainId: TARGET_CHAIN_ID }) : (address ? openWallet : openConnect)}
                className={`inline-flex items-center gap-1.5 text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] ${isWrongNetwork ? 'bg-red-600/20 text-red-500 border border-red-500/30 animate-pulse' : 'bg-white/5 border border-white/10 select-none hover:bg-white/10'}`}
              >
                {isWrongNetwork ? (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    SWITCH TO NEURALIS
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                    {address ? (username ? username : `${address.slice(0, 6)}...${address.slice(-4)}`) : "CONNECT WALLET"}
                  </>
                )}
              </button>
            </div>
      </div>
    </header>
  );
}
