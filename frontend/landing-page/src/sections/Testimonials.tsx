"use client";

import { motion } from "framer-motion";

const architectureLayers = [
  {
    layer: "Base Layer",
    tech: "OPinit Stack + MoveVM",
    detail: "Custom Minitia · $NEURAL gas token · 100ms blocks",
    color: "border-violet-500/30 bg-violet-500/5",
    icon: "⬡",
  },
  {
    layer: "Wallet & UX",
    tech: "InterwovenKit + Social Login",
    detail: "Google/Email auth · 24h auto-signing · No seed phrases",
    color: "border-cyan-500/30 bg-cyan-500/5",
    icon: "🔐",
  },
  {
    layer: "MoveVM Primitives",
    tech: "ProgrammableIntents · LaborBadge · AgentArena",
    detail: "Soulbound SBTs · Intent execution · Credit battles",
    color: "border-emerald-500/30 bg-emerald-500/5",
    icon: "◈",
  },
  {
    layer: "DeFi Engine",
    tech: "ERC-4626 Vault + Interwoven Bridge",
    detail: "Multi-strategy yield · Cross-chain liquidity teleport",
    color: "border-orange-500/30 bg-orange-500/5",
    icon: "🏦",
  },
  {
    layer: "AI Layer",
    tech: "Claude LLM → KeeperExecutor",
    detail: "Off-chain reasoning · ECDSA signed · On-chain verified",
    color: "border-pink-500/30 bg-pink-500/5",
    icon: "🤖",
  },
  {
    layer: "Oracle Hook",
    tech: "Initia Native Oracle",
    detail: "Off-chain price signals · Risk scoring · APY feeds",
    color: "border-yellow-500/30 bg-yellow-500/5",
    icon: "📡",
  },
];

const comparisonRows = [
  { feature: "Agent spending limits", others: "Yes", neuralis: "Yes + on-chain enforcement" },
  { feature: "Agent marketplace", others: "Yes", neuralis: "Yes + self-earning agents" },
  { feature: "Verifiable labor", others: "No", neuralis: "MoveVM Labor Badges (SBT)" },
  { feature: "Closed economic loop", others: "No", neuralis: "Earn → Play → Grow reputation" },
  { feature: "Real sequencer revenue", others: "Theoretical", neuralis: "Demo-able cross-chain fees" },
  { feature: "Invisible UX", others: "Partial", neuralis: "Full 24h auto-signing" },
];

export const Testimonials = () => {
  return (
    <section id="architecture" className="py-28 bg-[#05050a] relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Architecture */}
        <div className="section-heading mb-16">
          <div className="flex justify-center mb-4">
            <div className="tag">Architecture</div>
          </div>
          <h2 className="section-title mt-4">
            Six Layers. One Sovereign Chain.
          </h2>
          <p className="section-description mt-5">
            Every layer is purpose-built for the agent economy — from 100ms
            block times to MoveVM Soulbound primitives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-24">
          {architectureLayers.map((layer, i) => (
            <motion.div
              key={layer.layer}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={`card ${layer.color} p-5`}
            >
              <div className="text-2xl mb-3">{layer.icon}</div>
              <div className="text-xs uppercase tracking-widest text-white/30 mb-1">{layer.layer}</div>
              <div className="text-white font-semibold text-sm mb-2">{layer.tech}</div>
              <div className="text-white/40 text-xs leading-relaxed">{layer.detail}</div>
            </motion.div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="section-heading mb-10" style={{ maxWidth: "100%" }}>
          <div className="flex justify-center mb-4">
            <div className="tag">Competitive Edge</div>
          </div>
          <h2 className="section-title mt-4 text-3xl md:text-4xl">
            NEURALIS vs. Everything Else
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card border-white/10 overflow-hidden"
        >
          <div className="grid grid-cols-3 text-xs uppercase tracking-widest text-white/30 px-6 py-3 border-b border-white/5">
            <span>Feature</span>
            <span className="text-center">Most Submissions</span>
            <span className="text-center text-violet-400">NEURALIS</span>
          </div>
          {comparisonRows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 px-6 py-4 text-sm ${
                i % 2 === 0 ? "bg-white/[0.02]" : ""
              } border-b border-white/5 last:border-0`}
            >
              <span className="text-white/60">{row.feature}</span>
              <span className="text-center text-white/30">{row.others}</span>
              <span className="text-center text-emerald-400 font-medium">{row.neuralis}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
