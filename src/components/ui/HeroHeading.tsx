"use client";

import { m, Variants } from "framer-motion";

// ─── Dekoratif el-çizimi altçizgi SVG ─────────────────────────────────────────
function HandDrawnUnderline() {
  return (
    <m.svg
      viewBox="0 0 200 12"
      className="absolute -bottom-2 left-0 w-full h-3 overflow-visible"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
    >
      <m.path
        d="M4 8 C 30 2, 60 12, 100 6 C 140 0, 170 10, 196 5"
        stroke="url(#underline-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
      />
      <defs>
        <linearGradient id="underline-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.5" />
        </linearGradient>
      </defs>
    </m.svg>
  );
}

// ─── Animasyon Tanımları ────────────────────────────────────────────────────────
const lineVariants: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 90,
      delay,
    },
  }),
};

const accentVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.9, rotate: -8, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: -2,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 14,
      stiffness: 80,
      delay: 0.35,
    },
  },
};

// ─── HeroHeading ────────────────────────────────────────────────────────────────
export default function HeroHeading() {
  return (
    <h1 className="text-center leading-[1.05]">
      {/* Satır 1: "Matematiği" — yapısal, cesur */}
      <m.span
        className="block font-heading font-black text-4xl md:text-6xl lg:text-[5.5rem] tracking-[-0.04em] text-foreground"
        variants={lineVariants}
        custom={0.05}
        initial="hidden"
        animate="visible"
      >
        Matematiği
      </m.span>

      {/* Satır 2: "Anla," — el yazısı, gradient, hafif eğik, altçizgili */}
      <m.span
        className="relative inline-block mt-1 md:mt-2"
        variants={accentVariants}
        initial="hidden"
        animate="visible"
      >
        <span className="font-chalk text-5xl md:text-7xl lg:text-[7rem] bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient-shift_4s_ease-in-out_infinite] drop-shadow-[0_0_40px_rgba(154,235,228,0.2)]">
          Anla,
        </span>
        <HandDrawnUnderline />
      </m.span>

      {/* Satır 3: "Formülü Değil." — yapısal, "Değil." yarı şeffaf */}
      <m.span
        className="block font-heading font-black text-4xl md:text-6xl lg:text-[5.5rem] tracking-[-0.04em] mt-1 md:mt-2"
        variants={lineVariants}
        custom={0.65}
        initial="hidden"
        animate="visible"
      >
        <span className="text-foreground">Formülü </span>
        <span className="text-foreground/40">Değil.</span>
      </m.span>
    </h1>
  );
}
