"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertTriangle } from "lucide-react";

type Props = {
  durationMinutes: number;
  onTimeUp: () => void;
};

export default function ExamTimer({ durationMinutes, onTimeUp }: Props) {
  const [seconds, setSeconds] = useState(durationMinutes * 60);

  const handleTimeUp = useCallback(() => {
    onTimeUp();
  }, [onTimeUp]);

  useEffect(() => {
    if (seconds <= 0) {
      handleTimeUp();
      return;
    }
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [handleTimeUp]); // seconds'u bağımlılığa koymuyoruz, sadece mount'ta başlıyor

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isWarning = seconds <= 300; // Son 5 dakika uyarı

  return (
    <div
      className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-lg font-bold transition-colors ${
        isWarning
          ? "bg-red-100 text-red-700 animate-pulse"
          : "bg-primary/10 text-primary"
      }`}
    >
      {isWarning && <AlertTriangle className="h-4 w-4" />}
      {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </div>
  );
}
