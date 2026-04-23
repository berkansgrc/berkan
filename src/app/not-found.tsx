"use client";

import Link from "next/link";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ArrowLeft2 } from "iconsax-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex flex-col items-center justify-center bg-background px-6 py-12 relative overflow-hidden">
      {/* Dekoratif Arka Plan (Blob) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center text-center">
        {/* Lottie Animasyonu */}
        <div className="w-64 h-64 md:w-80 md:h-80 mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <DotLottieReact
            src="https://lottie.host/a24dce38-dfa4-43f1-a4ab-a02f00f401d1/dbD8IZqiZp.lottie"
            loop
            autoplay
            className="w-full h-full object-contain"
          />
        </div>

        {/* İçerik */}
        <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-foreground mb-4 drop-shadow-sm">
          Sayfa Bulunamadı
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-medium mb-10 max-w-md mx-auto">
          Evrenin bu köşesinde henüz keşfedilmiş bir formül yok. Görünen o ki kayboldun.
        </p>

        {/* Ana Sayfaya Dön Butonu */}
        <Link href="/">
          <button className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-bold text-base px-8 py-4 rounded-2xl shadow-[0_12px_24px_rgba(0,103,98,0.25)] hover:shadow-[0_16px_32px_rgba(0,103,98,0.3)] hover:-translate-y-1 transition-all duration-300 border-0 overflow-hidden">
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <ArrowLeft2 color="currentColor" size={20} className="relative z-10 group-hover:-translate-x-1 transition-transform" variant="Outline" />
            <span className="relative z-10">Ana Sayfaya Dön</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
