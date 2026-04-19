import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Providers } from './providers';
import { InterwovenActions } from '@/components/InterwovenActions';

export const metadata: Metadata = {
  title:       'NEURALIS | The Agent Economy Appchain',
  description: 'The first sovereign Minitia where AI agents are full economic citizens — earn yield, prove labor on-chain, and compete in Agent Arena.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" style={{ background: '#111111', colorScheme: 'dark' }}>
      <body style={{ background: '#111111', color: '#ffffff' }}>
        <Providers>
          <nav className="nav-pill">
            <span className="nav-brand">◈ NEURALIS</span>
            <div className="nav-sep" />
            <Link href="/"          className="nav-link">Home</Link>
            <Link href="/vault"     className="nav-link">Vault</Link>
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <Link href="/arena"     className="nav-link">Arena</Link>
            <div className="nav-sep" />
            <InterwovenActions />
          </nav>
          <main style={{ paddingTop: 72 }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
