import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricItemProps {
  label: string;
  value: string;
  subValue?: string;
  delta?: string;
  isPositive?: boolean;
}

const MetricItem = ({ label, value, subValue, delta, isPositive = true }: MetricItemProps) => (
  <div className="flex-1 p-8 border-r border-white/[0.08] bg-white/[0.01] hover:bg-white/[0.03] transition-all group last:border-r-0">
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
          {label}
        </span>
        <Activity className="w-3 h-3 text-white/5 group-hover:text-brand/40 transition-colors" />
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-black tracking-tighter text-white group-hover:text-brand transition-colors duration-500">
            {value}
          </span>
          {delta && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-black ${isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              <span className="font-mono underline decoration-current decoration-dotted underline-offset-4">{delta}</span>
            </div>
          )}
        </div>
        <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-brand/40" />
          {subValue}
        </div>
      </div>
    </div>
  </div>
);

export interface MetricStripData {
  tvl: string;
  apy: string;
  activeStrategies: number | string;
  totalRebalances: number | string;
}

interface MetricStripProps {
  data?: MetricStripData;
  isLoading?: boolean;
}

export const MetricStrip = ({ data, isLoading }: MetricStripProps) => {
  return (
    <div className="flex bg-black border-b border-white/[0.12] overflow-x-auto no-scrollbar">
      {/* Alignment Gutter with Brand Pulse */}
      <div className="flex-none w-12 border-r border-white/[0.08] bg-white/[0.01] flex items-center justify-center">
         <div className="w-1 h-12 bg-gradient-to-b from-transparent via-brand to-transparent animate-pulse opacity-40 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
      </div>

      {/* Dynamic Formatter for TVL */}
      {(() => {
        const tvlVal = parseFloat(data?.tvl || '0');
        let displayTvl = '';
        if (tvlVal === 0) displayTvl = '$0.00';
        else if (tvlVal < 1) displayTvl = `$${tvlVal.toFixed(4)}`;
        else if (tvlVal < 1000) displayTvl = `$${tvlVal.toFixed(2)}`;
        else if (tvlVal < 1000000) displayTvl = `$${(tvlVal / 1000).toFixed(1)}K`;
        else displayTvl = `$${(tvlVal / 1000000).toFixed(2)}M`;

        return (
          <MetricItem 
            label="Value_Locked" 
            value={isLoading ? '—' : displayTvl} 
            subValue="Live_Oracle_Feed"
            delta="1.2%"
            isPositive={true}
          />
        );
      })()}
      
      <MetricItem 
        label="Yield_Efficiency" 
        value={isLoading ? '—' : `${data?.apy ?? '0.00'}%`} 
        subValue="Aggregated_APY"
        delta="0.4%"
        isPositive={true}
      />
      <MetricItem 
        label="Active_Mesh" 
        value={isLoading ? '—' : String(data?.activeStrategies ?? '0')} 
        subValue="Strategic_Nodes"
      />
      <MetricItem 
        label="VM_Settlements" 
        value={isLoading ? '—' : String(data?.totalRebalances ?? '0')} 
        subValue="Move_VM_Operations"
      />
    </div>
  );
};

