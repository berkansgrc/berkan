"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import ExamTimer from "@/components/exam/ExamTimer";
import QuestionCard from "@/components/exam/QuestionCard";
import SubmitConfirmModal from "@/components/exam/SubmitConfirmModal";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Flag, HelpCircle } from "lucide-react";

type Option = { label: string; text: string };
type Question = {
  id: string;
  body: string;
  options: Option[];
  order_index: number;
  image_url?: string | null;
};
type Exam = {
  id: string;
  title: string;
  duration_minutes: number;
};
type Props = {
  exam: Exam;
  questions: Question[];
  resultId: string;
  storageKey: string;
};

export default function ExamEngine({ exam, questions, resultId, storageKey }: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey + "_answers");
      if (saved) return JSON.parse(saved);
    }
    return {};
  });
  const answersRef = useRef(answers);
  const cardRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);
  const [shimmerKey, setShimmerKey] = useState(0);
  const [flagged, setFlagged] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey + "_flagged");
      if (saved) return new Set(JSON.parse(saved));
    }
    return new Set();
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const [timeLogs, setTimeLogs] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey + "_times");
      if (saved) return JSON.parse(saved);
    }
    return {};
  });
  const timeLogsRef = useRef(timeLogs);

  // localStorage sync
  useEffect(() => {
    localStorage.setItem(storageKey + "_answers", JSON.stringify(answers));
    answersRef.current = answers;
  }, [answers, storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey + "_times", JSON.stringify(timeLogs));
    timeLogsRef.current = timeLogs;
  }, [timeLogs, storageKey]);

  useEffect(() => {
    const arr = Array.from(flagged);
    localStorage.setItem(storageKey + "_flagged", JSON.stringify(arr));
  }, [flagged, storageKey]);

  // Timer persistence: store startedAt on mount
  useEffect(() => {
    const key = storageKey + "_startedAt";
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, Date.now().toString());
    }
  }, [storageKey]);

  const saveProgressMutation = useMutation({
    mutationFn: async (currentAnswers: Record<string, string | null>) => {
      const res = await fetch("/api/exams/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultId, answers: currentAnswers }),
      });
      if (!res.ok) throw new Error("Auto-save failed");
      return res.json();
    },
    onError: (err) => console.error("Auto-save failed", err),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      saveProgressMutation.mutate(answersRef.current);
    }, 30000);
    return () => clearInterval(interval);
  }, [resultId, saveProgressMutation]);

  // Per-question time tracking
  useEffect(() => {
    if (!questions[current]) return;
    const qId = questions[current].id;
    const timer = setInterval(() => {
      setTimeLogs((prev) => ({ ...prev, [qId]: (prev[qId] || 0) + 1000 }));
    }, 1000);
    return () => clearInterval(timer);
  }, [current, questions]);

  // Question card slide animation
  const animateQuestionTransition = useCallback((direction: "next" | "prev") => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    const xFrom = direction === "next" ? 60 : -60;
    el.style.opacity = "0";
    el.style.transform = `translateX(${xFrom}px) scale(0.97)`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "opacity 0.38s ease, transform 0.42s cubic-bezier(0.34, 1.56, 0.64, 1)";
        el.style.opacity = "1";
        el.style.transform = "translateX(0) scale(1)";
      });
    });
  }, []);

  const goTo = useCallback((idx: number) => {
    const dir = idx > current ? "next" : "prev";
    setCurrent(idx);
    animateQuestionTransition(dir);
  }, [current, animateQuestionTransition]);

  // Milestone shimmer
  const answeredCount = questions.filter((q) => answers[q.id]).length;
  useEffect(() => {
    const pct = Math.floor((answeredCount / questions.length) * 100);
    const prevPct = Math.floor((prevCountRef.current / questions.length) * 100);
    const milestones = [25, 50, 75, 100];
    const crossed = milestones.some((m) => prevPct < m && pct >= m);
    if (crossed) setShimmerKey((k) => k + 1);
    prevCountRef.current = answeredCount;
  }, [answeredCount, questions.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;
      const q = questions[current];
      if (!q) return;
      if (e.key === "ArrowRight") goTo(Math.min(questions.length - 1, current + 1));
      else if (e.key === "ArrowLeft") goTo(Math.max(0, current - 1));
      else if (e.key === "f" || e.key === "F") toggleFlag(q.id);
      else {
        const optionKeys = ["A", "B", "C", "D", "E", "a", "b", "c", "d", "e"];
        if (optionKeys.includes(e.key)) {
          const option = q.options.find((opt) => opt.label.toUpperCase() === e.key.toUpperCase());
          if (option) handleSelect(q.id, option.label);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [current, questions, goTo]);

  // Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) goTo(Math.min(questions.length - 1, current + 1));
      else goTo(Math.max(0, current - 1));
    }
    touchStartX.current = null;
  };

  const handleSelect = useCallback((questionId: string, label: string) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev, [questionId]: label };
      answersRef.current = newAnswers;
      return newAnswers;
    });
  }, []);

  const toggleFlag = useCallback((questionId: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }, []);

  const submitExamMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/exams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultId, answers: answersRef.current, examId: exam.id }),
      });
      if (!res.ok) throw new Error("Submit failed");
      return res.json();
    },
    onSuccess: () => {
      // Süre loglarını result bazında sakla (sonuç sayfası PDF için okuyacak)
      const savedTimes = localStorage.getItem(storageKey + "_times");
      if (savedTimes) {
        localStorage.setItem(`result_${resultId}_times`, savedTimes);
      }
      localStorage.removeItem(storageKey + "_answers");
      localStorage.removeItem(storageKey + "_times");
      localStorage.removeItem(storageKey + "_flagged");
      localStorage.removeItem(storageKey + "_startedAt");
      router.push(`/exams/result/${resultId}`);
    },
    onError: () => {
      alert("Sınav gönderilirken bir sorun oluştu.");
    },
  });

  const handleSubmit = useCallback(() => {
    if (submitExamMutation.isPending) return;
    submitExamMutation.mutate();
  }, [submitExamMutation]);

  const question = questions[current];
  const flaggedCount = flagged.size;

  return (
    <div
      className="min-h-screen bg-background relative overflow-x-hidden font-sans"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none translate-x-1/3 -translate-y-1/3" />

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="hidden md:flex h-12 w-12 rounded-2xl bg-primary-container border border-primary/20 items-center justify-center relative">
              <div className="absolute inset-2 bg-primary/20 blur-md rounded-full" />
              <span className="font-heading font-extrabold text-[#005a55] relative z-10 text-xl">E</span>
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-lg md:text-xl text-foreground line-clamp-1">{exam.title}</h1>
              <p className="text-sm font-medium text-muted-foreground mt-0.5">
                <span className="text-primary font-bold">{answeredCount}</span> / {questions.length} Cevaplandı
                {flaggedCount > 0 && (
                  <span className="ml-3 text-blue-500 font-bold">· {flaggedCount} İşaretli</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 border-t md:border-t-0 border-border/50 pt-3 md:pt-0">
            <div className="bg-input/50 border border-border/50 px-4 py-2 rounded-xl flex items-center gap-3">
              <ExamTimer
                durationMinutes={exam.duration_minutes}
                storageKey={storageKey}
                onTimeUp={handleSubmit}
              />
            </div>
            <Button
              onClick={() => setShowConfirmModal(true)}
              disabled={submitExamMutation.isPending}
              className="rounded-xl font-heading font-bold px-6 bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground border-0 shadow-[0_8px_16px_rgba(0,103,98,0.2)] hover:shadow-[0_12px_24px_rgba(0,103,98,0.3)] hover:-translate-y-0.5 transition-all"
            >
              {submitExamMutation.isPending ? "Gönderiliyor..." : "Sınavı Bitir"}
            </Button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-primary/10 relative overflow-hidden">
          <div
            key={`progress-${shimmerKey}`}
            className={`absolute top-0 left-0 h-full bg-primary/80 transition-all duration-500 ease-out ${
              answeredCount / questions.length >= 0.5 ? "shadow-[0_0_10px_rgba(0,103,98,0.8)]" : ""
            } ${answeredCount / questions.length === 1 ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.9)]" : ""} ${
              shimmerKey > 0 ? "progress-shimmer" : ""
            }`}
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Flag button for current question */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => question && toggleFlag(question.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-heading font-bold border transition-all ${
              question && flagged.has(question.id)
                ? "bg-blue-500/15 border-blue-500/40 text-blue-600 hover:bg-blue-500/25"
                : "bg-input/40 border-border/50 text-muted-foreground hover:text-foreground hover:bg-input"
            }`}
            title="Soruyu işaretle (F)"
          >
            <Flag className={`w-4 h-4 ${question && flagged.has(question.id) ? "fill-blue-500" : ""}`} />
            {question && flagged.has(question.id) ? "İşaretlendi" : "İşaretle"}
          </button>
        </div>

        {/* Question Card */}
        <div ref={cardRef} style={{ willChange: "transform, opacity" }}>
          {question && (
            <QuestionCard
              orderIndex={question.order_index}
              body={question.body}
              options={question.options}
              imageUrl={question.image_url}
              selectedOption={answers[question.id] ?? null}
              onSelect={(label) => handleSelect(question.id, label)}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="mt-10 space-y-5">
          <div className="flex items-center justify-between">
            <p className="font-heading font-bold text-sm text-muted-foreground">
              Soru <span className="text-foreground">{current + 1}</span> / {questions.length}
            </p>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500/80 border border-emerald-600/30" />
                Cevaplandı ({answeredCount})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-400/80 border border-amber-500/30" />
                Boş ({questions.length - answeredCount})
              </span>
              {flaggedCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-blue-400/80 border border-blue-500/30" />
                  İşaretli ({flaggedCount})
                </span>
              )}
            </div>
          </div>

          {/* Question grid */}
          <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-4 shadow-sm">
            <div className="flex flex-wrap gap-2 justify-center">
              {questions.map((q, i) => {
                const isCurrent = i === current;
                const isAnswered = !!answers[q.id];
                const isFlagged = flagged.has(q.id);
                let colorClasses = "";
                if (isCurrent) {
                  if (isFlagged) colorClasses = "bg-blue-500 text-white border-blue-600 shadow-md ring-2 ring-blue-400/40 scale-110";
                  else if (isAnswered) colorClasses = "bg-emerald-500 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400/40 scale-110";
                  else colorClasses = "bg-amber-400 text-amber-900 border-amber-500 shadow-md ring-2 ring-amber-300/40 scale-110";
                } else if (isFlagged) {
                  colorClasses = "bg-blue-500/15 text-blue-700 border-blue-500/30 hover:bg-blue-500/25";
                } else if (isAnswered) {
                  colorClasses = "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/25";
                } else {
                  colorClasses = "bg-amber-400/15 text-amber-700 border-amber-400/30 hover:bg-amber-400/25";
                }
                return (
                  <button
                    key={q.id}
                    onClick={() => goTo(i)}
                    className={`h-10 w-10 flex-shrink-0 rounded-xl text-sm font-heading font-bold border-2 transition-all duration-200 flex items-center justify-center relative ${colorClasses}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prev / Next */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => goTo(Math.max(0, current - 1))}
              disabled={current === 0}
              className="flex-1 h-12 rounded-xl font-heading font-bold bg-card/60 backdrop-blur-md border border-border/60 hover:bg-input hover:text-foreground transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" /> Önceki
            </button>
            <button
              onClick={() => goTo(Math.min(questions.length - 1, current + 1))}
              disabled={current === questions.length - 1}
              className="flex-1 h-12 rounded-xl font-heading font-bold bg-card/60 backdrop-blur-md border border-border/60 text-foreground hover:bg-input transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sonraki <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Hint */}
        <div className="mt-12 mb-20 rounded-[1.5rem] border border-border/50 bg-input/20 px-6 py-4 flex items-start sm:items-center gap-4 text-sm text-muted-foreground font-medium">
          <div className="bg-background rounded-full p-2 shrink-0 shadow-sm border border-border/50">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <p>
            Ok tuşları ile sorular arasında geçiş yap. <kbd className="px-1.5 py-0.5 rounded bg-input border border-border text-xs font-mono">F</kbd> ile soruyu işaretle.
            Tüm cevapların arka planda otomatik kaydediliyor.
          </p>
        </div>
      </div>

      {/* Confirm Modal */}
      <SubmitConfirmModal
        open={showConfirmModal}
        onConfirm={() => { setShowConfirmModal(false); handleSubmit(); }}
        onCancel={() => setShowConfirmModal(false)}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        flaggedCount={flaggedCount}
      />
    </div>
  );
}
