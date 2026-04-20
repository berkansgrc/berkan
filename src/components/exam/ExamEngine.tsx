"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ExamTimer from "@/components/exam/ExamTimer";
import QuestionCard from "@/components/exam/QuestionCard";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronLeft, ChevronRight, Send, HelpCircle, ArrowLeft } from "lucide-react";

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
  resultId: string; // Ön oluşturulmuş result kaydı ID'si
  storageKey: string;
};

export default function ExamEngine({ exam, questions, resultId, storageKey }: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    }
    return {};
  });
  const answersRef = useRef(answers);
  const [submitting, setSubmitting] = useState(false);

  // localStorage'a ara kayıt
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(answers));
    answersRef.current = answers;
  }, [answers, storageKey]);

  // Arka planda periyodik kaydetme (Heartbeat) - 30 saniyede bir
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/exams/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultId, answers: answersRef.current }),
      }).catch(err => console.error("Auto-save failed", err));
    }, 30000);
    return () => clearInterval(interval);
  }, [resultId]);

  const handleSelect = useCallback((questionId: string, label: string) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev, [questionId]: label };
      answersRef.current = newAnswers; // Synchronize ref immediately
      return newAnswers;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/exams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultId, answers: answersRef.current, examId: exam.id }),
      });

      if (res.ok) {
        localStorage.removeItem(storageKey);
        router.push(`/exams/result/${resultId}`);
      } else {
        alert("Sınav gönderilirken bir sorun oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.");
        setSubmitting(false);
      }
    } catch {
      alert("Ağ bağlantısı hatası! Lütfen internet bağlantınızı kontrol edip tekrar deneyin.");
      setSubmitting(false);
    }
  }, [submitting, resultId, exam.id, storageKey, router]);

  const answeredCount = questions.filter((q) => answers[q.id]).length;
  const question = questions[current];

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden font-sans">
      {/* Decorative Ethereal Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\\\'0 0 200 200\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\'%3E%3Cfilter id=\\\'noiseFilter\\\'%3E%3CfeTurbulence type=\\\'fractalNoise\\\' baseFrequency=\\\'0.65\\\' numOctaves=\\\'3\\\' stitchTiles=\\\'stitch\\\'/%3E%3C/filter%3E%3Crect width=\\\'100%25\\\' height=\\\'100%25\\\' filter=\\\'url(%23noiseFilter)\\\'/%3E%3C/svg%3E")' }}></div>
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm transition-all relative">
        <div className="container max-w-4xl mx-auto px-4 py-4 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="hidden md:flex h-12 w-12 rounded-2xl bg-primary-container border border-primary/20 items-center justify-center relative">
                 <div className="absolute inset-2 bg-primary/20 blur-md rounded-full"></div>
                 <span className="font-heading font-extrabold text-[#005a55] relative z-10 text-xl text-center leading-none mt-1">E</span>
             </div>
             <div>
                <h1 className="font-heading font-extrabold text-lg md:text-xl text-foreground line-clamp-1">{exam.title}</h1>
                <p className="text-sm font-medium text-muted-foreground mt-0.5">
                  <span className="text-primary font-bold">{answeredCount}</span> / {questions.length} Soru Cevaplandı
                </p>
             </div>
          </div>
          <div className="flex items-center gap-4 border-t md:border-t-0 border-border/50 pt-3 md:pt-0">
             <div className="bg-input/50 border border-border/50 px-4 py-2 rounded-xl flex items-center gap-3">
                 <ExamTimer durationMinutes={exam.duration_minutes} onTimeUp={handleSubmit} />
             </div>
             <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-xl font-heading font-bold px-6 bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground border-0 shadow-[0_8px_16px_rgba(0,103,98,0.2)] hover:shadow-[0_12px_24px_rgba(0,103,98,0.3)] hover:-translate-y-0.5 transition-all"
              >
                {submitting ? "Gönderiliyor..." : "Sınavı Bitir"}
              </Button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-primary/10 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary/80 transition-all duration-500 ease-out"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Soru İçeriği */}
      <div className="container max-w-4xl mx-auto px-4 py-8 relative z-10">
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

        {/* Alt Navigasyon ve Kontroller */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-10 gap-6">
          <Button
            variant="outline"
            className="w-full md:w-auto h-12 px-6 rounded-xl font-heading font-bold bg-card/60 backdrop-blur-md border-border/60 hover:bg-input hover:text-foreground transition-all"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            <ChevronLeft className="h-5 w-5 mr-2" /> Önceki Soru
          </Button>

          {/* Soru Navigasyon Kutucukları */}
          <div className="flex bg-card/60 backdrop-blur-md border border-border/60 p-2 rounded-2xl shadow-sm overflow-x-auto max-w-full">
            <div className="flex gap-1.5 min-w-max px-2">
                {questions.map((q, i) => {
                const isCurrent = i === current;
                const isAnswered = !!answers[q.id];
                
                return (
                <button
                    key={q.id}
                    onClick={() => setCurrent(i)}
                    className={`h-10 w-10 flex-shrink-0 rounded-[0.75rem] text-sm font-heading font-bold border-2 transition-all flex items-center justify-center ${
                    isCurrent
                        ? "bg-primary text-primary-foreground border-primary shadow-sm scale-110 relative z-10"
                        : isAnswered
                        ? "bg-primary/15 text-primary border-primary/20 hover:border-primary/40"
                        : "bg-input/30 border-border/50 text-muted-foreground hover:bg-input hover:text-foreground"
                    }`}
                >
                    {i + 1}
                </button>
                );
                })}
            </div>
          </div>

          <Button
            className="w-full md:w-auto h-12 px-6 rounded-xl font-heading font-bold bg-card/60 backdrop-blur-md border-border/60 border text-foreground hover:bg-input transition-all"
            onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
            disabled={current === questions.length - 1}
          >
            Sonraki Soru <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>

        {/* Uyarı Mesajı */}
        <div className="mt-12 mb-20 rounded-[1.5rem] border border-border/50 bg-input/20 px-6 py-4 flex items-start sm:items-center gap-4 text-sm text-muted-foreground font-medium">
          <div className="bg-background rounded-full p-2 shrink-0 shadow-sm border border-border/50">
             <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <p>
            Cevaplamadığınız sorular sınav süreniz bittiğinde otomatik boş bırakılmış sayılacaktır.
            Tüm cevaplarınız arka planda anlık olarak güvendedir.
          </p>
        </div>
      </div>
    </div>
  );
}
