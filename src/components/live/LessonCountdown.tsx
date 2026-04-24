"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { Timer1 } from "iconsax-react";

interface LessonCountdownProps {
  scheduledAt: string;
  lessonTitle?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calcTimeLeft(target: Date): TimeLeft {
  const now = Date.now();
  const total = target.getTime() - now;

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total,
  };
}

function TimeUnit({ value, label, urgent }: { value: number; label: string; urgent: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-heading font-black text-2xl sm:text-3xl border transition-colors ${
          urgent
            ? "bg-red-500/10 border-red-500/30 text-red-500"
            : "bg-card/80 border-border/50 text-foreground"
        }`}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span
        className={`text-[10px] font-black uppercase tracking-widest mt-2 ${
          urgent ? "text-red-500/70" : "text-muted-foreground/60"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default function LessonCountdown({ scheduledAt, lessonTitle }: LessonCountdownProps) {
  const target = new Date(scheduledAt);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(target));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft(target));
    }, 1000);

    return () => clearInterval(interval);
  }, [scheduledAt]);

  if (timeLeft.total <= 0) {
    return null;
  }

  const totalMinutes = timeLeft.total / (1000 * 60);
  const isUrgent = totalMinutes <= 15;
  const isClose = totalMinutes <= 60;

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-5"
    >
      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
          isUrgent
            ? "bg-red-500/10 border-red-500/30 animate-pulse"
            : "bg-primary/10 border-primary/20"
        }`}
      >
        <Timer1
          className={`w-7 h-7 ${isUrgent ? "text-red-500" : "text-primary"}`}
          variant="Bulk"
        />
      </div>

      {/* Message */}
      <div className="text-center">
        <p
          className={`text-sm font-heading font-black uppercase tracking-wider ${
            isUrgent ? "text-red-500" : "text-primary"
          }`}
        >
          {isUrgent
            ? "Ders başlamak üzere!"
            : isClose
            ? "Ders çok yakında"
            : "Sonraki ders"}
        </p>
        {lessonTitle && (
          <p className="text-foreground font-heading font-bold text-lg mt-1">
            {lessonTitle}
          </p>
        )}
      </div>

      {/* Timer */}
      <div className="flex items-center gap-3">
        {timeLeft.days > 0 && (
          <>
            <TimeUnit value={timeLeft.days} label="Gün" urgent={isUrgent} />
            <span className="text-2xl font-bold text-muted-foreground/30 mt-[-1rem]">:</span>
          </>
        )}
        <TimeUnit value={timeLeft.hours} label="Saat" urgent={isUrgent} />
        <span className="text-2xl font-bold text-muted-foreground/30 mt-[-1rem]">:</span>
        <TimeUnit value={timeLeft.minutes} label="Dakika" urgent={isUrgent} />
        <span className="text-2xl font-bold text-muted-foreground/30 mt-[-1rem]">:</span>
        <TimeUnit value={timeLeft.seconds} label="Saniye" urgent={isUrgent} />
      </div>

      {/* Date text */}
      <p className="text-xs font-bold text-muted-foreground">
        {target.toLocaleDateString("tr-TR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </m.div>
  );
}
