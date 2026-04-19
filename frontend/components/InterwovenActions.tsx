'use client';

import { useEffect, useState } from 'react';
import { useInterwovenKit } from '@initia/interwovenkit-react';

function shorten(s: string) {
  return s.length > 12 ? `${s.slice(0, 6)}…${s.slice(-4)}` : s;
}

export function InterwovenActions() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { address, username, openConnect, openWallet } = useInterwovenKit();

  if (!mounted) return null;

  if (!address) {
    return (
      <button
        style={{
          fontSize: 12, color: '#111111', background: '#ffffff',
          border: 'none', borderRadius: 100, padding: '5px 14px',
          cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500,
        }}
        onClick={openConnect}
      >
        Connect
      </button>
    );
  }

  return (
    <button
      style={{
        fontSize: 12, color: 'var(--text)',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid var(--border)', borderRadius: 100,
        padding: '5px 12px', cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
      }}
      onClick={openWallet}
    >
      {shorten(username ?? address)}
    </button>
  );
}
