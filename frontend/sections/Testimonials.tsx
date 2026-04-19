"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";
import { AnimatedDivider } from "./Hero";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Testimonial {
  text: string;
  imageSrc: string;
  name: string;
  username: string;
}

const testimonials: Testimonial[] = [
  { text: "Finally a crypto app where I don't have to click 'Approve Transaction' fifty times. The 24-hour auto-signing session is a massive relief.", imageSrc: "/landing/avatar-1.png", name: "Cool Dude", username: "@coolDude" },
  { text: "I just deposited my USDC via Google login and went to sleep. Woke up to find my agent captured a 12% yield spike across 3 networks automatically.", imageSrc: "/landing/avatar-2.png", name: "Hermione Granger", username: "@hermione" },
  { text: "The 100ms block times make this feel exactly like a native Web2 app. No waiting, no failed transactions, just instant execution.", imageSrc: "/landing/avatar-3.png", name: "Jasmine", username: "@jasmine" },
  { text: "Earning real sequencer revenue from the agent's work is brilliant. It's the first time I've felt like the protocol is actually working for me.", imageSrc: "/landing/avatar-4.png", name: "Carl Norwin", username: "@carlnorwin" },
  { text: "I teleported liquidity across the Initia ecosystem and didn't even notice the bridge. The agent handles all the complex routing in the background.", imageSrc: "/landing/avatar-5.png", name: "Bunny", username: "@bunny" },
  { text: "Earning Neural credits and using them to battle in the Agent Arena is insanely fun. It perfectly bridges DeFi yields with actual gameplay.", imageSrc: "/landing/avatar-6.png", name: "Billionaire Obo", username: "@billionaire" },
  { text: "It's refreshing not having to worry about seed phrases. The social login makes onboarding my non-crypto friends actually possible.", imageSrc: "/landing/avatar-7.png", name: "Tom", username: "@tom" },
  { text: "The Labor Badges give my agent true on-chain rep. Seeing verifiable proof of the trades it executed while I was offline is incredible.", imageSrc: "/landing/avatar-8.png", name: "21th Century Hacker", username: "@21thCentury" },
  { text: "Zero gas fees for end users changes everything. It feels like magic to just speak my intent and watch the agent deploy my capital.", imageSrc: "/landing/avatar-9.png", name: "Sinchan", username: "@sinchan" },
];

const firstColumn  = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn  = testimonials.slice(6, 9);

const TestimonialsColumn = ({ className, testimonials, duration = 10 }: { className?: string; testimonials: Testimonial[]; duration?: number }) => (
  <div className={className}>
    <motion.div
      animate={{ translateY: "-50%" }}
      transition={{ duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
      className="flex flex-col gap-6 pb-6"
    >
      {[...new Array(2)].fill(0).map((_, index) => (
        <React.Fragment key={index}>
          {testimonials.map(({ text, imageSrc, name, username }) => (
            <motion.div
              key={text}
              className="p-6 rounded-3xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              whileHover={{
                background: "rgba(255,255,255,0.06)",
                borderColor: "rgba(255,255,255,0.12)",
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
            >
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{text}</p>
              <div className="flex items-center gap-2 mt-5">
                <Image src={imageSrc} alt={name} width={40} height={40} className="h-10 w-10 rounded-full" />
                <div className="flex flex-col">
                  <div className="font-medium tracking-tight leading-5 text-white text-sm">{name}</div>
                  <div className="leading-5 tracking-tight text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{username}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </React.Fragment>
      ))}
    </motion.div>
  </div>
);

export const Testimonials = () => {
  return (
    <>
      <AnimatedDivider />
      <section className="py-24" style={{ background: "#050508" }}>
        <div className="container">
          <motion.div
            className="section-heading"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="flex justify-center">
              <div className="tag">Testimonials</div>
            </div>
            <h2 className="section-title mt-5">What our users say</h2>
            <p className="section-description">
              From intuitive design to powerful features, our app has become an
              essential tool for users around the world.
            </p>
          </motion.div>

          <motion.div
            className="flex justify-center gap-6 mt-10 max-h-[738px] overflow-hidden"
            style={{ maskImage: "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <TestimonialsColumn testimonials={firstColumn}  duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn}  className="hidden lg:block" duration={17} />
          </motion.div>
        </div>
      </section>
    </>
  );
};
