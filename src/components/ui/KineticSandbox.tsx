"use client";

import { useState, useEffect } from "react";
import { Activity } from "iconsax-react";

export default function KineticSandbox() {
  const [amplitude, setAmplitude] = useState(50);
  const [frequency, setFrequency] = useState(20);
  const [phase, setPhase] = useState(0);

  // Animate the wave
  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      setPhase((prev) => (prev + 0.05) % (Math.PI * 2));
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Generate SVG path for sine wave
  const generatePath = () => {
    let path = "M 0 100";
    for (let x = 0; x <= 400; x += 5) {
      // Scale x to make frequency visible
      const scaledX = x / 40;
      // Calculate y based on amplitude, frequency and phase
      const y = 100 - (amplitude / 100) * 80 * Math.sin((frequency / 10) * scaledX + phase);
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  return (
    <section className="py-24 mb-32 relative spatial-depth w-full max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10 px-4">
        
        {/* Text Content */}
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-container/80 text-primary rounded-full text-xs font-black tracking-widest uppercase">
            <Activity size={16} variant="TwoTone" />
            Kinetik Kum Havuzu
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight text-foreground">
            Formülleri Değil, <span className="italic text-primary">Sezgilerini</span> Konuştur.
          </h2>
          
          <p className="text-foreground/70 text-xl font-medium leading-relaxed">
            Matematik sadece kağıt üzerinde çözülen bir bilmece değildir; o, dokunabildiğin, bükebildiğin ve şekil verebildiğin yaşayan bir ekosistemdir.
          </p>
          
          <p className="text-foreground/70 text-lg">
            Hata yapmaktan korkma, denklemleri çekiştir. Burada sayılar sadece rakam değil, senin komutlarınla şekil alan yaşayan varlıklardır.
          </p>
        </div>

        {/* Sandbox Interactive Area */}
        <div className="flex-1 w-full max-w-xl">
          <div className="glass-card rounded-[2rem] p-8 relative overflow-hidden group">
            {/* Background Blob */}
            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-primary/20 organic-blob animate-spin-slow blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-secondary/30 organic-blob animate-spin-slow blur-2xl"></div>
            
            <div className="relative z-10 space-y-8">
              
              {/* Formula Display */}
              <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-sm flex flex-col items-center justify-center transition-all hover:bg-white/60">
                <p className="text-sm font-bold text-foreground/50 uppercase tracking-widest mb-2">Canlı Denklem</p>
                <div className="text-3xl font-heading font-black text-foreground flex items-center gap-2">
                  <span>f(x) =</span>
                  <span className="text-primary tabular-nums">{amplitude}</span>
                  <span>· sin(</span>
                  <span className="text-blue-500 tabular-nums">{(frequency/10).toFixed(1)}</span>
                  <span>x)</span>
                </div>
              </div>

              {/* Visualizer Canvas */}
              <div className="w-full h-56 bg-foreground/5 rounded-2xl border border-border relative overflow-hidden flex items-center justify-center">
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-50" style={{
                  backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: 'center center'
                }}></div>
                
                {/* Center Axis */}
                <div className="absolute w-full h-[2px] bg-foreground/20 top-1/2"></div>
                <div className="absolute h-full w-[2px] bg-foreground/20 left-1/2"></div>
                
                {/* SVG Curve */}
                <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible relative z-10 drop-shadow-[0_0_12px_rgba(0,103,98,0.4)]">
                  <path 
                    d={generatePath()} 
                    fill="none" 
                    stroke="var(--primary)" 
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-75"
                  />
                  {/* Glow effect path */}
                  <path 
                    d={generatePath()} 
                    fill="none" 
                    stroke="var(--primary)" 
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-75 opacity-20"
                  />
                </svg>
              </div>

              {/* Controls */}
              <div className="space-y-6 bg-white/40 p-6 rounded-2xl border border-white/50 backdrop-blur-sm">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold uppercase tracking-wider text-foreground/70">Genlik (a)</label>
                    <span className="font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg tabular-nums">{amplitude}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={amplitude} 
                    onChange={(e) => setAmplitude(parseInt(e.target.value))}
                    className="w-full h-2 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold uppercase tracking-wider text-foreground/70">Frekans (b)</label>
                    <span className="font-mono font-bold text-blue-600 bg-blue-500/10 px-3 py-1 rounded-lg tabular-nums">{(frequency/10).toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="50" 
                    value={frequency} 
                    onChange={(e) => setFrequency(parseInt(e.target.value))}
                    className="w-full h-2 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
