"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: "🏦",
    title: "Agentic Yield Vault",
    description:
      "ERC-4626 vault where Claude AI autonomously rebalances allocations across strategies. Every cycle is signed on-chain — verifiable, trustless, transparent.",
    tag: "DeFi Engine",
    color: "from-violet-500/20 to-violet-500/5",
    border: "border-violet-500/20",
  },
  {
    icon: "🏅",
    title: "Labor Badges (SBT)",
    description:
      "MoveVM Soulbound tokens minted every time an agent completes verifiable work. On-chain reputation that compounds over time — agents build real credit history.",
    tag: "MoveVM Primitive",
    color: "from-cyan-500/20 to-cyan-500/5",
    border: "border-cyan-500/20",
  },
  {
    icon: "⚔️",
    title: "Agent Arena",
    description:
      "Neural Credits earned from yield harvesting automatically enter 1v1 PvP battles. On-chain results, zero clicks. Agents compete, humans watch and earn.",
    tag: "Gaming Layer",
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/20",
  },
  {
    icon: "🌉",
    title: "Interwoven Bridge",
    description:
      "Teleport liquidity across Minitias in one agent action. Agents harvest the best yield rates across the entire Initia ecosystem — not just one chain.",
    tag: "Cross-chain",
    color: "from-orange-500/20 to-orange-500/5",
    border: "border-orange-500/20",
  },
  {
    icon: "🔏",
    title: "Programmable Intents",
    description:
      "Users say what they want in natural language. The MoveVM ProgrammableIntents module translates intent → on-chain action. No seed phrases, no popups.",
    tag: "AI Layer",
    color: "from-pink-500/20 to-pink-500/5",
    border: "border-pink-500/20",
  },
  {
    icon: "💰",
    title: "Sequencer Revenue",
    description:
      "0.1% fee on every agent cross-chain action stays inside NEURALIS. Agents generate real sequencer revenue — the chain earns as agents work.",
    tag: "Revenue Model",
    color: "from-yellow-500/20 to-yellow-500/5",
    border: "border-yellow-500/20",
  },
];

export const ProductShowcase = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-28 bg-[#05050a] relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="section-heading mb-16">
          <div className="flex justify-center mb-4">
            <div className="tag">Core Features</div>
          </div>
          <h2 className="section-title mt-4">
            The Full Agent Economy Stack
          </h2>
          <p className="section-description mt-5">
            Not just another dApp. NEURALIS is infrastructure — every primitive
            needed for agents to work, earn, and grow on-chain.
          </p>
        </div>

        <motion.div
          style={{ translateY }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`card card-hover bg-gradient-to-b ${f.color} ${f.border} p-6`}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <div className="tag mb-3 text-[10px]">{f.tag}</div>
              <h3 className="text-white font-semibold text-lg mb-2 tracking-tight">
                {f.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
