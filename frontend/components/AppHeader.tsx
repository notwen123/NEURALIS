'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useInterwovenKit } from "@initia/interwovenkit-react";
import { usePathname } from "next/navigation";
import { useChainId, useAccount, useSwitchChain } from "wagmi";
import { TARGET_CHAIN_ID } from "@/lib/wagmi";



export const AppHeader = () => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  useEffect(() => { setMounted(true); }, []);
  const { address: evmAddress } = useAccount();
  const { data: usdcBalance } = useBalance({ address: evmAddress as `0x${string}`, token: USDC_ADDRESS });
  const { data: initBalance } = useBalance({ address: evmAddress as `0x${string}` });
  const { address, username, openConnect, openWallet } = useInterwovenKit();
  
  const chainId = useChainId();
  const { isConnected: isEvmConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const isWrongNetwork = isEvmConnected && chainId !== TARGET_CHAIN_ID;



  const NAV_LINKS = [
    { name: 'Vault',     path: '/vault' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Arena',     path: '/arena' },
  ];

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50">
      {/* Main nav — exact mirror of landing page header */}
      <div className="border-b border-white/[0.06]" style={{ background: "rgba(5,5,8,0.92)", backdropFilter: "blur(16px)" }}>
        <div className="container px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">

            {/* Logo — Exact Parity */}
            <Link href="/" className="flex items-center gap-2.5 group cursor-pointer relative">
              <div className="w-8 h-8 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[#2563eb] blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 rounded-full scale-150" />
                <Image 
                  src="/landing/logo.png" 
                  alt="NEURALIS Logo" 
                  width={32} 
                  height={32} 
                  className="w-full h-full object-contain relative z-10 transition-all duration-500 filter group-hover:drop-shadow-[0_0_12px_rgba(37,99,235,0.8)]" 
                />
              </div>
              <span className="font-bold text-base tracking-tight text-white transition-colors duration-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200">
                NEURALIS
              </span>
            </Link>

            {/* Desktop nav — Reverting to EXACT Landing Page Style */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              {NAV_LINKS.map((link) => (
                <Link 
                  key={link.path}
                  href={link.path}
                  className="transition-colors duration-150"
                  style={{ color: pathname === link.path ? "#ffffff" : "rgba(255,255,255,0.45)" }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Identity — Reverting to EXACT Landing Page Button DNA */}
            <div className="hidden md:flex items-center gap-4">
              {isEvmConnected && (
                <div className="flex flex-col items-end px-3 py-1 bg-white/5 border border-white/5 rounded-lg">
                  <span className="text-[9px] font-black text-white/20 uppercase">Vault_Liquidity</span>
                  <span className="text-[11px] font-bold text-white/70 font-mono">
                    {usdcBalance ? `${Number(usdcBalance.formatted).toFixed(2)} USDC` : '0.00 USDC'}
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
                className={`inline-flex items-center gap-1.5 text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] ${isWrongNetwork ? 'animate-pulse' : ''}`}
                style={{ 
                  background: isWrongNetwork 
                    ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" 
                    : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", 
                  boxShadow: isWrongNetwork 
                    ? "0 0 25px rgba(239,68,68,0.5)" 
                    : "0 0 20px rgba(37,99,235,0.4)" 
                }}
              >
                {isWrongNetwork ? (
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    SWITCH TO NEURALIS
                  </span>
                ) : (
                  address ? (username ? username : `${address.slice(0, 6)}...${address.slice(-4)}`) : "Connect Wallet"
                )}
                {!isWrongNetwork && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
