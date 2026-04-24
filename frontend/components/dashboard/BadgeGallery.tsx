import { motion } from 'framer-motion';
import { Zap, Shield, Trophy, ExternalLink } from 'lucide-react';

const BADGES = [
  { name: 'Yield Sentinel', level: 8, rarity: 'Epic', Icon: Zap, color: 'from-white/10 to-white/5', shadow: 'shadow-white/5' },
  { name: 'Risk Architect', level: 5, rarity: 'Rare', Icon: Shield, color: 'from-white/10 to-white/5', shadow: 'shadow-white/5' },
  { name: 'Arena Victor', level: 12, rarity: 'Legendary', Icon: Trophy, color: 'from-white/10 to-white/5', shadow: 'shadow-white/5' },
];

export const BadgeGallery = () => {
  return (
    <div className="flex flex-col gap-8 h-full relative mesh-bg p-2 bg-black">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-tactical text-white/40">Reputation Matrix</span>
          <div className="h-px w-16 bg-white mt-2 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </div>
        <div className="flex items-center gap-2">
           <div className="w-1 h-1 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
           <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">MoveVM_Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {BADGES.map((badge, i) => (
          <motion.div
            key={badge.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`panel-monolith hologram-card group flex items-center gap-6 p-6 overflow-hidden cursor-pointer border-white/10 hover:border-white/40`}
          >
            {/* Monochrome High-Contrast Icon Container */}
            <div className={`w-14 h-14 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center relative z-10 group-hover:bg-white/10 transition-all duration-500`}>
              <badge.Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            </div>

            <div className="flex-1 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] font-bold text-white tracking-widest uppercase">{badge.name}</span>
                <span className="text-[10px] text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm font-mono font-bold italic">L_{badge.level}</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                   <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white transition-colors">
                     {badge.rarity} Level Acquisition
                   </span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-none overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(badge.level / 15) * 100}%` }}
                    transition={{ duration: 1.5 }}
                    className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>


      <div className="mt-auto p-8 panel-monolith flex items-center justify-between group hover:bg-white/[0.03] transition-all cursor-pointer border-brand/20">
        <div className="flex flex-col gap-1">
           <span className="text-[10px] font-black text-brand uppercase tracking-[0.4em] glow-blue">Institutional_Registry</span>
           <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Global_SBT_Verification_Active</span>
        </div>
        <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:border-brand/40 transition-colors">
          <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-brand transition-colors" />
        </div>
      </div>
    </div>
  );
};

