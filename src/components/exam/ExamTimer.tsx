"use client";

import { useState, useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

type Props = {
  durationMinutes: number;
  storageKey: string;
  onTimeUp: () => void;
};

export default function ExamTimer({ durationMinutes, storageKey, onTimeUp }: Props) {
  const totalSeconds = durationMinutes * 60;

  const [seconds, setSeconds] = useState(() => {
    if (typeof window !== "undefined") {
      const startedAt = localStorage.getItem(storageKey + "_startedAt");
      if (startedAt) {
        const elapsed = Math.floor((Date.now() - Number(startedAt)) / 1000);
        const remaining = totalSeconds - elapsed;
        return Math.max(0, remaining);
      }
    }
    return totalSeconds;
  });

  const onTimeUpRef = useRef(onTimeUp);
  useEffect(() => { onTimeUpRef.current = onTimeUp; }, [onTimeUp]);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeUpRef.current();
      return;
    }
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          onTimeUpRef.current();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isWarning = seconds <= 300; // Son 5 dakika
  const isCritical = seconds <= 60; // Son 1 dakika

  const size = 52;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.max(0, Math.min(1, seconds / totalSeconds));
  const strokeDashoffset = circumference - progress * circumference;

  const colorClass = isCritical
    ? "text-red-500"
    : isWarning
    ? "text-amber-500"
    : "text-primary";

  return (
    <div className={`flex items-center gap-3 bg-card/60 backdrop-blur-xl border border-border/50 p-1.5 pr-5 rounded-full shadow-sm transition-all ${isCritical ? "ring-2 ring-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse" : isWarning ? "ring-1 ring-amber-500/30" : ""}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg className="absolute inset-0 -rotate-90 transform" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-1000 ease-linear`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {isWarning && !isCritical ? (
            <AlertTriangle className={`w-4 h-4 ${colorClass}`} />
          ) : isCritical ? (
            <AlertTriangle className={`w-4 h-4 ${colorClass} animate-bounce`} />
          ) : null}
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className={`font-mono text-base font-black leading-none tracking-tight ${colorClass}`}>
          {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
        {isCritical ? (
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-0.5 animate-pulse">
            Son 60 Sn!
          </span>
        ) : (
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
            Kalan Süre
          </span>
        )}
      </div>
    </div>
  );
}
