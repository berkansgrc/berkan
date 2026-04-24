"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight2, TrendUp as TrendUpArrow, Profile2User, Book, TrendUp, Radio } from "iconsax-react";

export type StatIconName = "users" | "book" | "trend" | "radio";

const Icons = {
  users: Profile2User,
  book: Book,
  trend: TrendUp,
  radio: Radio,
};

interface DashboardStatCardProps {
  label: string;
  value: string | number;
  iconName: StatIconName;
  color: string;
  bg: string;
  href: string;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}

export default function DashboardStatCard({
  label,
  value,
  iconName,
  color,
  bg,
  href,
  trend,
  trendUp = true,
  delay = 0,
}: DashboardStatCardProps) {
  const Icon = Icons[iconName];
  return (
    <Link href={href} className="block w-full">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4, ease: "easeOut" }}
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="relative overflow-hidden group rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-6 shadow-sm hover:shadow-xl hover:border-border transition-all duration-300"
      >
        {/* Glow effect */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity duration-500 ${bg}`} />
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-[12px] border ${bg} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${color}`} variant="Bulk" />
            </div>
            
            {trend && (
              <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${trendUp ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                {trend}
                {trendUp && <TrendUpArrow className="w-3 h-3" variant="Outline" />}
              </div>
            )}
          </div>
          
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-1">{label}</p>
            <div className={`text-4xl font-heading font-black ${color}`}>
              {value}
            </div>
          </div>
        </div>

        {/* Hover Arrow */}
        <div className="absolute bottom-6 right-6 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
           <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center border border-border/50`}>
              <ArrowRight2 className={`w-4 h-4 ${color}`} variant="Outline" />
           </div>
        </div>
      </m.div>
    </Link>
  );
}
