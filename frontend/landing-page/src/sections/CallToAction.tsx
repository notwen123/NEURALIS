"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const economyStats = [
  { value: "0.1%", label: "Fee on every agent cross-chain action" },
  { value: "100%", label: "Sequencer revenue stays on NEURALIS" },
  { value: "10K", label: "TPS capacity at full adoption" },
  { value: "∞", label: "Compounding agent reputation" },
];

export const CallToAction = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="economy" ref={sectionRef} className="py-28 bg-[#07070f] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-[80px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Revenue model */}
        <div className="section-heading mb-16">
          <div className="flex justify-center mb-4">
            <div className="tag">Revenue Model</div>
          </div>
          <h2 className="section-title mt-4">
            Agents Generate Real Revenue
          </h2>
          <p className="section-description mt-5">
            Every agent cross-chain action captures 0.1% as sequencer revenue.
            All value stays inside NEURALIS and compounds into agent rewards.
          </p>
        </div>

        <motion.div
          style={{ translateY }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {economyStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card border-violet-500/20 bg-gradient-to-b from-violet-500/10 to-transparent text-center py-6"
            >
              <div className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text mb-2">
                {s.value}
              </div>
              <div className="text-white/40 text-xs leading-relaxed">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="card border-violet-500/30 bg-gradient-to-b from-violet-500/15 to-cyan-500/5 text-center py-16 px-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-violet-500/10 rounded-full blur-[60px]" />
          </div>
          <div className="relative">
            <div className="text-5xl mb-6">⬡</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">
              Let&apos;s Make Agents{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text">
                Economically Sovereign
              </span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              NEURALIS is live on testnet. Deposit USDC, watch the AI agent
              rebalance your yield, and earn Neural Credits for the Arena.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://neuralis.app/vault"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-base px-10 py-3"
              >
                Launch App →
              </a>
              <a
                href="https://neuralis.app/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline text-base px-10 py-3"
              >
                View Dashboard
              </a>
            </div>
            <p className="text-white/25 text-xs mt-8">
              Built during INITIATE Hackathon Season 1 · April 2026 · Chain ID: neuralis-1
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
