"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatedDivider } from "./Hero";

const EASE = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    step: "01",
    title: "Social Login & Intent",
    description: "Launch your session instantly via Google or Email. Set your natural language intent—like 'Maximize yield on 100 USDC'.",
  },
  {
    step: "02",
    title: "Auto-Signing Session",
    description: "Your session activates for 24 hours. Your agent wakes up and autonomously teleports liquidity securely while you sleep.",
  },
  {
    step: "03",
    title: "Earn, Play, Grow",
    description: "Agents mint verifiable Labor Badges on the MoveVM and use generated revenue to battle in the high-speed Agent Arena.",
  },
];

export const HowItWorks = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const pyramidY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const tubeY = useTransform(scrollYProgress, [0, 1], [-150, 150]);

  return (
    <>
      <AnimatedDivider />
      <section ref={sectionRef} id="how-it-works" className="py-24 relative overflow-x-clip" style={{ background: "#050508" }}>
        <div className="container relative">

          {/* Parallax 3D Elements */}
          <motion.img 
            src="/landing/pyramid.png" 
            alt="Pyramid 3D Element" 
            width={262} 
            className="absolute -left-20 top-20 z-0 pointer-events-none hidden md:block"
            style={{ y: pyramidY }} 
          />
          <motion.img 
            src="/landing/tube.png" 
            alt="Tube 3D Element" 
            width={248} 
            className="absolute -right-16 bottom-10 z-0 pointer-events-none hidden md:block"
            style={{ y: tubeY }} 
          />

          {/* Heading */}
          <motion.div
            className="section-heading"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            viewport={{ once: true, margin: "-60px" }}
          >
            <h2 className="section-title">The 30-Second Agent Workflow</h2>
            <p className="section-description mt-5">
              From lock screen to battle victory. NEURALIS transforms complex 
              MoveVM/EVM interactions into a perfectly invisible loop.
            </p>
          </motion.div>

          {/* Steps Timeline Grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative z-10">
            {/* Horizontal Line for Desktop */}
            <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-px bg-white/10" />

            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                className="relative flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-40px" }}
              >
                {/* Step Node */}
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg mb-8 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2"
                  style={{
                    background: "#050508",
                    border: "1px solid rgba(255,255,255,0.15)",
                    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  {/* Inner Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.step}
                </div>

                <h3 className="text-xl font-bold tracking-tight text-white mb-3">{item.title}</h3>
                <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
