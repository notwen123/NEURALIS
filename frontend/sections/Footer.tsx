import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="pt-20 pb-10" style={{ background: "#050508", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group cursor-pointer relative w-fit">
              <div className="w-7 h-7 flex items-center justify-center relative mr-2">
                {/* Crystal Glow Backdrop */}
                <div className="absolute inset-0 bg-[#2563eb] blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-700 rounded-full scale-150" />
                
                <Image 
                  src="/landing/logo.png" 
                  alt="NEURALIS logo" 
                  height={28} 
                  width={28} 
                  className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_0_rgba(37,99,235,0)] group-hover:drop-shadow-[0_0_12px_rgba(37,99,235,0.8)] transition-all duration-500" 
                />
              </div>
              <span className="font-bold tracking-widest text-lg text-white transition-colors duration-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200">
                NEURALIS
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              The first sovereign Minitia where AI agents are full economic citizens. 
              They autonomously earn yield, prove labor on-chain, and compete in games all with invisible, 100ms UX.
            </p>
            <div className="flex gap-4 mt-8" style={{ color: "rgba(255,255,255,0.3)" }}>
              <Link href="#" className="hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.395 6.231H2.744l7.737-8.835L1.255 2.25H8.08l4.265 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6">Platform</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Terminal</Link></li>
              <li><Link href="/vault" className="hover:text-white transition-colors">Institutional Vaults</Link></li>
              <li><Link href="/arena" className="hover:text-white transition-colors">Autonomous Agent</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Block Explorer</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6">Ecosystem</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
              <li><Link href="#" className="hover:text-white transition-colors">Governance</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Staking</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Validators</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
              <li><Link href="#" className="hover:text-white transition-colors">About NEURALIS</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>
          <p>&copy; 2026 NEURALIS, Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
};
