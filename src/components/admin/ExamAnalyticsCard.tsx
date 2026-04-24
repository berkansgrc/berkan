"use client";

import { m } from "framer-motion";
import {
  Chart,
  Profile2User,
  TickCircle,
  Clock,
} from "iconsax-react";

interface ExamAnalyticsCardProps {
  examTitle: string;
  participants: number;
  avgScore: number;
  avgCorrect: number;
  avgWrong: number;
  maxScore: number;
  minScore: number;
  isPublished: boolean;
  index: number;
  onClick: () => void;
}

export default function ExamAnalyticsCard({
  examTitle,
  participants,
  avgScore,
  avgCorrect,
  avgWrong,
  maxScore,
  minScore,
  isPublished,
  index,
  onClick,
}: ExamAnalyticsCardProps) {
  // Başarı oranı rengi (avgScore / totalQuestions yerine doğrudan avgScore kullanıyoruz)
  const scoreColor =
    avgScore >= 70
      ? "text-emerald-500"
      : avgScore >= 50
        ? "text-amber-500"
        : "text-red-500";

  const scoreBg =
    avgScore >= 70
      ? "bg-emerald-500/10 border-emerald-500/20"
      : avgScore >= 50
        ? "bg-amber-500/10 border-amber-500/20"
        : "bg-red-500/10 border-red-500/20";

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={onClick}
      className="group cursor-pointer rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-6 hover:shadow-[0_20px_40px_rgba(44,47,48,0.06)] hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {examTitle}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${
                isPublished
                  ? "text-emerald-500"
                  : "text-muted-foreground"
              }`}
            >
              <TickCircle className="w-3 h-3" variant="Bold" />
              {isPublished ? "Yayında" : "Taslak"}
            </span>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-xl border ${scoreBg} flex items-center gap-1.5`}>
          <Chart className={`w-4 h-4 ${scoreColor}`} variant="Bulk" />
          <span className={`font-heading font-black text-lg ${scoreColor}`}>
            {avgScore}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4 relative z-10">
        <div className="rounded-xl bg-muted/30 border border-border/40 p-3 text-center">
          <Profile2User className="w-3.5 h-3.5 text-blue-500 mx-auto mb-1" variant="Bulk" />
          <p className="font-heading font-black text-lg text-foreground">{participants}</p>
          <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Katılımcı</p>
        </div>
        <div className="rounded-xl bg-muted/30 border border-border/40 p-3 text-center">
          <TickCircle className="w-3.5 h-3.5 text-emerald-500 mx-auto mb-1" variant="Bulk" />
          <p className="font-heading font-black text-lg text-foreground">{avgCorrect}</p>
          <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Ort. Doğru</p>
        </div>
        <div className="rounded-xl bg-muted/30 border border-border/40 p-3 text-center">
          <Clock className="w-3.5 h-3.5 text-red-500 mx-auto mb-1" variant="Bulk" />
          <p className="font-heading font-black text-lg text-foreground">{avgWrong}</p>
          <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Ort. Yanlış</p>
        </div>
      </div>

      {/* Range Bar */}
      <div className="relative z-10">
        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground mb-1">
          <span>Min: {minScore}</span>
          <span>Max: {maxScore}</span>
        </div>
        <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
          <m.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (avgScore / Math.max(maxScore, 1)) * 100)}%` }}
            transition={{ delay: index * 0.06 + 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
          />
        </div>
      </div>

      {/* Click hint */}
      <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-bold text-primary/60">
          Detay analiz için tıkla →
        </span>
      </div>
    </m.div>
  );
}
