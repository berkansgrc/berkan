"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ── Yörünge Konfigürasyonu ── */
interface OrbitConfig {
  radiusX: number;    // px, base genişlik (1400px viewport için)
  radiusY: number;    // px, base yükseklik
  speed: number;      // derece/saniye
  reverse?: boolean;
  opacity: number;    // yörünge çizgi opaklığı
}

interface EquationPill {
  text: string;
  orbit: number;
  startAngle: number;
  accent: string;
}

const ORBITS: OrbitConfig[] = [
  { radiusX: 150, radiusY: 105, speed: 10,  reverse: false, opacity: 0.07 },
  { radiusX: 260, radiusY: 175, speed: 6.5, reverse: true,  opacity: 0.055 },
  { radiusX: 370, radiusY: 240, speed: 4,   reverse: false, opacity: 0.045 },
  { radiusX: 490, radiusY: 300, speed: 2.5, reverse: true,  opacity: 0.035 },
];

const EQUATIONS: EquationPill[] = [
  { text: "E = mc²",       orbit: 0, startAngle: 20,   accent: "#00a79d" },
  { text: "π ≈ 3.14",      orbit: 0, startAngle: 200,  accent: "#6366f1" },

  { text: "∫ f(x) dx",     orbit: 1, startAngle: 60,   accent: "#8b5cf6" },
  { text: "a² + b² = c²",  orbit: 1, startAngle: 210,  accent: "#00a79d" },
  { text: "Σ n²",          orbit: 1, startAngle: 330,  accent: "#f59e0b" },

  { text: "lim x→∞",       orbit: 2, startAngle: 110,  accent: "#6366f1" },
  { text: "dy / dx",       orbit: 2, startAngle: 275,  accent: "#00a79d" },

  { text: "sin x",         orbit: 3, startAngle: 40,   accent: "#8b5cf6" },
  { text: "∇ × F",         orbit: 3, startAngle: 160,  accent: "#f59e0b" },
  { text: "eⁱᵖ + 1 = 0",  orbit: 3, startAngle: 280,  accent: "#00a79d" },
];

export default function OrbitingEquations() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const anglesRef = useRef<number[]>(EQUATIONS.map(eq => eq.startAngle));
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);

  // Yörünge çizgilerini Canvas ile çiz — daha iyi kontrol
  const drawOrbits = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const w = container.offsetWidth;
    const h = container.offsetHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h * 0.42; // Başlık hizasında, biraz yukarıda

    ORBITS.forEach((orbit) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, orbit.radiusX, orbit.radiusY * 0.62, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 103, 98, ${orbit.opacity * 1.6})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }, []);

  useEffect(() => {
    setMounted(true);

    // Yörünge çizgileri
    const handleResize = () => drawOrbits();
    window.addEventListener("resize", handleResize);

    // İlk çizim biraz gecikmeyle (layout sonrası)
    const timer = setTimeout(drawOrbits, 50);

    // Animasyon döngüsü
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const container = containerRef.current;
      if (!container) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const cw = container.offsetWidth;
      const ch = container.offsetHeight;
      const cx = cw / 2;
      const cy = ch * 0.42;

      EQUATIONS.forEach((eq, i) => {
        const orbit = ORBITS[eq.orbit];
        const dir = orbit.reverse ? -1 : 1;
        anglesRef.current[i] = (anglesRef.current[i] + orbit.speed * dir * dt) % 360;

        const rad = (anglesRef.current[i] * Math.PI) / 180;
        const px = cx + Math.cos(rad) * orbit.radiusX;
        const py = cy + Math.sin(rad) * orbit.radiusY * 0.62;

        // Derinlik efekti
        const zFactor = Math.sin(rad);
        const scale = 0.55 + 0.45 * ((zFactor + 1) / 2);
        const opacity = 0.15 + 0.85 * ((zFactor + 1) / 2);

        const pill = pillRefs.current[i];
        if (pill) {
          pill.style.left = `${px}px`;
          pill.style.top = `${py}px`;
          pill.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
          pill.style.opacity = opacity.toFixed(3);
          pill.style.zIndex = zFactor > 0 ? "2" : "1";
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [drawOrbits]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 1 }}
    >
      {/* Merkez Glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          top: "42%",
          width: "6px",
          height: "6px",
          background: "rgba(0,167,157,0.7)",
          boxShadow:
            "0 0 30px 12px rgba(0,167,157,0.12), 0 0 80px 40px rgba(0,167,157,0.06), 0 0 140px 70px rgba(0,167,157,0.03)",
        }}
      />

      {/* Yörünge Çizgileri (Canvas — responsive) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ pointerEvents: "none" }}
      />

      {/* Equation Pills — z-index 1-3 arası, metin z-10'da */}
      {EQUATIONS.map((eq, i) => (
        <div
          key={i}
          ref={(el) => { pillRefs.current[i] = el; }}
          className="absolute"
          style={{
            opacity: 0,
            willChange: "left, top, transform, opacity",
          }}
        >
          <div
            className="whitespace-nowrap px-3.5 py-1.5 rounded-full backdrop-blur-md border select-none"
            style={{
              background: "rgba(255,255,255,0.50)",
              borderColor: `${eq.accent}33`,
              color: "rgba(15,23,42,0.6)",
              boxShadow: `0 2px 16px ${eq.accent}18, inset 0 0 0 1px rgba(255,255,255,0.35)`,
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "0.78rem",
              fontWeight: 600,
              letterSpacing: "0.3px",
            }}
          >
            {eq.text}
          </div>
        </div>
      ))}
    </div>
  );
}
