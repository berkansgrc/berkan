import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import QuizManager, { QuizQuestion } from "./QuizManager";

export const metadata = {
  title: "Mini Test Soruları - Berkan Matematik",
};

export default async function AdminContentQuizPage({
  params,
}: {
  params: Promise<{ contentId: string }>;
}) {
  const { contentId } = await params;
  const supabase = await createClient();

  // Yetki kontrolü (sadece adminler)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return notFound();
  }

  // Content bilgilerini çek
  const { data: content, error: contentError } = await supabase
    .from("contents")
    .select("id, title")
    .eq("id", contentId)
    .single();

  if (contentError || !content) {
    console.error("Content not found:", contentError);
    return notFound();
  }

  // Quiz sorularını çek
  const { data: questions, error: questionsError } = await supabase
    .from("content_quizzes")
    .select("*")
    .eq("content_id", contentId)
    .order("sort_order", { ascending: true });

  if (questionsError) {
    console.error("Quiz questions error:", questionsError);
  }

  return (
    <div className="w-full">
      <QuizManager 
        contentId={content.id} 
        contentTitle={content.title} 
        questions={(questions as QuizQuestion[]) || []} 
      />
    </div>
  );
}
