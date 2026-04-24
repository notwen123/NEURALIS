import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';
export const metadata: Metadata = {
  title:       'NEURALIS | The Agent Economy Appchain',
  description: 'The first sovereign Minitia where AI agents are full economic citizens — earn yield, prove labor on-chain, and compete in Agent Arena.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" style={{ background: '#111111', colorScheme: 'dark' }}>
      <body style={{ background: '#111111', color: '#ffffff' }}>
        <Providers>
          <main>
            {children}
          </main>
          <Toaster 
            theme="dark" 
            position="bottom-right" 
            toastOptions={{
              className: 'bg-zinc-900/80 backdrop-blur-xl border border-white/10 text-white',
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
