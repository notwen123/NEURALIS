'use client';

import { AllocationMatrix } from '@/components/AllocationMatrix';

interface ExecutionDeckProps {
  allocationData: any[];
}

export const ExecutionDeck = ({ allocationData }: ExecutionDeckProps) => {
  const activeCount = allocationData?.length || 0;

  return (
    <div className="h-full flex flex-col bg-white/[0.01] panel">
      {/* Panel Header */}
      <div className="px-10 py-8 border-b border-white/[0.08] flex items-center justify-between">
        <span className="text-[13px] font-bold tracking-[0.24em] text-white/40 uppercase">Execution Deck</span>
        <div className="flex items-center gap-6 text-[11px] font-bold text-white/20 tracking-wider">
           <span className="flex items-center gap-2">
             <div className={`w-1 h-1 rounded-full ${activeCount > 0 ? 'bg-white' : 'bg-white/10'}`} />
             TOTAL_CONNECTED_STRATEGIES: {activeCount < 10 ? `0${activeCount}` : activeCount}
           </span>
           <span className="text-white/40">{activeCount > 0 ? 'SYSTEM_READY' : 'WAITING_FOR_LIQUIDITY'}</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-0">
        {/* Technical Data Table */}
        <div className="p-10 border-r border-white/[0.08]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="pb-6 text-[11px] uppercase tracking-[0.24em] text-white/40 font-bold">Strategy_ID</th>
                <th className="pb-6 text-[11px] uppercase tracking-[0.24em] text-white/40 font-bold">Yield_Proof</th>
                <th className="pb-6 text-[11px] uppercase tracking-[0.24em] text-white/40 font-bold text-right">Settlement_L2</th>
              </tr>
            </thead>
            <tbody className="text-[13px] font-medium">
              {activeCount > 0 ? (
                allocationData.map((s) => (
                  <tr key={s.address} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                    <td className="py-6 text-white/90 flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <span className="font-bold tracking-tight uppercase">{s.name}</span>
                    </td>
                    <td className="py-6 text-white/90 font-bold">{s.apy.toFixed(2)}% <span className="text-[10px] text-white/20 ml-1">NET</span></td>
                    <td className="py-6 text-white/50 text-right font-mono text-[11px] uppercase tracking-tighter">
                      {s.address.slice(0, 6)}...{s.address.slice(-4)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-20 text-center text-white/10 italic uppercase tracking-[0.3em] text-[11px] font-bold">
                    No_Active_Strategies_Detected
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        {/* Visual Allocation Matrix */}
        <div className="bg-black/20 flex flex-col items-center">
            <AllocationMatrix data={allocationData} />
        </div>
      </div>
    </div>
  );
};
