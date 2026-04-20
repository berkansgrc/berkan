import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import ExamEngine from "@/components/exam/ExamEngine";

type Props = {
  params: Promise<{ examId: string }>;
};

export default async function TakeExamPage({ params }: Props) {
  const { examId } = await params;
  const supabase = await createClient();

  // Sınavı getir
  const { data: exam } = await supabase
    .from("exams")
    .select("id, title, duration_minutes, access_mode, is_published")
    .eq("id", examId)
    .single();

  if (!exam || !exam.is_published) return notFound();

  // Private sınavlar için giriş zorunlu
  if (exam.access_mode === "private") {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect(`/login?message=${encodeURIComponent("Bu sınava giriş yaparak erişebilirsiniz.")}`);
  }

  // Soruları getir
  const { data: questions } = await supabase
    .from("questions")
    .select("id, body, options, option_count, order_index, image_url")
    .eq("exam_id", examId)
    .order("order_index");

  if (!questions || questions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Bu sınavda henüz soru bulunmuyor.</p>
      </div>
    );
  }

  // Sonuç kaydını önceden oluştur (misafir de dahil)
  const { data: { user } } = await supabase.auth.getUser();
  const { data: result } = await supabase
    .from("exam_results")
    .insert({
      exam_id: examId,
      user_id: user?.id ?? null,
      answers: {},
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (!result) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-destructive">Sınav başlatılamadı. Lütfen tekrar deneyin.</p>
      </div>
    );
  }

  return (
    <ExamEngine
      exam={exam}
      questions={questions}
      resultId={result.id}
      storageKey={`exam-${examId}-answers`}
    />
  );
}
