"use client";

import { useEffect, useState, useRef } from "react";
import { Clock, Cpu } from "iconsax-react";

interface CounterConfig {
  label: string;
  sublabel: string;
  baseValue: number;
  incrementPerSecond: number;
  color: string;
  format: (n: number) => string;
}

const COUNTERS: CounterConfig[] = [
  {
    label: "π Basamağı Hesaplandı",
    sublabel: "Bu sayfayı açtığından beri",
    baseValue: 0,
    incrementPerSecond: 127,
    color: "#006762",
    format: (n) => n.toLocaleString("tr-TR"),
  },
  {
    label: "Fibonacci Dizisi Adımı",
    sublabel: "Şu anda hesaplanan eleman",
    baseValue: 34,
    incrementPerSecond: 3,
    color: "#3b82f6",
    format: (n) => `F(${Math.floor(n)})`,
  },
  {
    label: "Asal Sayı Keşfedildi",
    sublabel: "Sonsuz bir arayışta",
    baseValue: 0,
    incrementPerSecond: 42,
    color: "#f59e0b",
    format: (n) => n.toLocaleString("tr-TR"),
  },
  {
    label: "Denklem Çözüldü",
    sublabel: "Dünya genelinde bugün",
    baseValue: 84_193,
    incrementPerSecond: 15,
    color: "#10b981",
    format: (n) => n.toLocaleString("tr-TR"),
  },
];

function AnimatedCounter({ config }: { config: CounterConfig }) {
  const [value, setValue] = useState(config.baseValue);
  const startTime = useRef(Date.now());

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const elapsed = (Date.now() - startTime.current) / 1000;
      setValue(config.baseValue + Math.floor(elapsed * config.incrementPerSecond));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [config.baseValue, config.incrementPerSecond]);

  return (
    <div className="group relative glass-card rounded-2xl p-8 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
      {/* Glow circle */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
        style={{ backgroundColor: config.color }}
      />

      <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1">
        {config.sublabel}
      </p>

      <div
        className="text-3xl md:text-4xl font-heading font-black tabular-nums mb-3 transition-colors truncate"
        style={{ color: config.color, textShadow: `0 0 30px ${config.color}20` }}
      >
        {config.format(value)}
      </div>

      <p className="text-foreground/70 font-bold text-sm">{config.label}</p>

      {/* Bottom bar */}
      <div className="mt-4 h-1 rounded-full overflow-hidden bg-foreground/5">
        <div
          className="h-full rounded-full animate-pulse"
          style={{ backgroundColor: config.color, width: "100%" }}
        />
      </div>
    </div>
  );
}

export default function LiveMathPulse() {
  return (
    <section className="py-20 mb-32 relative w-full">
      <div className="text-center mb-16 space-y-6 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-chart-2/10 text-chart-2 rounded-full text-xs font-black tracking-widest uppercase">
          <Cpu size={16} variant="TwoTone" />
          Canlı Nabız
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight text-foreground">
          Matematik <span className="italic text-primary">Durmuyor.</span>
        </h2>
        <p className="text-foreground/60 text-lg md:text-xl max-w-2xl mx-auto font-medium">
          Matematik durmuyor. Sen de durma. Sayılar şu an bile çalışıyor.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
        {COUNTERS.map((c) => (
          <AnimatedCounter key={c.label} config={c} />
        ))}
      </div>

      <p className="text-center text-foreground/40 text-xs mt-10 px-4 flex items-center justify-center gap-2">
        <Clock size={14} variant="TwoTone" />
        Sayaçlar sayfayı açtığın andan itibaren çalışıyor
      </p>
    </section>
  );
}
