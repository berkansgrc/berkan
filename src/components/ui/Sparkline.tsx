import React from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
}

export default function Sparkline({
  data,
  width = 100,
  height = 30,
  stroke = "currentColor",
  strokeWidth = 2,
}: SparklineProps) {
  if (!data || data.length === 0) return null;
  if (data.length === 1) {
    return (
      <svg width={width} height={height} className="overflow-visible">
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        <circle cx={width / 2} cy={height / 2} r={strokeWidth * 1.5} fill={stroke} />
      </svg>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min; // avoid division by zero

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`sparkline-gradient-${data.join('')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.2" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        points={`0,${height} ${points.join(" ")} ${width},${height}`}
        fill={`url(#sparkline-gradient-${data.join('')})`}
      />
      {/* Son noktaya vurgu */}
      <circle
        cx={points[points.length - 1].split(',')[0]}
        cy={points[points.length - 1].split(',')[1]}
        r={strokeWidth * 1.5}
        fill={stroke}
        className="animate-pulse"
      />
    </svg>
  );
}
