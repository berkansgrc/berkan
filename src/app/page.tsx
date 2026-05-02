import { Button } from "@/components/ui/button";
import { Activity, PlayCircle } from "iconsax-react";
import Link from "next/link";
import Image from "next/image";

import GeometricMeshBackground from "@/components/ui/GeometricMeshBackground";
import OrbitingEquations from "@/components/ui/OrbitingEquations";
import MathematicalWaves from "@/components/ui/MathematicalWaves";
import HeroHeading from "@/components/ui/HeroHeading";
import MagneticButton from "@/components/ui/MagneticButton";
import BerkanBoard from "@/components/ui/BerkanBoard";
import ScrollReveal from "@/components/ui/ScrollReveal";

import LiveMathPulse from "@/components/ui/LiveMathPulse";
import BeautifulMistakes from "@/components/ui/BeautifulMistakes";
import LearningJourney from "@/components/ui/LearningJourney";

// Ana sayfa tamamen statik — CDN'den 1 saat cache
export const revalidate = 3600;

export default function Home() {
  return (
    <div className="relative flex flex-col items-center w-full min-h-screen text-on-surface overflow-x-hidden">
      
      {/* Geometrik Mesh Arka Plan (Opsiyon A) */}
      <GeometricMeshBackground />

      {/* Hero bölümü alt geçiş — sadece hero alanının altında fade-out */}
      <div className="fixed bottom-0 left-0 w-full h-32 pointer-events-none z-[-9]"
        style={{ background: "linear-gradient(to top, var(--background) 20%, transparent)" }}
      />

      {/* Mathematical Waves — sabit canvas, z:9 ile main(z:10) altında */}
      <MathematicalWaves />

      <main className="relative z-10 pt-32 md:pt-40 px-6 lg:px-20 w-full max-w-7xl mx-auto flex-1">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-screen mb-32 relative">
          {/* Orbiting Equations — yörüngeli denklemler */}
          <OrbitingEquations />
          <div className="w-full max-w-4xl mx-auto space-y-8 text-center relative z-10 px-4">
            {/* Badge */}
            <ScrollReveal delay={0.1} direction="up">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-container text-on-primary-container rounded-full text-xs font-black tracking-widest uppercase animate-float">
                <Activity size={16} variant="TwoTone" />
                Hata Güzeldir · Yolculuk Başlasın
              </div>
            </ScrollReveal>
            
            <HeroHeading />
            
            <ScrollReveal delay={0.5} direction="up">
              <p className="text-lg md:text-xl text-foreground/55 max-w-xl mx-auto leading-relaxed font-semibold tracking-tight">
                  Her yanlış bir kapı açar. Burada ezber yok, anlayarak öğrenme var — ve bu yolculukta yanılmak en büyük cesaret.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.65} direction="up">
              <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
                  <Link href="/register">
                      <MagneticButton className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-primary/25">
                          Yolculuğa Katıl
                      </MagneticButton>
                  </Link>
                  <Link href="#journey">
                      <MagneticButton className="px-8 py-4 bg-white/50 backdrop-blur-md border border-white/20 text-zinc-500 rounded-full font-bold text-lg hover:bg-white/80 transition-all">
                          Nasıl Çalışır?
                      </MagneticButton>
                  </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 1. Berkan'ın Tahtası */}
        <ScrollReveal direction="up" delay={0.1}>
          <BerkanBoard />
        </ScrollReveal>

        {/* 3. Canlı Sayaç */}
        <ScrollReveal direction="up" delay={0.1}>
          <LiveMathPulse />
        </ScrollReveal>

        {/* 4. Hata Güzeldir */}
        <ScrollReveal direction="up" delay={0.1}>
          <BeautifulMistakes />
        </ScrollReveal>

        {/* 5. Nasıl Çalışır / Öğrenme Yolculuğu */}
        <ScrollReveal direction="up" delay={0.1}>
          <LearningJourney />
        </ScrollReveal>

        
      </main>

    </div>
  );
}

