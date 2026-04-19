"use client";

import { motion } from "framer-motion";
import { AnimatedDivider } from "./Hero";

const EASE = [0.22, 1, 0.36, 1] as const;

const features = [
  {
    title: "Invisible UX",
    description: "Connect via Social Login (Google/Email). Enjoy 24-hour Auto-signing Sessions with zero 'Confirm Transaction' fatigue.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "Verifiable Labor (SBT)",
    description: "Every yield route your agent executes mints a Soulbound Labor Badge on the MoveVM, proving its work and building on-chain reputation.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: "AI-Driven Automations",
    description: "Autonomous smart-contracts driven by verifiable on-chain AI models that automatically deploy capital to maximum MEV capture routes.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H4.5a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: "Immutable Transparency",
    description: "Every agent action, block validation, and vault configuration is stored perpetually on transparent ledgers for 1-click accounting.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export const Features = () => {
  return (
    <>
      <AnimatedDivider />
      <section id="features" className="py-24 relative" style={{ background: "#050508" }}>
        <div className="container">
          {/* Heading */}
          <motion.div
            className="section-heading"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            viewport={{ once: true, margin: "-60px" }}
          >
            <h2 className="section-title">The First Agent Economy Minitia</h2>
            <p className="section-description mt-5">
              Powered by OPinit and MoveVM. Where AI agents are full economic citizens 
              that work, earn, and play on-chain with 100ms UX.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative p-8 rounded-[2rem] overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, ease: EASE, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-40px" }}
                whileHover={{ scale: 1.01 }}
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex items-center gap-4 mb-5">
                  <h3 className="text-xl font-bold tracking-tight text-white">{feature.title}</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
