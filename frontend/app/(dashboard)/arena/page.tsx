'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInterwovenKit } from '@initia/interwovenkit-react';
import Link from 'next/link';
import { Swords, Shield, Zap, Target, Activity, ExternalLink, ChevronRight, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { getExplorerLink } from '@/lib/contracts';


const MODULE_ADDR  = process.env.NEXT_PUBLIC_MOVE_MODULE_ADDRESS ?? '';
const CHAIN_ID     = process.env.NEXT_PUBLIC_INTERWOVEN_CHAIN_ID ?? 'neuralis-1';
const REST_URL     = process.env.NEXT_PUBLIC_INTERWOVEN_REST_URL ?? 'http://localhost:1317';

async function moveView(moduleName: string, fnName: string, args: string[]): Promise<unknown> {
  const res = await fetch(
    `${REST_URL}/initia/move/v1/accounts/${MODULE_ADDR}/modules/${moduleName}/view_functions/${fnName}`,
    {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ type_args: [], args }),
    }
  );
  if (!res.ok) throw new Error(`Move view failed: ${res.status}`);
  const json = await res.json();
  return json.data;
}

type BattleState = 'WAITING' | 'ACTIVE' | 'FINISHED' | 'UNKNOWN';
const STATE_MAP: Record<number, BattleState> = { 0: 'WAITING', 1: 'ACTIVE', 2: 'FINISHED' };

interface BattleInfo {
  id       : number;
  state    : BattleState;
  hp1      : number;
  hp2      : number;
  winner   : string;
}

export default function ArenaPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { address, openConnect, requestTxSync } = useInterwovenKit();

  const [credits, setCredits]         = useState<number | null>(null);
  const [battleId, setBattleId]       = useState('');
  const [stake, setStake]             = useState('10');
  const [battle, setBattle]           = useState<BattleInfo | null>(null);
  const [status, setStatus]           = useState('');
  const [combatLog, setCombatLog]     = useState<string[]>([]);
  const [loading, setLoading]         = useState(false);

  const addLog = (msg: string) => {
    setCombatLog(prev => [msg, ...prev].slice(0, 5));
  };

  const fetchCredits = useCallback(async () => {
    if (!address || !MODULE_ADDR) return;
    try {
      const data = await moveView('agent_arena', 'get_credits', [
        `"${MODULE_ADDR}"`,
        `"${address}"`,
      ]);
      setCredits(Number(data));
    } catch { setCredits(0); }
  }, [address]);

  useEffect(() => { fetchCredits(); }, [fetchCredits]);

  async function fetchBattle(id: number) {
    try {
      const [stateRaw, hpRaw, winnerRaw] = await Promise.all([
        moveView('agent_arena', 'get_battle_state',  [`"${MODULE_ADDR}"`, String(id)]),
        moveView('agent_arena', 'get_battle_hp',     [`"${MODULE_ADDR}"`, String(id)]),
        moveView('agent_arena', 'get_battle_winner', [`"${MODULE_ADDR}"`, String(id)]),
      ]);
      const [hp1, hp2] = hpRaw as [number, number];
      setBattle({
        id,
        state : STATE_MAP[Number(stateRaw)] ?? 'UNKNOWN',
        hp1   : Number(hp1),
        hp2   : Number(hp2),
        winner: String(winnerRaw),
      });
    } catch (e) {
      setStatus('Battle not found.');
    }
  }

  async function handleCreate() {
    if (!address || !MODULE_ADDR) { setStatus('Connect wallet first.'); return; }
    setLoading(true); setStatus('');
    try {
      const hash = await requestTxSync({
        chainId : CHAIN_ID,
        messages: [{
          typeUrl: '/initia.move.v1.MsgExecute',
          value  : {
            sender      : address,
            moduleAddress: MODULE_ADDR,
            moduleName  : 'agent_arena',
            functionName: 'create_battle',
            typeArgs    : [],
            args        : [encodeU64(Number(stake))],
          },
        }],
      });
      toast.success('Battle Forged', {
        description: `Arena initialized with ${stake} NEURAL.`,
        action: { label: 'Audit', onClick: () => window.open(getExplorerLink(hash), '_blank') }
      });
      setStatus('SUCCESS: BATTLE FORGED');
      await fetchCredits();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error('Combat Exception', { description: msg.slice(0, 50) });
      setStatus('ERROR: ' + msg.slice(0, 80).toUpperCase());
    } finally { setLoading(false); }
  }

  async function handleJoin() {
    if (!address || !MODULE_ADDR || !battleId) return;
    setLoading(true); setStatus('');
    try {
      const hash = await requestTxSync({
        chainId : CHAIN_ID,
        messages: [{
          typeUrl: '/initia.move.v1.MsgExecute',
          value  : {
            sender      : address,
            moduleAddress: MODULE_ADDR,
            moduleName  : 'agent_arena',
            functionName: 'join_battle',
            typeArgs    : [],
            args        : [encodeU64(Number(battleId))],
          },
        }],
      });
      toast.success('Battle Joined', {
        description: `Connected to session #${battleId}.`,
        action: { label: 'Verify', onClick: () => window.open(getExplorerLink(hash), '_blank') }
      });
      setStatus(`JOINED BATTLE ${battleId}`);
      await fetchBattle(Number(battleId));
      await fetchCredits();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error('Combat Exception', { description: msg.slice(0, 50) });
      setStatus('ERROR: ' + msg.slice(0, 80).toUpperCase());
    } finally { setLoading(false); }
  }

  async function handlePlayTurn(moveType: number) {
    if (!address || !MODULE_ADDR || !battle) return;
    setLoading(true); setStatus('');
    try {
      const hash = await requestTxSync({
        chainId : CHAIN_ID,
        messages: [{
          typeUrl: '/initia.move.v1.MsgExecute',
          value  : {
            sender      : address,
            moduleAddress: MODULE_ADDR,
            moduleName  : 'agent_arena',
            functionName: 'play_turn',
            typeArgs    : [],
            args        : [encodeU64(battle.id), encodeU8(moveType)],
          },
        }],
      });
      const icon = moveType === 2 ? 'ZAP' : moveType === 1 ? 'GUARD' : 'ATTACK';
      addLog(`${icon} submitted successfully.`);
      toast.success('Move Registered', {
        description: `${icon} logic broadcasted to MoveVM.`,
        action: { label: 'Audit', onClick: () => window.open(getExplorerLink(hash), '_blank') }
      });
      setStatus(`MOVE SUBMITTED: ${icon}`);

      await fetchBattle(battle.id);
      await fetchCredits();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error('Tactical Exception', { description: msg.slice(0, 50) });
      setStatus('ERROR: ' + msg.slice(0, 80).toUpperCase());
    } finally { setLoading(false); }
  }

  if (!mounted) return null;

  if (!address) {
    return (
      <div className="min-h-[calc(100vh-96px)] flex items-center justify-center px-6">
        <div className="glass-card p-12 max-w-md w-full text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-brand/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex justify-center mb-8">
               <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center border border-brand/20 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                  <Swords className="w-10 h-10 text-brand" />
               </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-4">Agent Arena</h2>
            <p className="text-white/50 text-sm leading-relaxed mb-10">Enter 1v1 on-chain battles with Neural Credits. Prove your agent's tactical superiority in the Minitia proving grounds.</p>
            <button className="btn-primary w-full py-4 text-base" onClick={openConnect}>Connect Wallet</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1fr] gap-8 items-start">
        <div className="flex flex-col gap-6 w-full">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-white mb-2 uppercase">Combat Terminal</h1>
            <p className="panel-title mb-10">Strategic Proof-of-Labor Arena</p>
          </div>

          <div className="glass-card p-8 group overflow-hidden border border-white/[0.05]">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
              <div className="text-6xl font-black tracking-tighter uppercase italic">Credits</div>
            </div>
            <div className="flex items-center gap-2 mb-8">
               <div className="w-1.5 h-1.5 rounded-full bg-brand" />
               <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Capital_Reserve</span>
            </div>
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-5xl font-black tracking-tighter text-white">{credits ?? '—'}</span>
              <span className="text-xs font-mono font-bold text-brand tracking-[0.4em] uppercase underline decoration-brand/20 underline-offset-4 font-black">NEURAL</span>
            </div>
            <p className="text-white/40 text-[11px] leading-relaxed max-w-xs font-medium uppercase tracking-wider">Credits earned from vault yield cycles. Every credit represents proven labor settled on MoveVM.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 border border-white/[0.05]">
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 mb-6 flex items-center gap-2">
                 <Swords className="w-3 h-3" /> Forge Battle
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] uppercase tracking-widest font-black text-white/20 mb-2 block">Combat Stake</label>
                  <input className="w-full bg-black/40 border border-white/10 rounded-lg p-3 font-mono text-white focus:outline-none focus:border-brand/40 transition-all text-sm" type="number" min="1" value={stake} onChange={(e) => setStake(e.target.value)} />
                </div>
                <button className="btn-primary w-full py-3 text-[10px] font-black tracking-[0.2em] justify-center" onClick={handleCreate} disabled={loading || !stake || (credits ?? 0) < Number(stake)}>
                  {loading ? 'EXECUTING...' : 'INITIATE ARENA'}
                </button>
              </div>
            </div>

            <div className="glass-card p-6 border border-white/[0.05]">
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 mb-6 flex items-center gap-2">
                 <Target className="w-3 h-3" /> Enter Match
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] uppercase tracking-widest font-black text-white/20 mb-2 block">Reference ID</label>
                  <input className="w-full bg-black/40 border border-white/10 rounded-lg p-3 font-mono text-white focus:outline-none focus:border-brand/40 transition-all text-sm" type="number" min="0" placeholder="ID" value={battleId} onChange={(e) => setBattleId(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <button className="btn-ghost flex-1 text-[10px] font-black tracking-[0.2em] justify-center py-3" onClick={() => battleId && fetchBattle(Number(battleId))} disabled={!battleId}>SCAN</button>
                  <button className="btn-primary flex-1 text-[10px] font-black tracking-[0.2em] justify-center py-3" onClick={handleJoin} disabled={loading || !battleId}>JOIN</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full lg:sticky lg:top-32">
          {battle ? (
            <div className="glass-card p-8 border border-white/[0.05]">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                <div className="flex flex-col gap-1">
                   <p className="text-[11px] font-black text-white/60 tracking-[0.4em] uppercase leading-none">Engagement</p>
                   <p className="text-sm font-mono font-bold text-white">#{battle.id}</p>
                </div>
                <span className={`text-[9px] font-black tracking-[0.3em] px-4 py-2 rounded-sm border transition-all ${battle.state === 'ACTIVE' ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20' : 'text-white/30 bg-white/5 border-white/10'}`}>
                  {battle.state}
                </span>
              </div>

              <div className="space-y-12 mb-12">
                <HPBar label="Player 01" hp={battle.hp1} />
                <div className="relative h-px bg-white/5 flex justify-center items-center">
                   <div className="bg-[#05050a] px-6 text-[9px] font-black text-white/10 tracking-[0.5em] uppercase italic">Collision_Boundary</div>
                </div>
                <HPBar label="Player 02" hp={battle.hp2} />
              </div>

              <div className="mb-10 space-y-2 px-4 py-6 bg-white/[0.01] border-y border-white/5">
                {combatLog.length > 0 ? combatLog.map((log, idx) => (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={idx} className="flex items-center gap-4 text-[10px] font-mono py-2 border-b border-white/[0.03] last:border-0">
                    <Activity className="w-3 h-3 text-brand/40" />
                    <span className="text-white/20">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                    <span className="text-white font-bold uppercase tracking-widest">{log}</span>
                  </motion.div>
                )) : (
                  <div className="text-[10px] text-white/10 italic text-center py-4">Awaiting tactical data...</div>
                )}
              </div>

              {battle.state === 'FINISHED' && battle.winner !== '0x0000000000000000000000000000000000000000' && (
                <div className="p-8 bg-brand/5 border border-brand/20 rounded-lg mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Trophy className="w-5 h-5 text-brand" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand">Victor_Settled</span>
                  </div>
                  <p className="text-lg font-mono text-white font-black tracking-tight">{battle.winner.slice(0, 16)}...</p>
                </div>
              )}

              {battle.state === 'ACTIVE' && (
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { type: 0, label: 'ATTACK', Icon: Swords, desc: '14-22 DMG', color: 'text-rose-400', bg: 'bg-rose-500/10' },
                    { type: 1, label: 'GUARD',  Icon: Shield, desc: '3-6 DMG', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { type: 2, label: 'BURST',  Icon: Zap, desc: '26-34 DMG', color: 'text-amber-400', bg: 'bg-amber-500/10' },
                  ].map((m) => (
                    <button key={m.type} onClick={() => handlePlayTurn(m.type)} disabled={loading} className="group flex flex-col items-center gap-6 p-8 bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all hover:bg-white/[0.04]">
                      <div className={`w-12 h-12 rounded-lg ${m.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                         <m.Icon className={`w-6 h-6 ${m.color}`} />
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                         <span className={`text-[10px] font-black tracking-[0.3em] ${m.color}`}>{m.label}</span>
                         <span className="text-[8px] font-mono text-white/20 font-bold uppercase">{m.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-24 text-center border border-white/[0.05]">
              <Activity className="w-12 h-12 text-white/5 mb-8 mx-auto" />
              <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em]">Awaiting_Telemetry</p>
            </div>
          )}

          <div className="glass-card p-8 border border-white/[0.05]">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-8">Combat Protocols</p>
            <div className="space-y-3">
              {[
                { k: 'FORMAT', v: 'TURN-BASED' },
                { k: 'HP SEED', v: '100 UNITS' },
                { k: 'SETTLE', v: 'MOVEVM L2' },
              ].map((rule) => (
                <div key={rule.k} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-lg text-[10px] font-black">
                  <span className="text-white/30 tracking-widest uppercase">{rule.k}</span>
                  <span className="text-white/60 font-mono italic">{rule.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {status && (
        <div className="mt-8 p-6 glass-card bg-brand/5 border border-brand/20 flex items-center gap-4">
           <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
           <span className="text-[11px] font-mono text-brand tracking-[0.2em] font-black uppercase">{status}</span>
        </div>
      )}
    </div>
  );
}

function HPBar({ label, hp }: { label: string; hp: number }) {
  const pct = Math.max(0, Math.min(100, hp));
  const colorClass = pct > 60 ? 'bg-emerald-500' : pct > 30 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-4">
        <div className="flex flex-col gap-1">
           <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">{label}</span>
           <span className="text-[10px] font-mono font-bold text-white/60 uppercase">Vitality_Core</span>
        </div>
        <div className="flex items-baseline gap-1">
           <span className="text-3xl font-black font-mono text-white tracking-tighter">{hp}</span>
           <span className="text-[9px] font-bold text-white/20 uppercase font-mono">/100</span>
        </div>
      </div>
      <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.08] p-0.5">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className={`h-full ${colorClass} rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] relative`}>
           <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}

function encodeU64(n: number): Uint8Array {
  const buf = new Uint8Array(8);
  let v = BigInt(n);
  for (let i = 0; i < 8; i++) { buf[i] = Number(v & 0xffn); v >>= 8n; }
  return buf;
}

function encodeU8(n: number): Uint8Array {
  return new Uint8Array([n]);
}
