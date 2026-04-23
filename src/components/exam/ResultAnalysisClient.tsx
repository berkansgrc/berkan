"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, MinusCircle } from "lucide-react";
import DownloadPDFButton from "@/components/exam/DownloadPDFButton";

type Question = {
  id: string;
  orderIndex: number;
  body: string;
  selectedOption: string | null;
  correctOption: string;
  isCorrect: boolean;
  achievement: string | null;
};

type Props = {
  examId: string;
  questions: Question[];
  studentName: string;
  examTitle: string;
  date: string;
  durationMinutes: number;
  correct: number;
  wrong: number;
  blank: number;
  score: number;
};

export default function ResultAnalysisClient(props: Props) {
  const [timeLogs, setTimeLogs] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`exam-${props.examId}-answers_times`);
      if (saved) {
        setTimeLogs(JSON.parse(saved));
      }
    }
  }, [props.examId]);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const rs = s % 60;
    if (m > 0) return `${m}dk ${rs}sn`;
    return `${rs}sn`;
  };

  const pdfQuestions = props.questions.map((q) => ({
    ...q,
    timeSpentMs: timeLogs[q.id] || 0,
  }));

  // Geliştirilmesi gereken kazanımları bul
  const wrongAchievements = props.questions
    .filter((q) => !q.isCorrect && q.achievement)
    .map((q) => q.achievement!)
    .reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const improvementAreas = Object.entries(wrongAchievements)
    .sort((a, b) => b[1] - a[1]) // En çok yanlış yapılan kazanımı üste al
    .map(([name, count]) => ({ name, count }));

  return (
    <>
      {/* Geliştirilmesi Gereken Konular */}
      {improvementAreas.length > 0 && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 shadow-sm overflow-hidden mt-8">
          <div className="px-6 py-4 border-b border-destructive/10 bg-destructive/10">
            <h2 className="font-semibold text-destructive flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground font-bold">!</span>
              Geliştirilmesi Gereken Konular
            </h2>
            <p className="text-sm text-destructive/80 mt-1">
              Yanlış yapılan veya boş bırakılan sorulara göre tekrar etmen gereken kazanımlar.
            </p>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {improvementAreas.map((area, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
                  style={{ animation: `stagger-in 0.45s ease-out ${idx * 0.08}s both` }}
                >
                  <span className="font-medium text-sm">{area.name}</span>
                  <span className="text-xs font-bold bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                    {area.count} Hata
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Soru Analizi */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-4 border-b bg-muted/30">
          <h2 className="font-semibold">Soru Analizi</h2>
        </div>
        <div className="divide-y">
          {props.questions.map((q, rowIdx) => {
            const timeMs = timeLogs[q.id] || 0;
            return (
              <div
                key={q.orderIndex}
                className="flex items-start gap-4 px-6 py-4"
                style={{ animation: `stagger-in 0.4s ease-out ${rowIdx * 0.05}s both` }}
              >
                <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold bg-muted">
                  {q.orderIndex}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">{q.body}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs">
                    <span>
                      Cevabın:{" "}
                      <strong className={q.selectedOption ? "" : "text-muted-foreground"}>
                        {q.selectedOption ?? "Boş"}
                      </strong>
                    </span>
                    <span>
                      Doğru: <strong className="text-green-600">{q.correctOption}</strong>
                    </span>
                    {timeMs > 0 && (
                      <span className="text-muted-foreground flex items-center gap-1">
                        Süre: <strong>{formatTime(timeMs)}</strong>
                      </span>
                    )}
                  </div>
                  {q.achievement && (
                    <div className="mt-2">
                      <span className="achievement-badge inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/5 text-primary border-primary/20">
                        {q.achievement}
                      </span>
                    </div>
                  )}
                </div>
                {q.isCorrect ? (
                  <CheckCircle className="shrink-0 h-5 w-5 text-green-600" />
                ) : q.selectedOption ? (
                  <XCircle className="shrink-0 h-5 w-5 text-red-500" />
                ) : (
                  <MinusCircle className="shrink-0 h-5 w-5 text-slate-400" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* PDF İndirme Butonu (Analizden hemen sonra) */}
      <div className="flex justify-center mt-6">
        <DownloadPDFButton
          studentName={props.studentName}
          examTitle={props.examTitle}
          date={props.date}
          durationMinutes={props.durationMinutes}
          correct={props.correct}
          wrong={props.wrong}
          blank={props.blank}
          score={props.score}
          questions={pdfQuestions}
        />
      </div>
    </>
  );
}
