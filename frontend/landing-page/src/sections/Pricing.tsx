"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Social Login",
    description:
      "Sign in with Google or Email — no seed phrase, no wallet setup. InterwovenKit handles everything under the hood.",
    color: "text-violet-400",
    border: "border-violet-500/20",
  },
  {
    number: "02",
    title: "Set Your Intent",
    description:
      'Tell the agent what you want: "Maximize safe yield with my 100 USDC." Natural language → on-chain action via ProgrammableIntents.',
    color: "text-cyan-400",
    border: "border-cyan-500/20",
  },
  {
    number: "03",
    title: "24h Auto-signing Activates",
    description:
      "One approval. The agent acts freely for 24 hours — no confirmation popups, no transaction fatigue. Pure invisible UX.",
    color: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  {
    number: "04",
    title: "Agent Harvests Yield",
    description:
      "Claude AI scores strategies, recommends optimal allocations, signs the rebalance, and submits it on-chain via KeeperExecutor.",
    color: "text-orange-400",
    border: "border-orange-500/20",
  },
  {
    number: "05",
    title: "Labor Badge Minted",
    description:
      "Every completed agent cycle mints a MoveVM Soulbound Labor Badge — verifiable proof-of-work that builds on-chain reputation.",
    color: "text-pink-400",
    border: "border-pink-500/20",
  },
  {
    number: "06",
    title: "Earn Credits → Arena",
    description:
      "Neural Credits from yield automatically enter Agent Arena. 1v1 battles play out on-chain. You watch. You earn. Zero clicks.",
    color: "text-yellow-400",
    border: "border-yellow-500/20",
  },
];

export const Pricing = () => {
  return (
    <section id="how-it-works" className="py-28 bg-[#07070f] relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="section-heading mb-16">
          <div className="flex justify-center mb-4">
            <div className="tag">How It Works</div>
          </div>
          <h2 className="section-title mt-4">
            From Login to Battle Victory in 30 Seconds
          </h2>
          <p className="section-description mt-5">
            The entire agent economy loop — work, earn, play, grow — happens
            automatically after a single login.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`card ${step.border} bg-white/[0.03] flex gap-5 p-6`}
            >
              <div className={`text-3xl font-bold tracking-tighter ${step.color} opacity-60 shrink-0 w-10`}>
                {step.number}
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loop callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 card border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 text-center py-8"
        >
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">The Closed Loop</p>
          <div className="flex items-center justify-center gap-3 flex-wrap text-sm font-medium">
            {["Work", "Earn", "Play", "Grow", "Repeat"].map((word, i, arr) => (
              <span key={word} className="flex items-center gap-3">
                <span className="text-white/80">{word}</span>
                {i < arr.length - 1 && <span className="text-violet-400">→</span>}
              </span>
            ))}
          </div>
          <p className="text-white/30 text-xs mt-3">
            Every cycle compounds agent reputation and sequencer revenue
          </p>
        </motion.div>
      </div>
    </section>
  );
};
