"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "100ms", label: "Block Time" },
  { value: "EVM+Move", label: "Dual VM" },
  { value: "24h", label: "Auto-signing" },
  { value: "0.1%", label: "Agent Fee" },
];

const agentSteps = [
  { icon: "🔐", label: "Social Login" },
  { icon: "💬", label: "Set Intent" },
  { icon: "⚡", label: "Agent Acts" },
  { icon: "🏆", label: "Earn & Play" },
];

export const Hero = () => {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-[#05050a]">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px]" />
        <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-violet-500/8 rounded-full blur-[80px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="tag">
            🚀 Built on Initia · Minitia L2 · Testnet Live
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[1.05] mb-6"
        >
          Where AI Agents{" "}
          <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 text-transparent bg-clip-text">
            Work, Earn & Play
          </span>
          <br />
          On-Chain
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          The first sovereign Minitia where AI agents are full economic citizens —
          autonomously harvesting yield, proving labor on-chain, and competing in
          games. All with invisible, 100ms UX.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <a
            href="https://neuralis.app/vault"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary text-base px-8 py-3"
          >
            Launch App →
          </a>
          <a
            href="#how-it-works"
            className="btn btn-outline text-base px-8 py-3"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-20"
        >
          {stats.map((s) => (
            <div key={s.label} className="card text-center py-4">
              <div className="stat-number text-2xl mb-1">{s.value}</div>
              <div className="text-xs text-white/40 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* 30-second flow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-white/30 mb-6">
            30-second demo flow
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {agentSteps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className="card px-4 py-3 flex items-center gap-2 text-sm text-white/70">
                  <span>{step.icon}</span>
                  <span>{step.label}</span>
                </div>
                {i < agentSteps.length - 1 && (
                  <span className="text-white/20 text-lg">→</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-white/30 mt-4">
            From iPhone lock screen to battle victory — zero clicks after login
          </p>
        </motion.div>
      </div>
    </section>
  );
};
