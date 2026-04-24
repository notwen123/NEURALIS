'use client';

import { useEffect, useState } from 'react';
import { useVault } from '@/hooks/useVault';
import { useRebalanceHistory } from '@/hooks/useRebalanceHistory';

import { MetricStrip } from '@/components/dashboard/MetricStrip';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { SystemLog } from '@/components/dashboard/SystemLog';
import { ExecutionDeck } from '@/components/dashboard/ExecutionDeck';
import { AllocationMatrix } from '@/components/AllocationMatrix';
import { BadgeGallery } from '@/components/dashboard/BadgeGallery';
import { RiskGauge } from '@/components/dashboard/RiskGauge';
import { VaultInteraction } from '@/components/dashboard/VaultInteraction';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { totalAssetsFormatted } = useVault();
  const { data: rebalances } = useRebalanceHistory();

  const [vaultStats, setVaultStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/vault-stats');
        const json = await res.json();
        if (json.data) {
          setVaultStats(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch telemetry:', err);
      } finally {
        setStatsLoading(false);
      }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  const dynamicAllocations = vaultStats?.allocations || [];

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-black">
      
      {/* 1. Global High-Density Metric Strip - Executive Precision Pass */}
      <div className="p-px bg-white/[0.08] border-b border-white/[0.1]">
         <MetricStrip 
           isLoading={statsLoading} 
           data={vaultStats ? {
             tvl: vaultStats.tvl,
             apy: vaultStats.avg_apy,
             activeStrategies: vaultStats.active_strategies,
             totalRebalances: vaultStats.total_rebalances
           } : undefined} 
         />
      </div>

      {/* 2. Operational Grid Matrix - Rhythmic Density Pass */}
      <main className="flex-1 p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* ROW 1: PRIMARY STAGE */}
        {/* Left: Capital Performance (8/12) - Machined Hardware Frame */}
        <div className="lg:col-span-8 flex flex-col">
           <div className="flex-1 panel-monolith overflow-hidden min-h-[600px]">
              <PerformanceChart />
           </div>
        </div>
        
        {/* Right: Execution Feed (4/12) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="flex-1 panel-monolith overflow-hidden bg-white/[0.01]">
              <SystemLog />
           </div>
        </div>

        {/* ROW 2: STRATEGIC INSIGHT - Executive Spacing Pass */}
        {/* Left: Strategy Performance Deck (4/12) */}
        <div className="lg:col-span-4 overflow-hidden panel-monolith">
           <ExecutionDeck allocationData={dynamicAllocations} />
        </div>

        {/* Middle: Capital Allocation Matrix & Controls (4/12) */}
        <div className="lg:col-span-4 flex flex-col gap-10">
           <div className="panel-monolith overflow-hidden bg-white/[0.01]">
              <VaultInteraction />
           </div>
           
           <div className="flex-1 panel-monolith overflow-hidden p-10 bg-white/[0.01]">
              <div className="flex items-center justify-between mb-10">
                 <span className="text-[12px] font-bold text-white/40 uppercase tracking-[0.3em]">Capital Allocation Matrix</span>
                 <div className="h-px flex-1 bg-white/[0.06] mx-6" />
              </div>
              <AllocationMatrix data={dynamicAllocations} />
           </div>
        </div>

        {/* Right: Risk & Node Density (4/12) */}
        <div className="lg:col-span-4 flex flex-col gap-10">
           <div className="panel-monolith overflow-hidden">
              <BadgeGallery />
           </div>
           <div className="panel-monolith overflow-hidden">
              <RiskGauge score={vaultStats?.risk_score || 0} />
           </div>
        </div>

      </main>


      {/* 3. Global System Status Ribbon */}
      <footer className="h-10 px-10 border-t border-white/[0.08] bg-black/40 flex items-center justify-between">
         <div className="flex items-center gap-8 text-[10px] font-mono font-bold tracking-widest text-white/10 uppercase">
            <span className="flex items-center gap-2">
               NETWORK <span className="text-emerald-500/50">OPERATIONAL</span>
            </span>
            <span>ORACLE HEALTHY</span>
            <span>DATA_SYNCED</span>
         </div>
         <div className="text-[10px] font-mono font-bold text-white/[0.03] uppercase tracking-widest">
            neuralis_protocol_v2.4.1_stable
         </div>
      </footer>

    </div>
  );
}
