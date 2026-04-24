'use client';
import { motion } from 'framer-motion';

interface StrategyEntry {
  name: string;
  value: number; // bps
}

export function AllocationMatrix({ data }: { data: StrategyEntry[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/20 uppercase font-black text-[11px] tracking-[0.4em] animate-pulse">
        CONNECTING_STRATEGY_MESH...
      </div>
    );
  }

  const maxBps = 10000;

  return (
    <div className="w-full h-full flex flex-col justify-center p-8 space-y-10 mesh-bg bg-black">
      {data.map((s, i) => {
        const percentage = (s.value / maxBps) * 100;
        return (
          <div key={s.name} className="group panel-monolith p-6 rounded-none hologram-card border-white/5 hover:border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                 <div className="w-6 h-6 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono font-black text-white/20 group-hover:text-white transition-colors">
                    0{i + 1}
                 </div>
                 <span className="text-tactical text-white opacity-60 group-hover:opacity-100 transition-all">{s.name}</span>
              </div>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-black font-mono text-white tracking-widest group-hover:scale-105 transition-transform">
                   {(s.value / 100).toFixed(0)}
                 </span>
                 <span className="text-[10px] font-black text-white/20 uppercase">%</span>
              </div>
            </div>
            
            {/* Machined Monochrome Bar */}
            <div className="h-2 w-full bg-white/5 border border-white/10 relative overflow-hidden p-px">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${percentage}%` }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 className="h-full bg-white relative group-hover:bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
               >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-10 mix-blend-overlay" />
               </motion.div>
            </div>
            
            <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all">
               <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white animate-pulse" />
                  <span className="text-[9px] text-white/40 font-black uppercase tracking-widest leading-none">Optimal_Liquidity_Settle</span>
               </div>
               <span className="text-[9px] text-white/40 font-black uppercase tracking-widest leading-none font-mono">NODE_MVM_GENESIS</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

