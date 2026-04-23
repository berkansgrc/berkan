import { Button } from "@/components/ui/button";
import { Activity, PlayCircle, ArrowLeft2, ArrowRight2, VideoPlay, Layer, Category, Magicpen } from "iconsax-react";
import Link from "next/link";
import Image from "next/image";
import LottieBackground from "@/components/ui/LottieBackground";
import TextReveal from "@/components/ui/TextReveal";
import MagneticButton from "@/components/ui/MagneticButton";

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
              Canlı, Kinetik Öğrenim
            </div>
            
            <TextReveal 
              text="Düşüncenin Geometrisine hükmet." 
              highlightWords={["Geometrisine"]} 
              className="text-6xl md:text-8xl lg:text-[7rem] font-heading font-extrabold tracking-tighter text-foreground leading-[0.85]"
            />
            
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed font-medium">
                Denklemlerin canlandığı kinetik bir oyun alanına adım at. Akıcı simülasyonlar ve geometrik mucizeler aracılığıyla matematiği derinlemesine tecrübe et.
            </p>
            
            <div className="flex flex-wrap justify-center gap-5 pt-4">
              <Link href="/register">
                <MagneticButton strength={30}>
                  <button className="px-10 py-5 bg-primary text-primary-foreground rounded-full font-extrabold text-lg shadow-[0_10px_30px_rgba(0,103,98,0.25)] hover:shadow-[0_15px_40px_rgba(0,103,98,0.4)] transition-all text-white">
                      Laboratuvara Gir
                  </button>
                </MagneticButton>
              </Link>
              <Link href="#philosophy">
                <MagneticButton strength={15}>
                  <button className="px-10 py-5 bg-white/60 backdrop-blur-md text-foreground rounded-full font-extrabold text-lg flex items-center gap-3 hover:bg-white/80 transition-all border border-white/40">
                    <PlayCircle size={20} variant="TwoTone" className="text-primary" />
                      Nasıl Çalışır?
                  </button>
                </MagneticButton>
              </Link>
            </div>
          </div>
        </section>

        {/* Playful Grid Highlights */}
        <section id="philosophy" className="mb-40 pt-16 spatial-depth">
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-heading font-black mb-6 leading-tight">Müfredatı <span className="italic text-primary">Sınırsız</span> Keşfet</h2>
              <p className="text-foreground/60 text-lg font-medium">Sıkıcı pdf dosyaları yerine canlı, interaktif ve seninle uyumlu bir arayüz.</p>
            </div>
            <div className="flex gap-4">
              <button className="w-14 h-14 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all hover:-translate-x-1">
                <ArrowLeft2 size={24} variant="TwoTone" />
              </button>
              <button className="w-14 h-14 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all hover:translate-x-1">
                <ArrowRight2 size={24} variant="TwoTone" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Live Sessions Card */}
            <div className="md:col-span-8 group bg-primary-container rounded-xl p-1 md:p-2 transition-transform hover:scale-[1.01] hover:rotate-y-[2deg] cursor-pointer animate-stagger-in [animation-delay:100ms] opacity-0 [animation-fill-mode:forwards]">
              <div className="bg-white/40 backdrop-blur-sm rounded-lg p-10 h-full flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 space-y-6">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white rotate-3 group-hover:rotate-12 transition-transform shadow-lg">
                    <VideoPlay size={32} variant="TwoTone" />
                  </div>
                  <h3 className="text-4xl font-heading font-black text-accent-foreground">Zengin Etkileşim</h3>
                  <p className="text-accent-foreground/70 text-lg font-medium">Çok katmanlı, zenginleştirilmiş içerikler ile konuyu okuyarak değil tecrübe ederek öğren.</p>
                  <Link href="/register" className="inline-flex items-center gap-2 font-black text-primary group-hover:gap-4 transition-all">
                      Hemen Katıl <ArrowRight2 size={20} variant="TwoTone" />
                  </Link>
                </div>
                <div className="w-72 h-72 organic-blob overflow-hidden bg-primary shadow-2xl relative">
                  <Image 
                    alt="Class interaction" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYd4E-lW21uV5M6gnTz8_6EQuJHfQNBiIMfZW5rim5rzomZs4U_D2VsS2jTS5ZtAAtRfTQjYak05LY8yT4Ctr3QgE609lt7kUDIQmtIhxGmEyLgnboh0N5Xxhv57WeLtn9AFZBkXmStv7kR0FjXHXeRmlTxthC7X7e09CFimafjpfmiCvDZMQMUdxC8RpVKZ3osQ3k8yYT4h5dNgmxkTmKBEUkaapDgheE8ydZQtZo_Kqw21bozADoZ7XECOiCDYsi9KUpk5qHrxI"
                    width={288}
                    height={288}
                  />
                  <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
                </div>
              </div>
            </div>
            
            {/* Apps Card */}
            <div className="md:col-span-4 group bg-secondary rounded-xl p-1 transition-transform hover:scale-[1.01] hover:rotate-y-[-2deg] cursor-pointer animate-stagger-in [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
              <div className="bg-white/40 backdrop-blur-sm rounded-lg p-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white -rotate-6 group-hover:rotate-0 transition-transform shadow-lg mb-8">
                    <Layer size={28} variant="TwoTone" />
                  </div>
                  <h3 className="text-3xl font-heading font-black text-secondary-foreground">Web Merkezi</h3>
                  <p className="text-secondary-foreground/70 font-medium">Dokunsal matematiksel araçlar ve akıllı algoritmalar ile sürekli takip.</p>
                </div>
                <div className="mt-12 flex justify-end">
                  <div className="w-24 h-24 bg-white/60 rounded-full flex items-center justify-center animate-spin-slow">
                    <Category size={40} variant="TwoTone" className="text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Journal Card */}
            <div className="md:col-span-5 glass-card rounded-xl p-10 flex flex-col justify-between hover:-translate-y-2 relative overflow-hidden group animate-stagger-in [animation-delay:300ms] opacity-0 [animation-fill-mode:forwards]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-chart-2/5 organic-blob -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-4">Gelişim Bülteni</h3>
                <p className="text-foreground/60 mb-8">Başarı grafiğinizi ve eksik konularınızı dilediğiniz an detaylı yönetin.</p>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-muted hover:bg-primary-container transition-colors cursor-pointer group/item">
                    <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Analiz</p>
                    <p className="font-bold group-hover/item:text-accent-foreground">Logaritma ve Üslü Sayılar %85 Tamamlandı</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted hover:bg-primary-container transition-colors cursor-pointer group/item">
                    <p className="text-xs font-black uppercase tracking-widest text-blue-500 mb-1">Geometri</p>
                    <p className="font-bold group-hover/item:text-accent-foreground">Çember ve Daire Yeni Çözümler Eklendi</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Grade Hubs Card */}
            <div className="md:col-span-7 glass-card rounded-xl p-10 flex flex-col justify-between border-2 border-primary/20 hover:-translate-y-2 animate-stagger-in [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
              <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                <div className="flex-1">
                  <h3 className="text-4xl font-heading font-black mb-6">Öğrenim Katmanları</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="px-6 py-4 rounded-2xl bg-primary-container/40 text-primary font-black hover:bg-primary hover:text-primary-foreground transition-all text-left group">
                      <span className="block text-xs uppercase mb-1 opacity-60 group-hover:opacity-100">Seviye 01</span>
                        Temel Matematik (TYT)
                    </button>
                    <button className="px-6 py-4 rounded-2xl bg-secondary/40 text-blue-700 font-black hover:bg-blue-600 hover:text-white transition-all text-left group">
                      <span className="block text-xs uppercase mb-1 opacity-60 group-hover:opacity-100">Seviye 02</span>
                        İleri Matematik (AYT)
                    </button>
                    <button className="px-6 py-4 rounded-2xl bg-chart-2/10 text-chart-2 font-black hover:bg-chart-2 hover:text-white transition-all text-left group">
                      <span className="block text-xs uppercase mb-1 opacity-60 group-hover:opacity-100">Seviye 03</span>
                        Geometri ve Analitik
                    </button>
                    <button className="px-6 py-4 rounded-2xl bg-foreground/5 text-foreground font-black hover:bg-foreground hover:text-background transition-all text-left group">
                      <span className="block text-xs uppercase mb-1 opacity-60 group-hover:opacity-100">Seviye 04</span>
                        Akademik Başarı (Uni)
                    </button>
                  </div>
                </div>
                <div className="flex items-end gap-3 h-48 py-4">
                  <div className="w-12 h-1/2 bg-primary/20 rounded-full animate-float"></div>
                  <div className="w-12 h-3/4 bg-primary rounded-full animate-float [animation-delay:1000ms]"></div>
                  <div className="w-12 h-1/3 bg-blue-300/30 rounded-full animate-float [animation-delay:2000ms]"></div>
                  <div className="w-12 h-full bg-blue-500 rounded-full animate-float [animation-delay:500ms]"></div>
                </div>
              </div>
            </div>
            
          </div>
        </section>

        {/* Dynamic CTA Section */}
        <section className="py-24 mb-40 relative">
          <div className="absolute inset-0 bg-foreground rounded-[4rem] -rotate-1 pointer-events-none"></div>
          <div className="relative z-10 bg-primary organic-blob p-12 lg:p-24 text-center text-primary-foreground rotate-1 overflow-hidden">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 organic-blob animate-spin-slow pointer-events-none"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/5 organic-blob animate-spin-slow pointer-events-none"></div>
            <div className="relative z-20 space-y-8">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-10 border border-white/30">
                <Magicpen size={48} variant="TwoTone" className="text-white" />
              </div>
              <h2 className="text-5xl md:text-7xl font-heading font-black tracking-tighter text-white">Bilgi, <br/>Sonsuz Bir Eğridir.</h2>
              <p className="text-white/80 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
                  Doğrusal yolları kır. Her kavramın mürekkep gibi birbirine aktığı yepyeni bir ekosisteme katıl.
              </p>
              <div className="pt-6">
                <Link href="/register">
                  <MagneticButton strength={40}>
                    <button className="bg-white text-primary px-12 py-5 rounded-full font-black text-xl hover:scale-110 transition-transform shadow-2xl">
                        Öğrenmeye Başla
                    </button>
                  </MagneticButton>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
      </main>

    </div>
  );
}
