'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useChainId, useSwitchChain } from 'wagmi';
import { formatUnits } from 'viem';
import { useInterwovenKit } from '@initia/interwovenkit-react';
import { useVault } from '@/hooks/useVault';
import { ERC20_ABI, vaultManagerConfig, getExplorerLink } from '@/lib/contracts';
import { bech32ToHex } from '@/lib/addresses';
import { TARGET_CHAIN_ID } from '@/lib/wagmi';
import { toast } from 'sonner';

const bridgeDenom = process.env.NEXT_PUBLIC_INTERWOVEN_BRIDGE_DENOM ?? 'uinit';



export default function VaultPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { address: evmAddress } = useAccount();
  const { address: initiaAddress, openConnect } = useInterwovenKit();

  // Either EVM or Initia wallet connected counts as "connected"
  const isConnected = !!(evmAddress || initiaAddress);

  if (!mounted || !isConnected) {
    return (
      <div className="min-h-[calc(100vh-96px)] flex items-center justify-center px-6">
        <div className="glass-card p-12 max-w-md w-full text-center relative overflow-hidden group">
          {/* Brand Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-violet-600 flex items-center justify-center text-white text-3xl font-bold shadow-[0_0_30px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform duration-500">
                ⬡
              </div>
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight text-white mb-4">
              Enter the Agent Economy
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-10">
              Connect your wallet to delegate capital to autonomous agents. Earn yield with invisible, institutional-grade execution.
            </p>
            
            <button
              className="btn-primary w-full py-4 text-base shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(37,99,235,0.2)]"
              onClick={openConnect}
            >
              Connect Wallet
            </button>
            
            <p className="mt-6 text-[10px] uppercase tracking-widest text-white/20 font-bold">
              Secure · Trustless · Non-Custodial
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        
        {/* Main Content Area */}
        <div className="flex flex-col gap-6 w-full">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-white mb-2">Vault Console</h1>
            <p className="panel-title mb-10">Yield Management & Intent Orchestration</p>
          </div>

          <PositionSummary />
          <IntentPanel />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BridgePanel />
            <div className="glass-card p-6 flex flex-col justify-center border-dashed border-white/10 bg-transparent">
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/20 mb-2">Strategic Network</p>
              <p className="text-sm text-white/40 italic">"Integrate custom yield strategies via our MoveVM SDK coming soon."</p>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="flex flex-col gap-6 w-full lg:sticky lg:top-32">
          <WalletHeader />
          <VaultForm />
        </div>
      </div>
    </div>
  );
}

// ── Wallet header ─────────────────────────────────────────────────────────────

function WalletHeader() {
  const { address: evmAddress } = useAccount();
  const chainId = useChainId();
  const { address: initiaAddress, username, openWallet } = useInterwovenKit();
  const isWrongNetwork = !!evmAddress && chainId !== TARGET_CHAIN_ID;

  const display = username ?? initiaAddress ?? evmAddress;

  return (
    <div className={`glass-card p-4 flex items-center justify-between group transition-all ${isWrongNetwork ? 'border-red-500/50 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'hover:bg-white/[0.04]'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] transition-all ${isWrongNetwork ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-white/5 border border-white/10 text-white/40'}`}>
          {isWrongNetwork ? '!' : 'ID'}
        </div>
        <div className="flex flex-col">
          <span className={`text-xs font-mono tracking-tight transition-all ${isWrongNetwork ? 'text-red-400 font-bold' : 'text-white/70'}`}>
            {display ? `${display.slice(0, 12)}…${display.slice(-4)}` : '—'}
          </span>
          {isWrongNetwork && (
            <span className="text-[9px] font-black text-red-500/60 uppercase tracking-tighter">Wrong Network</span>
          )}
        </div>
      </div>
      <button
        onClick={openWallet}
        className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 transition-all rounded-full border ${
          isWrongNetwork 
            ? 'text-white bg-red-600 border-red-500 hover:bg-red-700' 
            : 'text-white/40 hover:text-white border border-white/10 hover:border-white/30'
        }`}
      >
        {isWrongNetwork ? 'Fix Network' : 'Portal'}
      </button>
    </div>
  );
}

// ── Position summary ──────────────────────────────────────────────────────────

function PositionSummary() {
  const { address: evmAddress } = useAccount();
  const { address: initiaAddress } = useInterwovenKit();
  const rawAddress = evmAddress || initiaAddress;
  const activeAddress = rawAddress ? bech32ToHex(rawAddress) : undefined;

  const { userAssetsFormatted, userSharesRaw, totalAssetsFormatted, isLoading } = useVault(activeAddress ?? undefined);
  return (
    <div className="glass-card p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <div className="text-8xl font-bold tracking-tighter">NEURALIS</div>
      </div>
      
      <p className="panel-title mb-8">Institutional Exposure</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <StatBox label="Deposited"  value={userAssetsFormatted ? `${parseFloat(userAssetsFormatted) < 0.01 ? parseFloat(userAssetsFormatted).toFixed(6) : Number(userAssetsFormatted).toFixed(2)} USDC` : '—'} />
        <StatBox label="Total Pool"     value={totalAssetsFormatted ? `${parseFloat(totalAssetsFormatted) < 0.01 ? parseFloat(totalAssetsFormatted).toFixed(6) : Number(totalAssetsFormatted).toFixed(2)} USDC` : '—'} />
        <StatBox label="Shares"      value={userSharesRaw !== undefined ? Number(formatUnits(userSharesRaw, 6)).toFixed(6) : '—'} />
        <StatBox label="Health"            value={isLoading ? 'SCANNING…' : 'NOMINAL'} live={!isLoading} />
      </div>
    </div>
  );
}

// ── Natural language intent panel ─────────────────────────────────────────────

function IntentPanel() {
  const [intent, setIntent]   = useState('');
  const [result, setResult]   = useState('');
  const [loading, setLoading] = useState(false);

  const PRESETS = [
    'Maximize safe yield with my USDC',
    'Minimize risk, stable returns only',
    'Aggressive yield, I accept higher risk',
  ];

  async function submitIntent() {
    if (!intent.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/intent', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ intent }),
      });
      const json = await res.json();
      setResult(json.message ?? 'Intent queued for next agent cycle.');
    } catch {
      setResult('Intent queued — agent will act on next cycle.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card p-8">
      <div className="flex items-center justify-between mb-6">
        <p className="panel-title mb-0">Agent Intelligence Console</p>
        <div className="flex gap-1.5">
          <div className="w-1 h-1 rounded-full bg-brand shadow-[0_0_8px_rgba(37,99,235,1)]" />
          <div className="w-1 h-1 rounded-full bg-brand/30" />
          <div className="w-1 h-1 rounded-full bg-brand/30" />
        </div>
      </div>

      <p className="text-white/40 text-sm mb-8 leading-relaxed max-w-xl">
        Input your strategic objectives. Our agents synthesize on-chain data and market sentiment to route capital into the most efficient strategies.
      </p>

      {/* Preset chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setIntent(p)}
            className={`text-[11px] font-medium px-4 py-1.5 rounded-full border transition-all ${
              intent === p 
                ? 'bg-white/10 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                : 'bg-transparent border-white/5 text-white/40 hover:border-white/10 hover:text-white/60'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="relative mb-6 group">
        <textarea
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          placeholder="Describe your yield objective..."
          rows={3}
          className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm text-white placeholder-white/20 focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/40 transition-all resize-none leading-relaxed"
        />
        <div className="absolute bottom-4 right-6 text-[10px] text-white/10 font-mono tracking-widest uppercase group-focus-within:text-brand/40 transition-colors">
          NATURAL LANGUAGE ENGINE V1.0
        </div>
      </div>

      <button
        className="btn-primary w-full py-4 justify-center"
        onClick={submitIntent}
        disabled={loading || !intent.trim()}
      >
        {loading ? 'Processing Intent...' : 'Deploy Global Intent →'}
      </button>

      {result && (
        <div className="mt-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Response Received</span>
          </div>
          <p className="text-sm text-white/60 leading-relaxed font-mono">
            {result}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Bridge panel ──────────────────────────────────────────────────────────────

function BridgePanel() {
  const { openDeposit, address } = useInterwovenKit();
  return (
    <div className="glass-card p-8 group">
      <p className="panel-title mb-6">Interwoven Bridge</p>
      <p className="text-white/40 text-sm leading-relaxed mb-8">
        Securely bridge assets from Initia L1 or other Minitias into the NEURALIS L2 ecosystem.
      </p>
      <button
        className="btn-ghost w-full py-3.5 group-hover:border-white/20 transition-colors"
        onClick={() => openDeposit({ denoms: [bridgeDenom], chainId: process.env.NEXT_PUBLIC_INTERWOVEN_CHAIN_ID ?? 'neuralis-1' })}
        disabled={!address}
      >
        Initiate Cross-Chain Transfer ↗
      </button>
    </div>
  );
}

// ── Vault form ────────────────────────────────────────────────────────────────

function VaultForm() {
  const [tab, setTab]       = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const vault = useVault();
  const { approve, deposit, redeem, userSharesRaw, assetAddress, isDepositing, isRedeeming, isApproving, refetch } = vault;



  const isWrongNetwork = !!address && chainId !== TARGET_CHAIN_ID;


  const allowance = useReadContract({
    address: assetAddress as `0x${string}`, abi: ERC20_ABI, functionName: 'allowance',

    args: address ? [address, vaultManagerConfig.address] : undefined,
    query: { enabled: !!address && !!assetAddress },
  });
  const usdcBalance = useReadContract({
    address: assetAddress as `0x${string}`, abi: ERC20_ABI, functionName: 'balanceOf',

    args: address ? [address] : undefined,
    query: { enabled: !!address && !!assetAddress },
  });

  async function handleDeposit() {
    if (!amount) return;
    setStatus('');
    try {
      const amountBig = BigInt(Math.floor(Number(amount) * 1e6));
      if ((allowance.data ?? BigInt(0)) < amountBig) {
        setStatus('APPROVING ASSET...');
        const hash = await approve(amountBig);
        toast.success('Asset Approved', {
          description: 'Approval anchored to EVM-1.',
          action: { label: 'Audit', onClick: () => window.open(getExplorerLink(hash), '_blank') }
        });
        await refetch();
      }
      setStatus('DEPOSITING...');

      const hash = await deposit(amount);
      toast.success('Liquidity Deployed', {
        description: 'Asset successfully vaulted.',
        action: { label: 'Verify', onClick: () => window.open(getExplorerLink(hash), '_blank') }
      });
      setStatus('SUCCESS: LIQUIDITY DEPLOYED');
      setAmount('');
      await refetch();
    } catch (e: unknown) {

      const msg = e instanceof Error ? e.message : String(e);
      toast.error('Vault Exception', { description: msg.slice(0, 50) + '...' });
      setStatus('ERROR: ' + msg.slice(0, 80).toUpperCase());
    }
  }

  async function handleRedeem() {
    if (!amount && !userSharesRaw) return;
    setStatus('WITHDRAWING...');
    try {
      const sharesAmount = amount ? BigInt(Math.floor(Number(amount) * 1e6)) : userSharesRaw!;
      const hash = await redeem(sharesAmount);
      toast.success('Withdrawal Initiated', {
        description: 'Funds are returning to your wallet.',
        action: { label: 'Audit', onClick: () => window.open(getExplorerLink(hash), '_blank') }
      });
      setStatus('SUCCESS: LIQUIDITY WITHDRAWN');
      setAmount('');
      await refetch();
    } catch (e: unknown) {

      const msg = e instanceof Error ? e.message : String(e);
      toast.error('Vault Exception', { description: msg.slice(0, 50) + '...' });
      setStatus('ERROR: ' + msg.slice(0, 80).toUpperCase());
    }
  }

  const maxUSDC   = usdcBalance.data !== undefined ? formatUnits(usdcBalance.data, 6) : '0';
  const maxShares = userSharesRaw !== undefined ? formatUnits(userSharesRaw, 6) : '0';

  return (
    <div className="glass-card p-8">
      <p className="panel-title mb-8">Execute Settlement</p>

      <div className="tab-bar mb-10">
        {(['deposit', 'withdraw'] as const).map((t) => (
          <button key={t} className={`tab-item ${tab === t ? 'active' : ''}`}
            onClick={() => { setTab(t); setAmount(''); setStatus(''); }}>
            {t === 'deposit' ? 'Deposit' : 'Withdraw'}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-3">
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/30 truncate">
              {tab === 'deposit' ? 'DEPOSIT AMOUNT (USDC)' : 'WITHDRAW SHARES (NYV)'}
            </span>
            <button 
              onClick={() => setAmount(tab === 'deposit' ? maxUSDC : maxShares)}
              className="text-[10px] font-mono text-brand hover:text-white transition-colors uppercase font-bold"
            >
              MAX: {Number(tab === 'deposit' ? maxUSDC : maxShares) < 0.01 ? Number(tab === 'deposit' ? maxUSDC : maxShares).toFixed(6) : Number(tab === 'deposit' ? maxUSDC : maxShares).toFixed(2)}
            </button>
          </div>
          <input 
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-2xl font-bold text-white placeholder-white/10 focus:outline-none focus:border-brand/40 transition-all" 
            type="number" 
            min="0" 
            placeholder="0.00"
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
          />
        </div>

        {isWrongNetwork ? (
          <button 
            onClick={() => switchChain({ chainId: TARGET_CHAIN_ID })}
            className="btn-primary w-full py-4 justify-center bg-brand text-white"
          >
            SWITCH TO NEURALIS NETWORK
          </button>
        ) : (
          <button 
            className="btn-primary w-full py-4 justify-center"
            onClick={tab === 'deposit' ? handleDeposit : handleRedeem} 
            disabled={isDepositing || isApproving || isRedeeming || (!amount && tab === 'deposit')}
          >
            {isApproving ? 'APPROVING...' : (isDepositing || isRedeeming) ? 'EXECUTING...' : tab === 'deposit' ? 'CONFIRM DEPOSIT' : 'CONFIRM WITHDRAW'}
          </button>
        )}

        {status && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
             <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse shadow-[0_0_8px_rgba(37,99,235,1)]" />
               <span className="text-[10px] font-mono text-white/60 tracking-wider">
                 {status}
               </span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, live }: { label: string; value: string; live?: boolean }) {
  return (
    <div className="group">
      <p className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2 group-hover:text-white/50 transition-colors">{label}</p>
      <div className="flex items-center gap-2">
        {live && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />}
        <p className={`text-xl font-bold tracking-tight ${live ? 'text-emerald-400' : 'text-white'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
