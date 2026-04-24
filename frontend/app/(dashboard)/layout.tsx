'use client';

import { ReactNode } from 'react';
import { useInterwovenKit } from '@initia/interwovenkit-react';
import { LayoutDashboard, Wallet, Shield, Zap, Activity, Users, Settings, Database, HelpCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface SidebarItemProps {
  icon: any;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => (
  <Link 
    href={href}
    className={`
      flex items-center gap-3 px-4 py-2.5 rounded-sm transition-all duration-200 group
      ${active ? 'bg-white/[0.04] text-white border-r-2 border-blue-500' : 'text-white/40 hover:bg-white/[0.02] hover:text-white/70'}
    `}
  >
    <Icon size={18} className={active ? 'text-blue-500' : 'text-current'} />
    <span className="text-[13px] font-bold uppercase tracking-[0.24em]">{label}</span>
  </Link>
);

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { address, username, openConnect, openWallet } = useInterwovenKit();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-screen bg-[#050508] text-white overflow-hidden">
      
      {/* ── Global Institutional Sidebar ────────────────────────────────── */}
      <aside className="w-[300px] border-r border-white/[0.12] flex flex-col bg-[#050508] z-50">
        
        {/* BRAND CONTEXT - CRYSTAL GLOW PASS (h-20) */}
        <div className="h-20 flex items-center px-10 border-b border-white/[0.08] bg-white/[0.01] group cursor-pointer relative overflow-hidden">
           {/* Crystal Glow Backdrop */}
           <div className="absolute left-10 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#2563eb] blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 rounded-full scale-[2.5] pointer-events-none" />
           
           <div className="flex items-center gap-4 relative z-10">
              <img src="/landing/logo.png" alt="Neuralis Logo" className="w-8 h-8 object-contain transition-transform duration-500 group-hover:scale-110" />
              <div className="flex flex-col">
                 <span className="text-[15px] font-bold tracking-[0.2em] text-white/94 uppercase leading-none transition-colors duration-500 group-hover:text-white">Neuralis</span>
                 <span className="text-[9px] font-bold text-white/20 tracking-[0.4em] uppercase mt-1.5 transition-colors duration-500 group-hover:text-white/40">Sovereign_OS</span>
              </div>
           </div>
        </div>

        {/* NAVIGATION DECK - 4 OPERATIONAL PILLARS */}
        <nav className="flex-1 p-8 space-y-3">
           <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" active={pathname === '/dashboard'} />
           <SidebarItem icon={Wallet} label="Vaults" href="/vault" active={pathname === '/vault'} />
           <SidebarItem icon={Zap} label="Arena" href="/arena" active={pathname === '/arena'} />
           <SidebarItem icon={Settings} label="System" href="#" active={pathname === '/system'} />
        </nav>
      </aside>

      {/* ── Main Operational Viewport ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Global Top Action Bar - LIVE CONNECTIVITY PASS (h-20) */}
        <header className="h-20 border-b border-white/[0.12] flex items-center justify-end px-10 bg-black/40 backdrop-blur-md">
           <div className="flex items-center gap-10">
              <div className="flex items-center gap-4 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/5 px-4 py-1.5 border border-emerald-500/10">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                 Secure_Session
              </div>
              
              <button
                onClick={address ? openWallet : openConnect}
                className="flex items-center gap-6 px-6 py-2 border border-white/[0.08] bg-white/[0.02] panel-monolith font-mono group transition-all duration-300 hover:bg-white/[0.04]"
              >
                 <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest border-r border-white/10 pr-6 group-hover:text-white/60">ROOT_USER</span>
                 <span className="text-[12px] text-white/94 tracking-tighter flex items-center gap-3 font-bold">
                    {mounted && address ? (username ? username : `${address.slice(0, 6)}...${address.slice(-4)}`) : "CONNECT_TERMINAL"}
                    <ChevronRight size={14} className="text-white/20 group-hover:text-blue-500 transition-colors" />
                 </span>
              </button>
           </div>
        </header>

        {/* Scrollable Dashboard Space */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
           {children}
        </main>
        
      </div>

    </div>
  );
}
