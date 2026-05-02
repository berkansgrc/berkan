import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const { examId } = await params;
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Orijinal sınavı al
    const { data: originalExam, error: examError } = await supabase
      .from("exams")
      .select("*")
      .eq("id", examId)
      .single();

    if (examError || !originalExam) {
      return NextResponse.json({ error: "Sınav bulunamadı." }, { status: 404 });
    }

    // Soruları al
    const { data: originalQuestions, error: questionsError } = await supabase
      .from("questions")
      .select("*")
      .eq("exam_id", examId);

    if (questionsError) {
      return NextResponse.json({ error: "Sorular alınamadı." }, { status: 500 });
    }

    // Yeni sınavı oluştur (is_published: false ve Kopya başlığı)
    const newExamData = {
      title: `Kopya — ${originalExam.title}`,
      description: originalExam.description,
      duration_minutes: originalExam.duration_minutes,
      access_mode: originalExam.access_mode,
      is_published: false,
      share_code: null, // yeni sınavın kendine ait share_code'u olabilir veya null olabilir
    };

    const { data: newExam, error: insertExamError } = await supabase
      .from("exams")
      .insert(newExamData)
      .select("id")
      .single();

    if (insertExamError || !newExam) {
      return NextResponse.json({ error: "Yeni sınav oluşturulamadı." }, { status: 500 });
    }

    // Yeni soruları oluştur
    if (originalQuestions && originalQuestions.length > 0) {
      const newQuestionsData = originalQuestions.map(q => ({
        exam_id: newExam.id,
        body: q.body,
        option_count: q.option_count,
        options: q.options,
        correct_option: q.correct_option,
        order_index: q.order_index,
        image_url: q.image_url,
        achievement: q.achievement,
        ...(q.difficulty ? { difficulty: q.difficulty } : {}),
      }));

      const { error: insertQuestionsError } = await supabase
        .from("questions")
        .insert(newQuestionsData);

      if (insertQuestionsError) {
        // Geri alma işlemi yapılabilir (Opsiyonel)
        await supabase.from("exams").delete().eq("id", newExam.id);
        return NextResponse.json({ error: "Sorular kopyalanamadı." }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, newExamId: newExam.id });

  } catch (error) {
    console.error("Duplicate exam error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
