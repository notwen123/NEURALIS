'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useChainId, useSwitchChain } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { useInterwovenKit } from '@initia/interwovenkit-react';
import { useVault } from '@/hooks/useVault';
import { ERC20_ABI, vaultManagerConfig, getExplorerLink } from '@/lib/contracts';
import { TARGET_CHAIN_ID } from '@/lib/wagmi';
import { toast } from 'sonner';

const bridgeDenom = 'uinit';
const USDC_DECIMALS = 6;

export default function VaultPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { address: evmAddress } = useAccount();
  const { address: initiaAddress, openConnect } = useInterwovenKit();

  const isConnected = !!(evmAddress || initiaAddress);

  if (!mounted || !isConnected) {
    return (
      <div className="min-h-[calc(100vh-96px)] flex items-center justify-center px-6">
        <div className="glass-card p-12 max-w-md w-full text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-brand/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center text-white text-3xl font-bold">⬡</div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-4">Enter the Agent Economy</h2>
            <p className="text-white/50 text-sm mb-10">Connect your wallet to delegate capital to autonomous agents.</p>
            <button className="btn-primary w-full py-4" onClick={openConnect}>Connect Wallet</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        <div className="flex flex-col gap-6 w-full">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-white mb-2">Vault Console</h1>
            <p className="panel-title mb-10">Yield Management & Intent Orchestration</p>
          </div>
          <PositionSummary />
          <IntentPanel />
        </div>
        <div className="flex flex-col gap-6 w-full lg:sticky lg:top-32">
          <WalletHeader />
          <VaultForm />
        </div>
      </div>
    </div>
  );
}

function WalletHeader() {
  const { address: evmAddress } = useAccount();
  const chainId = useChainId();
  const { username, openWallet } = useInterwovenKit();
  const isWrongNetwork = !!evmAddress && chainId !== TARGET_CHAIN_ID;
  const display = username ?? evmAddress;

  return (
    <div className={`glass-card p-4 flex items-center justify-between group transition-all ${isWrongNetwork ? 'border-red-500/50 bg-red-500/5' : 'hover:bg-white/[0.04]'}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white/40">ID</div>
        <div className="flex flex-col text-xs font-mono">
          <span className="text-white/70">{display ? `${display.slice(0, 12)}...${display.slice(-4)}` : '—'}</span>
        </div>
      </div>
      <button onClick={openWallet} className="text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/10 hover:border-white/30 text-white/40">Portal</button>
    </div>
  );
}

function PositionSummary() {
  const { userAssetsFormatted, userSharesRaw, totalAssetsFormatted, isLoading } = useVault();
  return (
    <div className="glass-card p-8 relative overflow-hidden">
      <p className="panel-title mb-8">Institutional Exposure</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <StatBox label="Deposited"  value={userAssetsFormatted ? `${Number(userAssetsFormatted).toFixed(2)} nUSD` : '—'} />
        <StatBox label="Total Pool"     value={totalAssetsFormatted ? `${Number(totalAssetsFormatted).toFixed(2)} nUSD` : '—'} />
        <StatBox label="Shares"      value={userSharesRaw !== undefined ? Number(formatUnits(userSharesRaw, 18)).toFixed(4) : '—'} />
        <StatBox label="Health"            value={isLoading ? 'SCANNING...' : 'NOMINAL'} live={!isLoading} />
      </div>
    </div>
  );
}

function IntentPanel() {
  const [intent, setIntent] = useState('');
  const [loading, setLoading] = useState(false);
  async function submitIntent() {
    setLoading(true);
    setTimeout(() => {
        toast.success('Intent Dispatched', { description: 'Autonomous agents are sourcing yield.' });
        setLoading(false);
    }, 1500);
  }
  return (
    <div className="glass-card p-8">
      <p className="panel-title mb-6">Agent Intelligence Console</p>
      <textarea 
        value={intent}
        onChange={(e) => setIntent(e.target.value)}
        placeholder="Maximize yield while minimizing drawdown..."
        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm mb-4 resize-none"
        rows={3}
      />
      <button onClick={submitIntent} disabled={loading || !intent} className="btn-primary w-full py-4">{loading ? 'Processing...' : 'Deploy Global Intent →'}</button>
    </div>
  );
}

function VaultForm() {
  const [tab, setTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const { address } = useAccount();
  const { approve, deposit, redeem, userSharesRaw, assetAddress, isDepositing, isRedeeming, isApproving, refetch } = useVault();
  
  const allowance = useReadContract({
    address: assetAddress, abi: ERC20_ABI, functionName: 'allowance',
    args: address ? [address, vaultManagerConfig.address] : undefined,
  });

  const handleDeposit = async () => {
    if (!amount) return;
    try {
      const amountBig = parseUnits(amount, 6);
      if ((allowance.data ?? BigInt(0)) < amountBig) {
        await approve(amountBig);
        toast.success('Approval Confirmed');
      }
      const hash = await deposit(amountBig);
      toast.success('Deposit Successful');
      setAmount('');
      refetch();
    } catch (e: any) {
      toast.error('Deposit Failed', { description: e.message });
    }
  };

  const handleRedeem = async () => {
    if (!amount) return;
    try {
        const sharesBig = parseUnits(amount, 18);
        await redeem(sharesBig);
        toast.success('Withdrawal Initiated');
        setAmount('');
        refetch();
    } catch (e: any) {
        toast.error('Redeem Failed', { description: e.message });
    }
  };

  return (
    <div className="glass-card p-8">
      <p className="panel-title mb-8">Execute Settlement</p>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab('deposit')} className={`px-4 py-2 rounded-lg text-xs font-bold ${tab === 'deposit' ? 'bg-white text-black' : 'text-white/40'}`}>Deposit</button>
        <button onClick={() => setTab('withdraw')} className={`px-4 py-2 rounded-lg text-xs font-bold ${tab === 'withdraw' ? 'bg-white text-black' : 'text-white/40'}`}>Withdraw</button>
      </div>
      <input 
        type="number" value={amount} onChange={(e) => setAmount(e.target.value)} 
        placeholder="0.00" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-xl text-white mb-6"
      />
      <button 
        onClick={tab === 'deposit' ? handleDeposit : handleRedeem}
        disabled={isDepositing || isApproving || isRedeeming || !amount}
        className="btn-primary w-full py-4"
      >
        {isApproving ? 'APPROVING...' : (isDepositing || isRedeeming) ? 'EXECUTING...' : 'CONFIRM'}
      </button>
    </div>
  );
}

function StatBox({ label, value, live }: { label: string; value: string; live?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-1">{label}</p>
      <p className={`text-lg font-bold ${live ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}
