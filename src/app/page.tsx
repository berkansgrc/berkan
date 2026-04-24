import { Button } from "@/components/ui/button";
import { Activity, PlayCircle } from "iconsax-react";
import Link from "next/link";
import Image from "next/image";
import LottieBackground from "@/components/ui/LottieBackground";
import TextReveal from "@/components/ui/TextReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import BerkanBoard from "@/components/ui/BerkanBoard";

import LiveMathPulse from "@/components/ui/LiveMathPulse";
import BeautifulMistakes from "@/components/ui/BeautifulMistakes";
import LearningJourney from "@/components/ui/LearningJourney";

// Ana sayfa tamamen statik — CDN'den 1 saat cache
export const revalidate = 3600;

export default function Home() {
  return (
    <div className="relative flex flex-col items-center w-full min-h-screen bg-surface text-on-surface overflow-x-hidden">
      
      {/* Hero Video Background (Only at the top) */}
      <div className="absolute top-0 left-0 w-full h-[100vh] -z-10 overflow-hidden pointer-events-none">
        <LottieBackground />
        {/* Alt kısma doğru yumuşak geçiş (fade out) */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-surface to-transparent z-10"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/30 animate-blob organic-blob blur-3xl" style={{ willChange: 'transform' }}></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-secondary/30 animate-blob [animation-delay:2000ms] organic-blob blur-3xl" style={{ willChange: 'transform' }}></div>
        <div className="absolute top-[40%] left-[20%] w-[20%] h-[20%] bg-chart-2/10 animate-blob [animation-delay:4000ms] organic-blob blur-2xl" style={{ willChange: 'transform' }}></div>
      </div>

      <main className="relative z-10 pt-32 md:pt-40 px-6 lg:px-20 w-full max-w-7xl mx-auto flex-1">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-[80vh] mb-32 relative overflow-hidden">
          <div className="w-full max-w-4xl mx-auto space-y-10 text-center relative z-10 px-4">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-container text-on-primary-container rounded-full text-xs font-black tracking-widest uppercase animate-float">
              <Activity size={16} variant="TwoTone" />
              Matematiğin Kalbi Burada Atıyor
            </div>
            
            <TextReveal 
              text="Sayıların Ötesinde, Düşüncenin Mimarisini Keşfet." 
              highlightWords={["Mimarisini"]} 
              className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tighter text-zinc-400 leading-[1.15] max-w-6xl mx-auto pb-4"
            />
            
            <p className="text-xl text-zinc-400/80 max-w-2xl mx-auto leading-loose font-medium">
                Sadece işlem yapmayı değil, sayıların arkasındaki hikayeyi keşfet. "Hata Güzeldir" diyerek çıktığımız bu yolda, her yanlışını bir başarı basamağına dönüştürüyoruz.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
                <Link href="/register">
                    <MagneticButton className="px-8 py-4 bg-zinc-600 text-white rounded-full font-bold text-lg hover:bg-zinc-500 transition-all shadow-xl">
                        Yolculuğa Katıl
                    </MagneticButton>
                </Link>
                <Link href="#journey">
                    <MagneticButton className="px-8 py-4 bg-white/50 backdrop-blur-md border border-white/20 text-zinc-500 rounded-full font-bold text-lg hover:bg-white/80 transition-all">
                        Nasıl Çalışır?
                    </MagneticButton>
                </Link>
            </div>
          </div>
        </section>

        {/* 1. Berkan'ın Tahtası */}
        <BerkanBoard />


        {/* 3. Canlı Sayaç */}
        <LiveMathPulse />

        {/* 4. Hata Güzeldir */}
        <BeautifulMistakes />

        {/* 5. Nasıl Çalışır / Öğrenme Yolculuğu */}
        <LearningJourney />


        
      </main>

    </div>
  );
}
