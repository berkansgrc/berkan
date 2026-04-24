"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  CloseCircle,
  Danger,
  TickCircle,
  MinusCirlce,
  Chart,
} from "iconsax-react";

interface QuestionStat {
  id: string;
  orderIndex: number;
  body: string;
  correctOption: string;
  achievement: string | null;
  correctCount: number;
  wrongCount: number;
  blankCount: number;
  total: number;
  correctRate: number;
  wrongRate: number;
}

interface AchievementStat {
  name: string;
  correctRate: number;
  total: number;
}

interface ExamDetailModalProps {
  examId: string | null;
  examTitle: string;
  onClose: () => void;
}

export default function ExamDetailModal({
  examId,
  examTitle,
  onClose,
}: ExamDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [questionStats, setQuestionStats] = useState<QuestionStat[]>([]);
  const [hardestQuestions, setHardestQuestions] = useState<QuestionStat[]>([]);
  const [achievementStats, setAchievementStats] = useState<AchievementStat[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);

  useEffect(() => {
    if (!examId) return;
    setLoading(true);
    fetch(`/api/admin/analytics?type=exam-detail&examId=${examId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestionStats(data.questionStats || []);
        setHardestQuestions(data.hardestQuestions || []);
        setAchievementStats(data.achievementStats || []);
        setTotalParticipants(data.totalParticipants || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [examId]);

  // ESC to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (examId) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [examId, onClose]);

  const getBarColor = (rate: number) => {
    if (rate >= 70) return "bg-emerald-500";
    if (rate >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <AnimatePresence>
      {examId && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-md z-[80]"
            onClick={onClose}
          />

          {/* Modal */}
          <m.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-4 md:inset-auto md:top-[5%] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl md:max-h-[90vh] z-[81] bg-card/95 backdrop-blur-3xl rounded-[1.5rem] border border-border/50 shadow-2xl shadow-black/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <div>
                <h2 className="font-heading font-black text-lg text-foreground">
                  {examTitle}
                </h2>
                <p className="text-[11px] text-muted-foreground font-bold mt-0.5">
                  {totalParticipants} katılımcı · {questionStats.length} soru
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all active:scale-95"
              >
                <CloseCircle className="w-5 h-5" variant="Outline" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {/* En Zorlanılan 5 Soru */}
                  {hardestQuestions.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Danger className="w-4 h-4 text-red-500" variant="Bulk" />
                        <h3 className="font-heading font-black text-sm text-foreground">
                          En Zorlanılan Sorular
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {hardestQuestions.map((q, idx) => (
                          <m.div
                            key={q.id}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="rounded-xl bg-muted/20 border border-border/40 p-4"
                          >
                            <div className="flex items-start gap-3">
                              <span className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center text-[11px] font-black shrink-0 border border-red-500/20">
                                {q.orderIndex}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground line-clamp-1 font-medium">
                                  {q.body}
                                </p>
                                {q.achievement && (
                                  <span className="mt-1 inline-flex text-[10px] font-bold text-primary bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full">
                                    {q.achievement}
                                  </span>
                                )}
                              </div>
                              <span className="text-sm font-black text-red-500 shrink-0">
                                %{q.wrongRate}
                              </span>
                            </div>

                            {/* Bar */}
                            <div className="mt-3 flex items-center gap-1 h-3">
                              <div
                                className="h-full bg-emerald-500 rounded-l-full transition-all"
                                style={{ width: `${q.correctRate}%` }}
                                title={`Doğru: %${q.correctRate}`}
                              />
                              <div
                                className="h-full bg-red-500 transition-all"
                                style={{ width: `${q.wrongRate}%` }}
                                title={`Yanlış: %${q.wrongRate}`}
                              />
                              <div
                                className="h-full bg-muted rounded-r-full transition-all"
                                style={{
                                  width: `${100 - q.correctRate - q.wrongRate}%`,
                                }}
                                title={`Boş: %${(100 - q.correctRate - q.wrongRate).toFixed(1)}`}
                              />
                            </div>
                            <div className="flex items-center gap-4 mt-1.5 text-[9px] font-bold text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                Doğru {q.correctCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                Yanlış {q.wrongCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-muted" />
                                Boş {q.blankCount}
                              </span>
                            </div>
                          </m.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Kazanım Bazlı Başarı */}
                  {achievementStats.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Chart className="w-4 h-4 text-primary" variant="Bulk" />
                        <h3 className="font-heading font-black text-sm text-foreground">
                          Kazanım Bazlı Başarı
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {achievementStats.map((ach, idx) => (
                          <m.div
                            key={ach.name}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="flex items-center gap-3"
                          >
                            <span className="font-medium text-sm text-foreground w-40 truncate shrink-0">
                              {ach.name}
                            </span>
                            <div className="flex-1 h-3 bg-muted/40 rounded-full overflow-hidden">
                              <m.div
                                initial={{ width: 0 }}
                                animate={{ width: `${ach.correctRate}%` }}
                                transition={{
                                  delay: idx * 0.04 + 0.2,
                                  duration: 0.8,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                                className={`h-full rounded-full ${getBarColor(ach.correctRate)}`}
                              />
                            </div>
                            <span
                              className={`font-heading font-black text-sm w-14 text-right ${
                                ach.correctRate >= 70
                                  ? "text-emerald-500"
                                  : ach.correctRate >= 50
                                    ? "text-amber-500"
                                    : "text-red-500"
                              }`}
                            >
                              %{ach.correctRate}
                            </span>
                          </m.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tüm Sorular Tablosu */}
                  <div>
                    <h3 className="font-heading font-black text-sm text-foreground mb-3">
                      Soru Bazlı Dağılım
                    </h3>
                    <div className="rounded-xl border border-border/40 overflow-hidden">
                      {/* Table Header */}
                      <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-muted/20 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        <div className="col-span-1">#</div>
                        <div className="col-span-2">Doğru</div>
                        <div className="col-span-2">Yanlış</div>
                        <div className="col-span-2">Boş</div>
                        <div className="col-span-5">Başarı</div>
                      </div>
                      <div className="divide-y divide-border/30">
                        {questionStats.map((q) => (
                          <div
                            key={q.id}
                            className="grid grid-cols-12 gap-2 px-4 py-2.5 items-center hover:bg-muted/10 transition-colors"
                          >
                            <div className="col-span-1 text-xs font-bold text-muted-foreground">
                              {q.orderIndex}
                            </div>
                            <div className="col-span-2 text-xs font-bold text-emerald-500">
                              {q.correctCount}
                            </div>
                            <div className="col-span-2 text-xs font-bold text-red-500">
                              {q.wrongCount}
                            </div>
                            <div className="col-span-2 text-xs font-bold text-muted-foreground">
                              {q.blankCount}
                            </div>
                            <div className="col-span-5 flex items-center gap-2">
                              <div className="flex-1 h-2 bg-muted/40 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${getBarColor(q.correctRate)}`}
                                  style={{ width: `${q.correctRate}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-bold text-muted-foreground w-10 text-right">
                                %{q.correctRate}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-border/50 bg-muted/5 flex items-center justify-between">
              <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                Sınav Detay Analizi
              </span>
              <button
                onClick={onClose}
                className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Kapat
              </button>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
