"use client";

import { useState, useEffect, useCallback } from "react";
import { Teacher, Edit } from "iconsax-react";

/* ── Çözüm Adımları ── */
interface MathProblem {
  title: string;
  steps: { text: string; color?: string }[];
}

const PROBLEMS: MathProblem[] = [
  {
    title: "Ortaokul — Basit Denklem",
    steps: [
      { text: "3x + 7 = 22" },
      { text: "Her iki taraftan 7 çıkaralım:" },
      { text: "3x = 22 − 7" },
      { text: "3x = 15" },
      { text: "x = 15 ÷ 3", color: "#4ade80" },
      { text: "x = 5  ✓", color: "#facc15" },
    ],
  },
  {
    title: "Ortaokul — Kesirlerle İşlem",
    steps: [
      { text: "2/3 + 1/4 = ?" },
      { text: "Ortak payda: EKOK(3,4) = 12" },
      { text: "2/3 = 8/12" },
      { text: "1/4 = 3/12" },
      { text: "8/12 + 3/12 = 11/12", color: "#4ade80" },
      { text: "Sonuç = 11/12  ✓", color: "#facc15" },
    ],
  },
  {
    title: "Lise — Türev Uygulaması",
    steps: [
      { text: "f(x) = 3x² + 2x − 7" },
      { text: "f'(x) = ?" },
      { text: "Kural: d/dx(xⁿ) = n·xⁿ⁻¹" },
      { text: "f'(x) = 6x + 2", color: "#4ade80" },
      { text: "f'(1) = 6(1) + 2 = 8", color: "#4ade80" },
      { text: "Eğim x=1'de 8'dir  ✓", color: "#facc15" },
    ],
  },
];

export default function BerkanBoard() {
  const [problemIndex, setProblemIndex] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const currentProblem = PROBLEMS[problemIndex];
  const currentStepText = currentProblem.steps[visibleSteps]?.text || "";

  // Typewriter effect for current step
  useEffect(() => {
    if (visibleSteps >= currentProblem.steps.length) {
      // All steps shown — wait, then fade and move to next problem
      const timeout = setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          setProblemIndex((prev) => (prev + 1) % PROBLEMS.length);
          setVisibleSteps(0);
          setCharIndex(0);
          setIsFading(false);
        }, 800);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    if (charIndex < currentStepText.length) {
      const timeout = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, 45);
      return () => clearTimeout(timeout);
    } else {
      // Step fully typed — move to next step
      const timeout = setTimeout(() => {
        setVisibleSteps((prev) => prev + 1);
        setCharIndex(0);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [visibleSteps, charIndex, currentProblem.steps.length, currentStepText.length, problemIndex]);

  return (
    <section className="py-20 mb-32 relative w-full">
      <div className="flex flex-col lg:flex-row items-center gap-16 px-4">
        
        {/* Sol: Metin */}
        <div className="flex-1 space-y-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/10 text-foreground rounded-full text-xs font-black tracking-widest uppercase">
            <Teacher size={16} variant="TwoTone" />
            Berkan&#39;ın Tahtası
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight text-foreground">
            Tahta Hiç <span className="italic text-primary">Susmaz.</span>
          </h2>

          <p className="text-foreground/70 text-xl font-medium leading-relaxed">
            Berkan Hoca&apos;nın tahtası her an çalışıyor. Adım adım, satır satır — 
            sanki yanında oturuyormuşsun gibi. Burada çözümler ezber değil, bir hikâyedir.
          </p>

          <div className="flex items-center gap-3 text-foreground/50 text-sm">
            <Edit size={16} variant="TwoTone" />
            <span>Otomatik olarak yeni sorular çözülüyor...</span>
          </div>
        </div>

        {/* Sağ: Karatahta */}
        <div className="flex-1 w-full max-w-2xl">
          <div
            className="relative rounded-[1.5rem] overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(145deg, #1a2e1a 0%, #0d1f0d 50%, #162816 100%)",
              border: "12px solid #3d2b1f",
              boxShadow: "inset 0 0 60px rgba(0,0,0,0.5), 0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Tahta dokusu efekti */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px
                )`,
              }}
            />

            {/* Tebeşir tozu efekti */}
            <div className="absolute top-4 right-6 flex gap-2 opacity-60">
              <div className="w-2 h-2 bg-white/30 rounded-full" />
              <div className="w-1.5 h-1.5 bg-yellow-200/20 rounded-full" />
              <div className="w-1 h-1 bg-white/20 rounded-full" />
            </div>

            <div
              className="p-8 md:p-12 min-h-[380px] flex flex-col transition-opacity duration-700"
              style={{ opacity: isFading ? 0 : 1 }}
            >
              {/* Başlık */}
              <div
                className="mb-8 pb-4"
                style={{
                  borderBottom: "2px dashed rgba(255,255,255,0.15)",
                }}
              >
                <span
                  className="text-lg font-bold tracking-wide"
                  style={{
                    color: "#e2c87a",
                    fontFamily: "var(--font-chalk), cursive, sans-serif",
                    textShadow: "0 0 8px rgba(226,200,122,0.3)",
                  }}
                >
                  ✎ {currentProblem.title}
                </span>
              </div>

              {/* Adımlar */}
              <div className="space-y-5 flex-1">
                {currentProblem.steps.map((step, idx) => {
                  if (idx > visibleSteps) return null;
                  const isCurrentlyTyping = idx === visibleSteps;
                  const displayText = isCurrentlyTyping
                    ? currentStepText.slice(0, charIndex)
                    : step.text;

                  return (
                    <div
                      key={`${problemIndex}-${idx}`}
                      className="flex items-start gap-4"
                    >
                      <span
                        className="text-xs mt-1 font-bold shrink-0 w-6 text-center rounded-full"
                        style={{
                          color: "rgba(255,255,255,0.3)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          lineHeight: "1.5rem",
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span
                        className="text-xl md:text-2xl font-medium relative"
                        style={{
                          color: step.color || "rgba(255,255,255,0.85)",
                          fontFamily: "var(--font-chalk), cursive, sans-serif",
                          textShadow: step.color
                            ? `0 0 12px ${step.color}40`
                            : "0 0 6px rgba(255,255,255,0.1)",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {displayText}
                        {isCurrentlyTyping && (
                          <span className="inline-block w-[2px] h-6 bg-white/70 ml-0.5 animate-pulse" />
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Alt bilgi */}
              <div className="mt-6 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex gap-1.5">
                  {PROBLEMS.map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: i === problemIndex ? "#e2c87a" : "rgba(255,255,255,0.15)",
                        boxShadow: i === problemIndex ? "0 0 8px rgba(226,200,122,0.4)" : "none",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Caveat', cursive, sans-serif" }}
                >
                  berkan matematik
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
