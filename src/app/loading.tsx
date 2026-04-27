"use client";

import { m } from "framer-motion";

const MATH_SYMBOLS = ["∑", "∫", "π", "∞", "√", "Δ", "θ", "λ"];

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface">
      {/* Floating math symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {MATH_SYMBOLS.map((sym, i) => (
          <m.span
            key={sym}
            className="absolute text-zinc-400/20 font-heading font-black select-none"
            style={{
              fontSize: `${2 + (i % 3)}rem`,
              left: `${10 + (i * 11) % 80}%`,
              top: `${15 + (i * 13) % 70}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, i % 2 === 0 ? 15 : -15, 0],
            }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          >
            {sym}
          </m.span>
        ))}
      </div>

      {/* Central loader */}
      <div className="relative flex flex-col items-center gap-8">
        {/* Orbiting dots */}
        <div className="relative w-16 h-16">
          {[0, 1, 2].map((i) => (
            <m.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-zinc-400"
              style={{
                top: "50%",
                left: "50%",
                marginTop: "-6px",
                marginLeft: "-6px",
              }}
              animate={{
                x: Math.cos((2 * Math.PI * i) / 3) * 24,
                y: Math.sin((2 * Math.PI * i) / 3) * 24,
                scale: [1, 0.5, 1],
                opacity: [1, 0.3, 1],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Brand text */}
        <m.p
          className="text-zinc-400/60 text-sm font-medium tracking-widest uppercase"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Berkan Matematik
        </m.p>
      </div>
    </div>
  );
}
