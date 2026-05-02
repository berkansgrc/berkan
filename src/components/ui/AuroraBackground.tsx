"use client";

const MATH_SYMBOLS = [
  { symbol: "∫", x: "8%",  y: "15%", size: "2rem",  delay: "0s",   duration: "14s", opacity: 0.06 },
  { symbol: "∑", x: "82%", y: "8%",  size: "2.4rem", delay: "2s",   duration: "18s", opacity: 0.07 },
  { symbol: "π", x: "20%", y: "72%", size: "1.8rem", delay: "4s",   duration: "12s", opacity: 0.05 },
  { symbol: "∞", x: "75%", y: "60%", size: "2.2rem", delay: "1s",   duration: "16s", opacity: 0.06 },
  { symbol: "√", x: "50%", y: "20%", size: "1.6rem", delay: "6s",   duration: "20s", opacity: 0.04 },
  { symbol: "Δ", x: "90%", y: "40%", size: "1.8rem", delay: "3s",   duration: "15s", opacity: 0.05 },
  { symbol: "θ", x: "5%",  y: "55%", size: "1.5rem", delay: "8s",   duration: "17s", opacity: 0.05 },
  { symbol: "λ", x: "62%", y: "85%", size: "2rem",   delay: "5s",   duration: "13s", opacity: 0.06 },
  { symbol: "≈", x: "38%", y: "45%", size: "1.4rem", delay: "9s",   duration: "19s", opacity: 0.04 },
  { symbol: "∂", x: "15%", y: "88%", size: "1.7rem", delay: "7s",   duration: "11s", opacity: 0.05 },
];

export default function AuroraBackground() {
  return (
    <div className="aurora-bg pointer-events-none" aria-hidden="true">
      {/* Aurora Katmanları */}
      <div className="aurora-layer aurora-layer-1" />
      <div className="aurora-layer aurora-layer-2" />
      <div className="aurora-layer aurora-layer-3" />

      {/* Noise Texture Overlay */}
      <div className="aurora-noise" />

      {/* Floating Math Symbols */}
      {MATH_SYMBOLS.map(({ symbol, x, y, size, delay, duration, opacity }) => (
        <span
          key={`${symbol}-${x}`}
          className="aurora-math-symbol"
          style={{
            left: x,
            top: y,
            fontSize: size,
            animationDelay: delay,
            animationDuration: duration,
            opacity,
          }}
        >
          {symbol}
        </span>
      ))}
    </div>
  );
}
