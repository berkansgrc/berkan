"use client";

import { useEffect, useRef } from "react";

type Segment = {
  value: number;
  color: string;
  label: string;
};

type Props = {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerSubLabel?: string;
};

export default function DonutChart({
  segments,
  size = 160,
  strokeWidth = 20,
  centerLabel,
  centerSubLabel,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Animate strokes in
    if (!svgRef.current) return;
    const circles = svgRef.current.querySelectorAll<SVGCircleElement>(".donut-segment");
    circles.forEach((circle) => {
      const target = circle.getAttribute("data-target") ?? "0";
      circle.style.strokeDasharray = `0 ${circumference}`;
      setTimeout(() => {
        circle.style.transition = "stroke-dasharray 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
        circle.style.strokeDasharray = `${target} ${circumference}`;
      }, 50);
    });
  }, [circumference]);

  let cumulativeOffset = 0;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border/30"
        />
        {segments.map((seg, i) => {
          const segLength = total > 0 ? (seg.value / total) * circumference : 0;
          const offset = circumference - cumulativeOffset;
          cumulativeOffset += segLength;
          return (
            <circle
              key={i}
              className="donut-segment"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`0 ${circumference}`}
              strokeDashoffset={offset}
              data-target={segLength}
            />
          );
        })}
      </svg>
      {/* Center text */}
      {centerLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-heading font-black text-foreground leading-none">{centerLabel}</span>
          {centerSubLabel && (
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{centerSubLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
