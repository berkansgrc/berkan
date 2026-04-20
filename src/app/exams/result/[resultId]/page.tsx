import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, MinusCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import DownloadPDFButton from "@/components/exam/DownloadPDFButton";

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

  // Soruları ve cevapları getir
  const { data: questions } = await supabase
    .from("questions")
    .select("id, body, correct_option, order_index")
    .eq("exam_id", exam?.id ?? "")
    .order("order_index");

  const answers = (result.answers ?? {}) as Record<string, string>;
  const studentName = profile?.full_name ?? result.guest_name ?? "Misafir";
  const date = new Date(result.submitted_at).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const pdfQuestions = (questions ?? []).map((q) => ({
    orderIndex: q.order_index,
    body: q.body,
    selectedOption: answers[q.id] ?? null,
    correctOption: q.correct_option,
    isCorrect: answers[q.id] === q.correct_option,
  }));

  const stats = [
    { label: "Doğru", value: result.correct ?? 0, icon: CheckCircle, color: "text-green-600 bg-green-50 border-green-200" },
    { label: "Yanlış", value: result.wrong ?? 0, icon: XCircle, color: "text-red-600 bg-red-50 border-red-200" },
    { label: "Boş", value: result.blank ?? 0, icon: MinusCircle, color: "text-slate-500 bg-slate-50 border-slate-200" },
    { label: "Net", value: Number(result.score ?? 0).toFixed(2), icon: Award, color: "text-primary bg-primary/5 border-primary/20" },
  ];

  return (
    <div className="min-h-screen bg-muted/20 py-10">
      <div className="container max-w-3xl mx-auto px-4 space-y-8">
        {/* Başlık */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-2">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Sınav Tamamlandı!</h1>
          <p className="text-muted-foreground">
            <span className="font-medium">{studentName}</span> · {exam?.title}
          </p>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`rounded-2xl border-2 p-5 text-center space-y-2 ${color}`}>
              <Icon className="h-6 w-6 mx-auto" />
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>

        {/* Soru Analizi */}
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-muted/30">
            <h2 className="font-semibold">Soru Analizi</h2>
          </div>
          <div className="divide-y">
            {pdfQuestions.map((q) => (
              <div key={q.orderIndex} className="flex items-start gap-4 px-6 py-4">
                <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold bg-muted">
                  {q.orderIndex}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">{q.body}</p>
                  <div className="flex gap-4 mt-1 text-xs">
                    <span>
                      Cevabın:{" "}
                      <strong className={q.selectedOption ? "" : "text-muted-foreground"}>
                        {q.selectedOption ?? "Boş"}
                      </strong>
                    </span>
                    <span>
                      Doğru: <strong className="text-green-600">{q.correctOption}</strong>
                    </span>
                  </div>
                </div>
                {q.isCorrect ? (
                  <CheckCircle className="shrink-0 h-5 w-5 text-green-600" />
                ) : q.selectedOption ? (
                  <XCircle className="shrink-0 h-5 w-5 text-red-500" />
                ) : (
                  <MinusCircle className="shrink-0 h-5 w-5 text-slate-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <DownloadPDFButton
            studentName={studentName}
            examTitle={exam?.title ?? "Sınav"}
            date={date}
            durationMinutes={exam?.duration_minutes ?? 0}
            correct={result.correct ?? 0}
            wrong={result.wrong ?? 0}
            blank={result.blank ?? 0}
            score={Number(result.score ?? 0)}
            questions={pdfQuestions}
          />
          <Link href="/exams">
            <Button variant="outline">Tüm Sınavlara Dön</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
