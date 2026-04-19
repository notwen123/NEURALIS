"use client";

import { motion } from "framer-motion";

const techStack = [
  { label: "Initia", icon: "⬡" },
  { label: "OPinit Stack", icon: "🔗" },
  { label: "MoveVM", icon: "◈" },
  { label: "EVM", icon: "⟠" },
  { label: "Claude AI", icon: "🤖" },
  { label: "ERC-4626", icon: "🏦" },
  { label: "InterwovenKit", icon: "🌐" },
  { label: "Uniswap V2", icon: "🦄" },
  { label: "OpenZeppelin", icon: "🛡" },
  { label: "Foundry", icon: "⚒" },
  { label: "Next.js", icon: "▲" },
  { label: "Wagmi", icon: "🔌" },
];

// Duplicate for seamless loop
const items = [...techStack, ...techStack];

export const LogoTicker = () => {
  return (
    <div className="py-10 border-y border-white/5 bg-white/[0.02] overflow-hidden">
      <p className="text-center text-xs uppercase tracking-widest text-white/25 mb-6">
        Built with
      </p>
      <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <motion.div
          className="flex gap-8 flex-none pr-8"
          animate={{ translateX: "-50%" }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors whitespace-nowrap text-sm font-medium"
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
