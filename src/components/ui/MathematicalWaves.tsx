"use client";

import { useEffect, useRef, useState } from "react";

const WAVES = [
  { fn: (x: number, t: number) => Math.sin(x * 0.010 + t * 0.7),  color: "rgba(0,167,157",   amp: 55, lw: 3, op: 0.8  },
  { fn: (x: number, t: number) => Math.cos(x * 0.016 + t * 1.0),  color: "rgba(99,102,241",  amp: 40, lw: 2, op: 0.7  },
  { fn: (x: number, t: number) => Math.sin(x * 0.007 + t * 0.5) * Math.cos(x * 0.005), color: "rgba(251,191,36", amp: 32, lw: 2, op: 0.65 },
];

export default function MathematicalWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const timeRef   = useRef(0);

  useEffect(() => {
    let canvas = canvasRef.current;
    if (!canvas) return;
    let ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Boyut ayarla
    const resize = () => {
      if (!canvas || !ctx) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let prev = performance.now();
    const tick = (now: number) => {
      if (!canvas || !ctx) return;
      const dt = Math.min((now - prev) / 1000, 0.1);
      prev = now;
      timeRef.current += dt;
      const t  = timeRef.current;
      const w  = canvas.width;
      const h  = canvas.height;

      ctx.clearRect(0, 0, w, h);

      const baseline = h * 0.72;
      const clipTop  = h * 0.55;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, clipTop, w, h - clipTop);
      ctx.clip();

      for (const wave of WAVES) {
        // glow
        ctx.save();
        ctx.globalAlpha = wave.op * 0.4;
        ctx.lineWidth   = wave.lw + 8;
        ctx.strokeStyle = `${wave.color}, 1)`;
        ctx.shadowColor = `${wave.color}, 1)`;
        ctx.shadowBlur  = 20;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const y = baseline + wave.fn(x, t) * wave.amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        // main
        ctx.save();
        ctx.globalAlpha = wave.op;
        ctx.lineWidth   = wave.lw;
        ctx.strokeStyle = `${wave.color}, 1)`;
        ctx.shadowColor = `${wave.color}, 1)`;
        ctx.shadowBlur  = 10;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const y = baseline + wave.fn(x, t) * wave.amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas = null;
      ctx    = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top:    0,
        left:   0,
        zIndex: 9,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
