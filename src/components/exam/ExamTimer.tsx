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

  return (
    <div
      className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-lg font-bold transition-colors ${
        isCritical
          ? "bg-red-100 text-red-700 animate-pulse dark:bg-red-950 dark:text-red-400"
          : isWarning
          ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
          : "bg-primary/10 text-primary"
      }`}
    >
      {isWarning && <AlertTriangle className="h-4 w-4 shrink-0" />}
      {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </div>
  );
}
