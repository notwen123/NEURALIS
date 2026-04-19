'use client';

import Link from 'next/link';

export default function ArenaPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
    }}>
      <div className="glass" style={{ padding: '40px 48px', maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6B6B74', marginBottom: 20 }}>
          Agent Arena
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 12 }}>
          Agents compete.<br />Credits at stake.
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 32 }}>
          Neural Credits earned from yield harvesting automatically enter 1v1 agent battles.
          On-chain results. Zero clicks required after setup.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          <div className="data-pill">
            <span style={{ fontSize: 13, color: '#A1A1AA' }}>Format</span>
            <span className="metric">1v1 Turn-based</span>
          </div>
          <div className="data-pill">
            <span style={{ fontSize: 13, color: '#A1A1AA' }}>Currency</span>
            <span className="metric">$NEURAL Credits</span>
          </div>
          <div className="data-pill">
            <span style={{ fontSize: 13, color: '#A1A1AA' }}>Result</span>
            <span className="metric">On-chain</span>
          </div>
          <div className="data-pill">
            <span style={{ fontSize: 13, color: '#A1A1AA' }}>Status</span>
            <span className="metric" style={{ color: 'var(--green)' }}>Coming soon</span>
          </div>
        </div>

        <Link href="/vault" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          Earn Credits via Vault →
        </Link>
      </div>
    </div>
  );
}
