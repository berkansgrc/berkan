import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ExamCreateForm, { ExamDraft } from "@/components/admin/ExamCreateForm";

export const metadata = {
  title: "Sınav Düzenle | Admin | Berkan Matematik",
};

export default async function ExamEditPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  // 1. Sınav detaylarını getir
  const { data: exam, error: examError } = await supabase
    .from("exams")
    .select("*")
    .eq("id", examId)
    .single();

  if (examError || !exam) {
    return notFound();
  }

  // 2. Yetki kontrolü
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (exam.created_by !== user.id && profile?.role !== "admin") {
    return (
      <div className="container py-20 text-center">
        <p className="text-xl font-medium text-destructive">
          Bu sınavı düzenleme yetkiniz yok.
        </p>
      </div>
    );
  }

  // 3. Soruları getir
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("exam_id", examId)
    .order("order_index", { ascending: true });

  const typedQuestions = (questions || []).map((q) => ({
    id: q.id,
    body: q.body,
    optionCount: q.option_count,
    options: q.options as { label: string; text: string }[],
    correctOption: q.correct_option,
    imageUrl: q.image_url || "",
    achievement: (q as Record<string, unknown>).achievement as string || "",
    difficulty: (((q as Record<string, unknown>).difficulty as string) || "medium") as "easy" | "medium" | "hard",
  }));

  const initialData: ExamDraft = {
    id: exam.id,
    title: exam.title,
    description: exam.description || "",
    duration_minutes: exam.duration_minutes,
    access_mode: exam.access_mode,
    is_published: exam.is_published,
    questions: typedQuestions,
  };

  return <ExamCreateForm initialData={initialData} />;
}
