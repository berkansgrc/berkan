"use client";

import { useState, useEffect } from "react";
import { ChevronDown, CheckCircle2, XCircle, MinusCircle, Clock, Download } from "lucide-react";
import { generateResultPDF } from "@/lib/pdf";
import { Button } from "@/components/ui/button";
import { m, AnimatePresence } from "framer-motion";

type QuestionResult = {
  id: string;
  orderIndex: number;
  body: string;
  selectedOption: string | null;
  correctOption: string;
  isCorrect: boolean;
  timeSpentMs?: number;
  achievement?: string | null;
};

type Props = {
  examId: string;
  resultId: string;
  questions: QuestionResult[];
  studentName: string;
  examTitle: string;
  date: string;
  durationMinutes: number;
  correct: number;
  wrong: number;
  blank: number;
  score: number;
};

export default function ResultAnalysisClient({
  resultId,
  questions,
  studentName,
  examTitle,
  date,
  durationMinutes,
  correct,
  wrong,
  blank,
  score,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "correct" | "wrong" | "blank">("all");
  const [isDownloading, setIsDownloading] = useState(false);
  const [timeLogs, setTimeLogs] = useState<Record<string, number>>({});

  // localStorage'dan süre verilerini oku (client-only, Supabase gerektirmez)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`result_${resultId}_times`);
      if (raw) setTimeLogs(JSON.parse(raw));
    } catch {
      // localStorage erişelemezse sessizce geç
    }
  }, [resultId]);

  // Sorulara süre bilgisini lokalde ekle
  const questionsWithTime = questions.map(q => ({
    ...q,
    timeSpentMs: timeLogs[q.id] ?? q.timeSpentMs,
  }));

  const wrongAchievements = questions
    .filter((q) => !q.isCorrect && q.achievement)
    .reduce<Record<string, number>>((acc, q) => {
      const key = q.achievement!;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  const improvementAreas = Object.entries(wrongAchievements)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const filteredQuestions = questionsWithTime.filter((q) => {
    if (filter === "correct") return q.isCorrect;
    if (filter === "wrong") return !q.isCorrect && q.selectedOption;
    if (filter === "blank") return !q.selectedOption;
    return true;
  });

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generateResultPDF({ studentName, examTitle, date, durationMinutes, correct, wrong, blank, score, questions: questionsWithTime });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Improvement Areas */}
      {improvementAreas.length > 0 && (
        <div className="rounded-[1.5rem] border border-red-400/30 bg-red-500/5 p-6 space-y-4">
          <h3 className="font-heading font-extrabold text-lg text-foreground flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            Geliştirilmesi Gereken Konular
          </h3>
          <div className="space-y-2.5">
            {improvementAreas.map(([topic, count]) => (
              <div key={topic} className="flex items-center gap-3">
                <div className="flex-1 bg-muted/40 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-full transition-all duration-700"
                    style={{ width: `${(count / Math.max(...Object.values(wrongAchievements))) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-foreground min-w-0 flex-1 text-right">{topic}</span>
                <span className="text-xs font-black text-red-600 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 shrink-0">
                  {count} hata
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question List Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="font-heading font-extrabold text-xl text-foreground">Soru Analizi</h3>
        <div className="flex items-center gap-2">
          {(["all", "correct", "wrong", "blank"] as const).map((f) => {
            const labels = { all: `Tümü (${questions.length})`, correct: `Doğru (${correct})`, wrong: `Yanlış (${wrong})`, blank: `Boş (${blank})` };
            const colors = { all: "bg-primary text-primary-foreground", correct: "bg-emerald-500 text-white", wrong: "bg-red-500 text-white", blank: "bg-slate-500 text-white" };
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold border transition-all ${
                  filter === f ? colors[f] + " border-transparent shadow-sm" : "bg-input/40 border-border/50 text-muted-foreground hover:bg-input"
                }`}
              >
                {labels[f]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {filteredQuestions.map((q) => {
          const isExpanded = expandedId === q.id;
          const timeSpentSec = q.timeSpentMs ? Math.floor(q.timeSpentMs / 1000) : 0;
          const timeMin = Math.floor(timeSpentSec / 60);
          const timeSec = timeSpentSec % 60;
          const timeStr = timeMin > 0 ? `${timeMin}dk ${timeSec}sn` : `${timeSec}sn`;
          const isSlowTime = timeSpentSec > 120;

          return (
            <m.div
              key={q.id}
              layout
              className={`rounded-[1.25rem] border overflow-hidden transition-colors ${
                q.isCorrect
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : q.selectedOption
                  ? "border-red-500/20 bg-red-500/5"
                  : "border-slate-400/20 bg-slate-400/5"
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left"
              >
                {q.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : q.selectedOption ? (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                ) : (
                  <MinusCircle className="w-5 h-5 text-slate-400 shrink-0" />
                )}
                <span className="text-xs font-black text-muted-foreground shrink-0">S{q.orderIndex}</span>
                <p className="flex-1 text-sm font-medium text-foreground line-clamp-1">{q.body}</p>
                <div className="flex items-center gap-3 shrink-0">
                  {q.timeSpentMs !== undefined && (
                    <span className={`flex items-center gap-1 text-xs font-bold ${isSlowTime ? "text-orange-500" : "text-muted-foreground"}`}>
                      <Clock className="w-3 h-3" />
                      {timeStr}
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-2 border-t border-border/30 space-y-3">
                      <p className="text-sm text-foreground font-medium leading-relaxed">{q.body}</p>
                      <div className="flex flex-wrap gap-3 text-sm font-bold">
                        <span className="flex items-center gap-1.5 bg-input/50 px-3 py-1.5 rounded-lg border border-border/50">
                          Senin cevabın: <span className={q.isCorrect ? "text-emerald-600" : "text-red-500"}>{q.selectedOption ?? "—"}</span>
                        </span>
                        <span className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                          Doğru cevap: <span className="text-emerald-600">{q.correctOption}</span>
                        </span>
                        {q.achievement && (
                          <span className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/20 text-primary">
                            {q.achievement}
                          </span>
                        )}
                      </div>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </m.div>
          );
        })}
      </div>

      {/* PDF Download */}
      <div className="flex justify-center pt-2">
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          variant="outline"
          className="gap-2 rounded-xl h-12 font-heading font-bold px-6"
        >
          <Download className="h-4 w-4" />
          {isDownloading ? "Hazırlanıyor..." : "Raporu PDF İndir"}
        </Button>
      </div>
    </div>
  );
}
