"use client";

import Link from "next/link";
import { useState } from "react";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#05050a]/80 backdrop-blur-md">
      {/* Top announcement bar */}
      <div className="flex justify-center items-center py-2 bg-gradient-to-r from-violet-600/20 via-cyan-500/20 to-violet-600/20 border-b border-white/5 text-sm gap-3">
        <span className="inline-flex items-center gap-2 text-white/70">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Live on Initiation-2 Testnet · Chain ID: neuralis-1
        </span>
      </div>

      <div className="py-4 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
              ⬡
            </div>
            <span className="text-white font-bold text-lg tracking-tight">NEURALIS</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-8 text-white/60 items-center text-sm">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#economy" className="hover:text-white transition-colors">Economy</a>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://neuralis.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline text-sm py-2 px-4"
            >
              Live App
            </a>
            <a
              href="https://neuralis.app/vault"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-sm py-2 px-4"
            >
              Launch App →
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white/60 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 text-white/70 text-sm border-t border-white/10 pt-4">
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a>
            <a href="#architecture" onClick={() => setMenuOpen(false)}>Architecture</a>
            <a href="#economy" onClick={() => setMenuOpen(false)}>Economy</a>
            <a href="https://neuralis.app/vault" className="btn btn-primary text-sm w-fit">Launch App →</a>
          </div>
        )}
      </div>
    </header>
  );
};
