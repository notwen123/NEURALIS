'use client';

import { useState, useEffect } from 'react';
import { Activity, Shield, Cpu, Globe, Database, Terminal, RefreshCw, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SystemPage() {
  const [mounted, setMounted] = useState(false);
  const [uptime, setUptime] = useState('00:00:00');
  
  useEffect(() => {
     setMounted(true);
     const start = Date.now();
     const timer = setInterval(() => {
        const diff = Date.now() - start;
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setUptime(`${h}:${m}:${s}`);
     }, 1000);
     return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase italic">Operational Telemetry</h1>
        <p className="text-white/30 text-[11px] font-bold tracking-[0.4em] uppercase">Sovereign_OS // System_Audit_Console</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        <MetricCard icon={Activity} label="Network_Latency" value="24ms" status="OPTIMAL" />
        <MetricCard icon={Cpu} label="Agent_Load" value="12.4%" status="NOMINAL" />
        <MetricCard icon={Shield} label="Security_Index" value="99.9%" status="SECURE" />
        <MetricCard icon={Globe} label="System_Uptime" value={uptime} status="ONLINE" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Agent Heartbeat */}
        <div className="lg:col-span-2 glass-card p-8 border border-white/5 space-y-8">
           <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-[11px] font-black tracking-[0.3em] text-white/40 uppercase italic">Active_Orchestrators</span>
              <RefreshCw className="w-4 h-4 text-brand animate-spin" />
           </div>

           <div className="space-y-4">
              <AgentStatus name="COLLECTOR_BOT" status="POOLING" lastTask="FETCH_MARKET_INDEX" tasks={1242} />
              <AgentStatus name="EXECUTOR_NODE" status="DORMANT" lastTask="SETTLE_VAULT_EPOCH" tasks={88} />
              <AgentStatus name="RECOMMENDER_AI" status="ANALYZING" lastTask="OPTIMIZE_YIELD_ROUTE" tasks={531} />
           </div>
        </div>

        {/* Global Registry */}
        <div className="glass-card p-8 border border-white/5 flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <span className="text-[11px] font-black tracking-[0.3em] text-white/40 uppercase italic">Network_Protocol</span>
           </div>
           
           <div className="flex-1 space-y-6">
              <DataLine label="CHAIN_ID" value="initiation-2 // EVM-1" />
              <DataLine label="SETTLEMENT" value="MoveVM L2" />
              <DataLine label="VALIDATORS" value="ACTIVE [64/64]" />
              <DataLine label="VERSION" value="Neural_OS v1.0.4-TESTNET" />
           </div>

           <div className="pt-8 border-t border-white/5">
              <div className="p-4 bg-brand/5 border border-brand/20 rounded-lg flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                 <span className="text-[10px] font-black text-brand uppercase tracking-widest">MoveVM_Bridge_Operational</span>
              </div>
           </div>
        </div>
      </div>

      {/* Terminal log simulation */}
      <div className="mt-8 glass-card p-6 bg-black/60 border border-white/5 overflow-hidden font-mono">
         <div className="flex items-center gap-3 mb-4 text-white/20 border-b border-white/5 pb-3">
            <Terminal className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Real-Time_Audit_Log</span>
         </div>
         <div className="space-y-2 h-[200px] overflow-hidden text-[11px]">
            <LogLine color="text-yellow-500" msg="[SYSTEM] Initializing MoveVM intent bridge..." />
            <LogLine color="text-brand" msg="[AGENT] Collector_Bot: Successfully queried L1 block 459,122." />
            <LogLine color="text-brand" msg="[AGENT] Recommender_AI: Synthesizing vault liquidity delta." />
            <LogLine color="text-blue-400" msg="[NETWORK] EVM-1 Rollup: Batch settlement confirmed on Initiation-2 Hub." />
            <LogLine color="text-white/20" msg="[AUDIT] Integrity check passed: Strategy #02 (Delta-Neutral-nUSD)." />
            <LogLine color="text-brand" msg="[AGENT] Collector_Bot: Awaiting next epoch trigger..." />
            <LogLine color="text-white/20" msg="[AUDIT] Zero-knowledge proof verified for Arena Match #452." />
         </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, status }: any) {
  return (
    <div className="glass-card p-6 border border-white/5 group hover:border-brand/30 transition-all">
      <div className="flex items-center justify-between mb-4">
         <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className="w-5 h-5 text-white/40 group-hover:text-brand" />
         </div>
         <span className="text-[9px] font-black px-2 py-1 bg-brand/10 text-brand rounded border border-brand/20">{status}</span>
      </div>
      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-2xl font-black text-white tracking-tighter">{value}</p>
    </div>
  );
}

function AgentStatus({ name, status, lastTask, tasks }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
      <div className="flex items-center gap-4">
         <div className={`w-2 h-2 rounded-full ${status === 'POOLING' || status === 'ANALYZING' ? 'bg-brand' : 'bg-white/20'}`} />
         <div className="flex flex-col">
            <span className="text-xs font-black text-white uppercase tracking-wider">{name}</span>
            <span className="text-[10px] font-bold text-white/20 uppercase italic">Last: {lastTask}</span>
         </div>
      </div>
      <div className="flex flex-col items-end">
         <span className="text-[10px] font-black text-brand uppercase">{status}</span>
         <span className="text-[9px] font-mono text-white/40">{tasks} TRXS</span>
      </div>
    </div>
  );
}

function DataLine({ label, value }: any) {
  return (
    <div className="flex justify-between items-center text-[10px] py-1">
      <span className="font-black text-white/20 uppercase tracking-widest">{label}</span>
      <span className="font-bold text-white/60 font-mono italic">{value}</span>
    </div>
  );
}

function LogLine({ color, msg }: any) {
  return (
    <div className={`flex gap-4 ${color}`}>
       <span className="opacity-40">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
       <span className="font-bold tracking-tight uppercase">{msg}</span>
    </div>
  );
}
