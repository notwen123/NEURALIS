import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-[#03030a] border-t border-white/5 text-white/40 text-sm py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
              ⬡
            </div>
            <div>
              <div className="text-white font-bold text-base tracking-tight">NEURALIS</div>
              <div className="text-white/30 text-xs">The Agent Economy Appchain</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap justify-center gap-6 text-white/40 text-sm">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#economy" className="hover:text-white transition-colors">Economy</a>
            <Link href="https://neuralis.app/vault" className="hover:text-white transition-colors">App</Link>
          </nav>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:border-white/30 hover:text-white transition-all"
              aria-label="Twitter / X"
            >
              𝕏
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:border-white/30 hover:text-white transition-all text-xs"
              aria-label="GitHub"
            >
              GH
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/25">
          <p>© 2026 NEURALIS. Built during INITIATE Hackathon Season 1.</p>
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
            <span>Testnet live · neuralis-1 · Minitia on Initia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
