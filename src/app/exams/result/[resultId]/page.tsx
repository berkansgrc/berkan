import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Award, RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResultAnalysisClient from "@/components/exam/ResultAnalysisClient";
import DonutChart from "@/components/ui/DonutChart";
import AnimatedScore from "@/components/exam/AnimatedScore";
import ShareResultButton from "@/components/exam/ShareResultButton";

type Props = {
  params: Promise<{ resultId: string }>;
};

export default async function ResultPage({ params }: Props) {
  const { resultId } = await params;
  const supabase = await createClient();

  const { data: result } = await supabase
    .from("exam_results")
    .select(`
      id, correct, wrong, blank, score, submitted_at, answers, guest_name,
      exams (id, title, duration_minutes),
      profiles (full_name)
    `)
    .eq("id", resultId)
    .single();

  if (!result) return notFound();

  const exam = result.exams as unknown as { id: string; title: string; duration_minutes: number } | null;
  const profile = result.profiles as unknown as { full_name: string | null } | null;

  const { data: questions } = await supabase
    .from("questions")
    .select("id, body, correct_option, order_index, achievement")
    .eq("exam_id", exam?.id ?? "")
    .order("order_index");

  const answers = (result.answers ?? {}) as Record<string, string>;
  const studentName = profile?.full_name ?? result.guest_name ?? "Misafir";
  const date = new Date(result.submitted_at).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  });

  const correct = result.correct ?? 0;
  const wrong = result.wrong ?? 0;
  const blank = result.blank ?? 0;
  const score = Number(result.score ?? 0);
  const total = correct + wrong + blank;
  const successRate = total > 0 ? Math.round((correct / total) * 100) : 0;

  const pdfQuestions = (questions ?? []).map((q) => ({
    id: q.id,
    orderIndex: q.order_index,
    body: q.body,
    selectedOption: answers[q.id] ?? null,
    correctOption: q.correct_option,
    isCorrect: answers[q.id] === q.correct_option,
    achievement: q.achievement ?? null,
    difficulty: (q as any).difficulty ?? null,
  }));

  const donutSegments = [
    { value: correct, color: "#22c55e", label: "Doğru" },
    { value: wrong, color: "#ef4444", label: "Yanlış" },
    { value: blank, color: "#94a3b8", label: "Boş" },
  ];

  const scoreColor = score >= 70 ? "text-emerald-500" : score >= 40 ? "text-amber-500" : "text-red-500";
  const scoreBg = score >= 70 ? "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20" : score >= 40 ? "from-amber-500/20 to-amber-500/5 border-amber-500/20" : "from-red-500/20 to-red-500/5 border-red-500/20";

  return (
    <div className="min-h-screen bg-background py-10 relative overflow-x-hidden">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none translate-x-1/3 -translate-y-1/3" />

      <div className="container max-w-3xl mx-auto px-4 space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-primary/10 border border-primary/20 mb-2 relative">
            <div className="absolute inset-0 bg-primary/10 blur-xl rounded-[1.5rem]" />
            <Award className="h-10 w-10 text-primary relative z-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight">Sınav Tamamlandı!</h1>
          <p className="text-muted-foreground font-medium">
            <span className="font-bold text-foreground">{studentName}</span> · {exam?.title}
          </p>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>

        {/* Score + Donut */}
        <div className={`rounded-[2rem] border bg-gradient-to-br ${scoreBg} p-8`}>
          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            {/* Donut */}
            <div className="flex flex-col items-center gap-3">
              <DonutChart
                segments={donutSegments}
                size={160}
                strokeWidth={22}
                centerLabel={`%${successRate}`}
                centerSubLabel="Başarı"
              />
              <div className="flex gap-4 text-xs font-bold">
                {donutSegments.map((s) => (
                  <span key={s.label} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 flex-1 max-w-sm">
              <div className="rounded-[1.25rem] bg-emerald-500/10 border border-emerald-500/20 p-5 text-center">
                <p className="text-3xl font-heading font-black text-emerald-600">{correct}</p>
                <p className="text-xs font-bold text-emerald-700/70 uppercase tracking-wider mt-1">Doğru</p>
              </div>
              <div className="rounded-[1.25rem] bg-red-500/10 border border-red-500/20 p-5 text-center">
                <p className="text-3xl font-heading font-black text-red-600">{wrong}</p>
                <p className="text-xs font-bold text-red-700/70 uppercase tracking-wider mt-1">Yanlış</p>
              </div>
              <div className="rounded-[1.25rem] bg-slate-500/10 border border-slate-500/20 p-5 text-center">
                <p className="text-3xl font-heading font-black text-slate-500">{blank}</p>
                <p className="text-xs font-bold text-slate-600/70 uppercase tracking-wider mt-1">Boş</p>
              </div>
              <div className={`rounded-[1.25rem] bg-gradient-to-br ${scoreBg} border p-5 text-center`}>
                <AnimatedScore score={score} className={`text-3xl font-heading font-black ${scoreColor}`} />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Net Puan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Soru Analizi & PDF */}
        <ResultAnalysisClient
          examId={exam?.id ?? ""}
          resultId={resultId}
          questions={pdfQuestions}
          studentName={studentName}
          examTitle={exam?.title ?? "Sınav"}
          date={date}
          durationMinutes={exam?.duration_minutes ?? 0}
          correct={correct}
          wrong={wrong}
          blank={blank}
          score={score}
        />

        {/* Aksiyon Butonları */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pb-6">
          <Link href={`/exams/${exam?.id}`}>
            <Button variant="outline" className="w-full sm:w-auto gap-2 rounded-xl h-12 font-heading font-bold">
              <RotateCcw className="w-4 h-4" />
              Tekrar Çöz
            </Button>
          </Link>
          <Link href="/exams">
            <Button variant="outline" className="w-full sm:w-auto gap-2 rounded-xl h-12 font-heading font-bold">
              Tüm Sınavlara Dön
            </Button>
          </Link>
          <ShareResultButton />
        </div>
      </div>
    </div>
  );
}
