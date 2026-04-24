"use client";

import { useState, useEffect } from "react";
import { CloseCircle, TickCircle, Refresh } from "iconsax-react";

interface Mistake {
  title: string;
  wrongSteps: { text: string; isError?: boolean }[];
  errorExplanation: string;
  correctSteps: { text: string }[];
}

const MISTAKES: Mistake[] = [
  {
    title: "Ortaokul — Negatif Sayılarda Hata",
    wrongSteps: [
      { text: "(−3) × (−5) = ?" },
      { text: "= −15", isError: true },
    ],
    errorExplanation: "Eksi çarpı eksi artı eder! İki negatifin çarpımı pozitiftir.",
    correctSteps: [
      { text: "(−) × (−) = (+)" },
      { text: "3 × 5 = 15" },
      { text: "(−3) × (−5) = +15  ✓" },
    ],
  },
  {
    title: "Ortaokul — Kesir Bölme Hatası",
    wrongSteps: [
      { text: "2/3 ÷ 4/5 = ?" },
      { text: "= 2/3 × 4/5 = 8/15", isError: true },
    ],
    errorExplanation: "Kesirde bölme yapılırken ikinci kesir ters çevrilir!",
    correctSteps: [
      { text: "Bölen kesri ters çevir:" },
      { text: "2/3 × 5/4 = 10/12" },
      { text: "= 5/6  ✓" },
    ],
  },
  {
    title: "Lise — Üslü Sayılarda Hata",
    wrongSteps: [
      { text: "(a + b)² = ?" },
      { text: "= a² + b²", isError: true },
    ],
    errorExplanation: "Ortadaki çarpım terimi (2ab) unutuldu!",
    correctSteps: [
      { text: "(a + b)² = (a + b)(a + b)" },
      { text: "= a² + ab + ab + b²" },
      { text: "= a² + 2ab + b²  ✓" },
    ],
  },
];

type Phase = "wrong" | "explain" | "correct";

export default function BeautifulMistakes() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("wrong");
  const [stepVisible, setStepVisible] = useState(0);

  const mistake = MISTAKES[idx];

  // Auto-advance through phases
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (phase === "wrong") {
      if (stepVisible < mistake.wrongSteps.length) {
        timer = setTimeout(() => setStepVisible((s) => s + 1), 800);
      } else {
        timer = setTimeout(() => { setPhase("explain"); setStepVisible(0); }, 1500);
      }
    } else if (phase === "explain") {
      timer = setTimeout(() => { setPhase("correct"); setStepVisible(0); }, 2500);
    } else if (phase === "correct") {
      if (stepVisible < mistake.correctSteps.length) {
        timer = setTimeout(() => setStepVisible((s) => s + 1), 700);
      } else {
        timer = setTimeout(() => {
          setIdx((prev) => (prev + 1) % MISTAKES.length);
          setPhase("wrong");
          setStepVisible(0);
        }, 3500);
      }
    }

    return () => clearTimeout(timer);
  }, [phase, stepVisible, mistake, idx]);

  const restart = () => {
    setIdx((prev) => (prev + 1) % MISTAKES.length);
    setPhase("wrong");
    setStepVisible(0);
  };

  return (
    <section className="py-20 mb-32 relative w-full">
      <div className="flex flex-col lg:flex-row items-center gap-16 px-4">

        {/* Sağ: Hata → Düzeltme Animasyonu */}
        <div className="flex-1 w-full max-w-xl order-1 lg:order-2">
          <div className="glass-card rounded-[2rem] p-8 md:p-10 relative overflow-hidden min-h-[400px]">
            <div className="absolute bottom-[-15%] left-[-10%] w-56 h-56 bg-destructive/5 organic-blob animate-spin-slow blur-3xl pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-primary/5 organic-blob animate-spin-slow blur-2xl pointer-events-none" />

            <div className="relative z-10">
              {/* Başlık */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-bold text-foreground/50">{mistake.title}</span>
                <button onClick={restart} className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors">
                  <Refresh size={16} variant="TwoTone" className="text-foreground/40" />
                </button>
              </div>

              {/* Yanlış Çözüm */}
              <div className={`space-y-4 transition-all duration-700 ${phase !== "wrong" ? "opacity-40 scale-[0.97]" : ""}`}>
                {mistake.wrongSteps.map((step, i) => {
                  if (i >= stepVisible && phase === "wrong") return null;
                  return (
                    <div key={`wrong-${i}`} className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-500 ${step.isError ? "bg-destructive/8 border-2 border-destructive/30" : "bg-foreground/5 border border-transparent"}`}>
                      {step.isError && <CloseCircle size={20} variant="Bold" className="text-destructive shrink-0" />}
                      <span className={`text-lg font-bold ${step.isError ? "text-destructive line-through decoration-2" : "text-foreground"}`} style={{ fontFamily: "var(--font-chalk), cursive, sans-serif", fontSize: "1.4rem" }}>
                        {step.text}
                      </span>
                      {step.isError && phase !== "wrong" && (
                        <span className="ml-auto text-xs font-black text-destructive uppercase tracking-wider animate-pulse">YANLIŞ</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Hata Açıklaması */}
              {phase === "explain" && (
                <div className="mt-6 p-5 rounded-xl bg-chart-2/10 border border-chart-2/30 animate-stagger-in">
                  <p className="text-chart-2 font-black text-sm uppercase tracking-wider mb-1">💡 Nerede hata var?</p>
                  <p className="text-foreground/80 font-bold">{mistake.errorExplanation}</p>
                </div>
              )}

              {/* Doğru Çözüm */}
              {(phase === "correct") && (
                <div className="mt-6 space-y-3 animate-stagger-in">
                  <p className="text-xs font-black text-primary uppercase tracking-widest mb-4">✎ Doğru Çözüm</p>
                  {mistake.correctSteps.map((step, i) => {
                    if (i >= stepVisible) return null;
                    return (
                      <div key={`correct-${i}`} className="flex items-center gap-3 p-4 rounded-xl bg-primary/8 border border-primary/20 animate-stagger-in" style={{ animationDelay: `${i * 100}ms` }}>
                        <TickCircle size={20} variant="Bold" className="text-primary shrink-0" />
                        <span className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-chalk), cursive, sans-serif", fontSize: "1.4rem" }}>
                          {step.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Progress */}
              <div className="mt-8 flex gap-1.5">
                {MISTAKES.map((_, i) => (
                  <div key={i} className="h-1 flex-1 rounded-full transition-all duration-500" style={{ backgroundColor: i === idx ? "var(--primary)" : "var(--foreground)", opacity: i === idx ? 1 : 0.1 }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sol: Metin */}
        <div className="flex-1 space-y-8 max-w-xl order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-full text-xs font-black tracking-widest uppercase">
            <CloseCircle size={16} variant="TwoTone" />
            Hata Güzeldir
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight text-foreground">
            Hata Yapmak, <span className="italic text-primary">Öğrenmenin</span> Ta Kendisi.
          </h2>

          <p className="text-foreground/70 text-xl font-medium leading-relaxed">
            Biz hataları cezalandırmıyoruz — onları altın fırsatlara çeviriyoruz.
            Her yanlışın içinde, doğruya giden kestirme bir yol gizlidir.
          </p>

          <p className="text-foreground/50 text-lg">
            En güzel hatalar, en derin öğrenmelerin kapısıdır.
            Burada hata yapmaktan korkma; biz seninle birlikte her hatayı bir başarıya dönüştürüyoruz.
          </p>
        </div>

      </div>
    </section>
  );
}
