import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { redirect, notFound } from "next/navigation";
import ExamEngine from "@/components/exam/ExamEngine";

type Props = {
  params: Promise<{ examId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function TakeExamPage({ params, searchParams }: Props) {
  const { examId } = await params;
  const { access_code } = await searchParams;
  
  const supabase = await createClient();

  // Sınavı getir
  const { data: exam } = await supabase
    .from("exams")
    .select("id, title, duration_minutes, access_mode, is_published, share_code")
    .eq("id", examId)
    .single();

  if (!exam || !exam.is_published) return notFound();

  const { data: { user } } = await supabase.auth.getUser();

  // access_code string veya string[] olabilir, normalize et
  const codeParam = Array.isArray(access_code) ? access_code[0] : access_code;
  const normalizedCode = codeParam?.toUpperCase() ?? "";
  const normalizedShareCode = exam.share_code?.toUpperCase() ?? "";

  // Kullanıcı giriş yapmamışsa, doğru access_code'a sahip olması ŞARTTIR.
  if (!user) {
    // Eğer private ise ve kod da yoksa/yanlışsa login'e atalım
    if (exam.access_mode === "private" && (!normalizedCode || normalizedCode !== normalizedShareCode)) {
      redirect(`/login?message=${encodeURIComponent("Bu sınava giriş yaparak erişebilirsiniz.")}`);
    }
    // Eğer public ise ama kod yoksa/yanlışsa detay sayfasına atıp kodu girmesini isteyelim
    if (exam.access_mode === "public" && (!normalizedCode || normalizedCode !== normalizedShareCode)) {
      redirect(`/exams/${examId}`);
    }
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
  // Admin client kullanıyoruz çünkü misafir kullanıcılarda user_id=null olur
  // ve RLS SELECT politikası NULL=NULL karşılaştırmasını geçemez
  const adminClient = createAdminClient();
  const { data: result } = await adminClient
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
