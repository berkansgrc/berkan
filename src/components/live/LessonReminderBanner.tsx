"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Timer1, CloseCircle, ArrowRight2 } from "iconsax-react";

interface LessonReminderBannerProps {
  scheduledAt: string | null;
  lessonTitle?: string | null;
}

export default function LessonReminderBanner({
  scheduledAt,
  lessonTitle,
}: LessonReminderBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!scheduledAt) return;

    const update = () => {
      const diff = new Date(scheduledAt).getTime() - Date.now();
      const mins = diff / (1000 * 60);
      setMinutesLeft(mins > 0 ? mins : null);
    };

    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, [scheduledAt]);

  // 60 dakikadan az kaldıysa ve ders henüz başlamadıysa göster
  const shouldShow = minutesLeft !== null && minutesLeft > 0 && minutesLeft <= 60 && !dismissed;

  const isUrgent = minutesLeft !== null && minutesLeft <= 15;

  const formatTime = () => {
    if (minutesLeft === null) return "";
    if (minutesLeft < 1) return "Birkaç saniye içinde";
    if (minutesLeft < 60) return `${Math.ceil(minutesLeft)} dakika içinde`;
    return "";
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <m.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div
            className={`relative rounded-2xl border p-4 flex items-center gap-4 ${
              isUrgent
                ? "bg-red-500/10 border-red-500/30"
                : "bg-primary/10 border-primary/30"
            }`}
          >
            {/* Pulse dot */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isUrgent
                  ? "bg-red-500/20 animate-pulse"
                  : "bg-primary/20"
              }`}
            >
              <Timer1
                className={`w-5 h-5 ${isUrgent ? "text-red-500" : "text-primary"}`}
                variant="Bulk"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-heading font-black ${
                  isUrgent ? "text-red-500" : "text-primary"
                }`}
              >
                {isUrgent ? "🔴 Ders başlamak üzere!" : "📢 Yaklaşan ders"}
              </p>
              <p className="text-xs font-bold text-foreground mt-0.5 truncate">
                {lessonTitle || "Canlı Ders"} — {formatTime()}
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/canli-ders"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-heading font-bold text-xs transition-all hover:-translate-y-0.5 shrink-0 ${
                isUrgent
                  ? "bg-red-500 text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)]"
                  : "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(0,103,98,0.2)]"
              }`}
            >
              Derse Git
              <ArrowRight2 className="w-3 h-3" variant="Outline" />
            </Link>

            {/* Dismiss */}
            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded-lg hover:bg-background/50 transition-colors shrink-0"
            >
              <CloseCircle className="w-4 h-4 text-muted-foreground" variant="Outline" />
            </button>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
