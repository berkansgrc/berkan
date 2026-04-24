"use client";

import { Category, Teacher, TickCircle, PathTool, DirectRight } from "iconsax-react";
import Link from "next/link";

const STEPS = [
  {
    title: "Görsel Keşif",
    description: "Matematiği soyut bir zorunluluk değil, canlı bir evren olarak gör. İnteraktif araçlarla kavramların derinine in.",
    icon: Category,
    color: "#3b82f6",
    delay: "100ms",
    bg: "bg-blue-500/5",
    border: "border-blue-500/20"
  },
  {
    title: "Uygulamalı Anlatım",
    description: "Berkan Hoca'nın tahtasında her adımın bir nedeni var. Çözümleri sadece izleme, mantığını satır satır yaşa.",
    icon: Teacher,
    color: "#10b981",
    delay: "200ms",
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/20"
  },
  {
    title: "Hata Odaklı Gelişim",
    description: "Yanlış yapmaktan korkma. Akıllı analizlerle hatalarını fırsata çevir ve eksiklerini kalıcı olarak tamamla.",
    icon: TickCircle,
    color: "#f59e0b",
    delay: "300ms",
    bg: "bg-amber-500/5",
    border: "border-amber-500/20"
  }
];

export default function LearningJourney() {
  return (
    <section id="journey" className="py-24 mb-40 relative">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Başlık Grubu */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black tracking-widest uppercase mb-4">
            <PathTool size={16} variant="TwoTone" />
            Öğrenme Yolculuğu
          </div>
          <h2 className="text-5xl md:text-6xl font-heading font-black leading-tight text-foreground">
            Berkan Matematik <span className="italic text-primary">Nasıl Çalışır?</span>
          </h2>
          <p className="text-foreground/60 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Klasik ders anlatımının ötesine geçiyoruz. Senin için tasarlanmış, akıllı ve interaktif bir süreç.
          </p>
        </div>

        {/* Adımlar */}
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {STEPS.map((step, idx) => (
              <div 
                key={idx}
                className="group relative"
                style={{ animationDelay: step.delay }}
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-border shadow-sm flex items-center justify-center text-sm font-black text-foreground/40 group-hover:text-primary transition-colors z-20">
                  0{idx + 1}
                </div>

                <div className={`h-full glass-card rounded-[2.5rem] p-10 transition-all duration-500 hover:-translate-y-3 border-2 ${step.border} ${step.bg} overflow-hidden`}>
                  {/* Decorative Gradient */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700" style={{ backgroundColor: step.color }} />

                  <div className="space-y-6">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12 duration-500"
                      style={{ backgroundColor: step.color, color: 'white' }}
                    >
                      <step.icon size={32} variant="TwoTone" />
                    </div>

                    <h3 className="text-2xl font-heading font-black text-foreground">{step.title}</h3>
                    <p className="text-foreground/60 font-medium leading-relaxed">
                      {step.description}
                    </p>

                    <div className="pt-4 flex items-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" style={{ color: step.color }}>
                      Keşfetmeye Başla <DirectRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <div className="p-8 rounded-3xl bg-foreground/5 border border-foreground/5 inline-flex flex-col md:flex-row items-center gap-8">
            <p className="text-foreground/70 font-bold italic">
              "Bu yolculukta hiçbir zaman tek başına olmayacaksın."
            </p>
            <div className="h-8 w-px bg-border hidden md:block" />
            <Link href="/register">
              <button className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all">
                Hemen Başla
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
