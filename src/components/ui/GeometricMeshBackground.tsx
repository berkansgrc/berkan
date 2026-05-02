"use client";

// Opsiyon A — Geometrik Mesh Arka Plan
// Yapısal grid, radial gradient mesh, belirgin semboller, geometric accent shapes

const MATH_SYMBOLS = [
  { symbol: "∫",  x: "6%",  y: "18%", size: "3.5rem", delay: "0s",  dur: "16s", rot: "-15deg", op: 0.12 },
  { symbol: "∑",  x: "88%", y: "10%", size: "3rem",   delay: "3s",  dur: "20s", rot: "10deg",  op: 0.11 },
  { symbol: "π",  x: "16%", y: "70%", size: "2.8rem", delay: "6s",  dur: "13s", rot: "0deg",   op: 0.10 },
  { symbol: "∞",  x: "78%", y: "58%", size: "3.2rem", delay: "1.5s",dur: "18s", rot: "5deg",   op: 0.10 },
  { symbol: "√",  x: "52%", y: "14%", size: "2.6rem", delay: "8s",  dur: "22s", rot: "-8deg",  op: 0.08 },
  { symbol: "Δ",  x: "92%", y: "42%", size: "2.4rem", delay: "4s",  dur: "15s", rot: "20deg",  op: 0.09 },
  { symbol: "θ",  x: "4%",  y: "52%", size: "2.5rem", delay: "9s",  dur: "17s", rot: "-5deg",  op: 0.09 },
  { symbol: "λ",  x: "65%", y: "82%", size: "2.8rem", delay: "5s",  dur: "14s", rot: "12deg",  op: 0.10 },
  { symbol: "≈",  x: "38%", y: "44%", size: "2rem",   delay: "11s", dur: "19s", rot: "0deg",   op: 0.07 },
  { symbol: "∂",  x: "22%", y: "88%", size: "2.6rem", delay: "7s",  dur: "12s", rot: "-12deg", op: 0.09 },
  { symbol: "φ",  x: "72%", y: "26%", size: "2.4rem", delay: "2s",  dur: "21s", rot: "8deg",   op: 0.08 },
  { symbol: "Ω",  x: "44%", y: "78%", size: "2.2rem", delay: "13s", dur: "16s", rot: "-3deg",  op: 0.07 },
];

// Arka planda yüzen geometrik şekiller
const GEO_SHAPES = [
  { type: "hex",     x: "3%",  y: "5%",  size: 80,  op: 0.035, delay: "0s",   dur: "25s" },
  { type: "tri",     x: "88%", y: "3%",  size: 60,  op: 0.030, delay: "4s",   dur: "30s" },
  { type: "hex",     x: "94%", y: "70%", size: 100, op: 0.025, delay: "8s",   dur: "28s" },
  { type: "circle",  x: "5%",  y: "80%", size: 70,  op: 0.030, delay: "12s",  dur: "22s" },
  { type: "tri",     x: "48%", y: "92%", size: 55,  op: 0.025, delay: "6s",   dur: "35s" },
  { type: "hex",     x: "32%", y: "2%",  size: 65,  op: 0.020, delay: "16s",  dur: "27s" },
  { type: "circle",  x: "80%", y: "90%", size: 50,  op: 0.025, delay: "2s",   dur: "20s" },
];

function GeoShape({ type, x, y, size, op, delay, dur }: typeof GEO_SHAPES[0]) {
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    width: size,
    height: size,
    opacity: op,
    animationDelay: delay,
    animationDuration: dur,
    pointerEvents: "none",
  };

  if (type === "hex") {
    return (
      <div style={baseStyle} className="geo-shape-hex">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <polygon
            points="50,2 93,25 93,75 50,98 7,75 7,25"
            stroke="rgba(0,103,98,0.8)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
    );
  }

  if (type === "tri") {
    return (
      <div style={baseStyle}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <polygon
            points="50,5 95,90 5,90"
            stroke="rgba(99,102,241,0.7)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
    );
  }

  // circle
  return (
    <div style={baseStyle}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <circle cx="50" cy="50" r="45" stroke="rgba(251,191,36,0.6)" strokeWidth="2" fill="none" strokeDasharray="8 6" />
      </svg>
    </div>
  );
}

export default function GeometricMeshBackground() {
  return (
    <div className="geo-mesh-bg" aria-hidden="true">

      {/* Mesh Gradient Katmanları */}
      <div className="geo-mesh-layer-center" />
      <div className="geo-mesh-layer-top-right" />
      <div className="geo-mesh-layer-bottom-left" />

      {/* Grid Overlay */}
      <div className="geo-grid-overlay" />

      {/* Noise Texture */}
      <div className="geo-noise" />

      {/* Geometrik Şekiller */}
      {GEO_SHAPES.map((shape, i) => (
        <GeoShape key={i} {...shape} />
      ))}

      {/* Floating Math Symbols */}
      {MATH_SYMBOLS.map(({ symbol, x, y, size, delay, dur, rot, op }) => (
        <span
          key={`${symbol}-${x}`}
          className="geo-math-symbol"
          style={{
            left: x,
            top: y,
            fontSize: size,
            animationDelay: delay,
            animationDuration: dur,
            opacity: op,
            transform: `rotate(${rot})`,
          }}
        >
          {symbol}
        </span>
      ))}
    </div>
  );
}
