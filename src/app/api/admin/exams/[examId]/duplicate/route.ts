import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "teacher"].includes(profile.role)) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  // Orijinal sınavı çek
  const { data: exam, error: examError } = await adminClient
    .from("exams")
    .select("*")
    .eq("id", examId)
    .single();

  if (examError || !exam) return NextResponse.json({ error: "Sınav bulunamadı" }, { status: 404 });

  // Orijinal soruları çek
  const { data: questions } = await adminClient
    .from("questions")
    .select("*")
    .eq("exam_id", examId)
    .order("order_index");

  // Yeni share code
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let shareCode = "";
  for (let i = 0; i < 9; i++) shareCode += chars.charAt(Math.floor(Math.random() * chars.length));

  // Yeni sınav oluştur
  const { data: newExam, error: createError } = await adminClient
    .from("exams")
    .insert({
      title: `Kopya — ${exam.title}`,
      description: exam.description,
      duration_minutes: exam.duration_minutes,
      access_mode: exam.access_mode,
      is_published: false,
      created_by: user.id,
      share_code: shareCode,
    })
    .select("id")
    .single();

  if (createError || !newExam) return NextResponse.json({ error: createError?.message }, { status: 500 });

  // Soruları kopyala
  if (questions && questions.length > 0) {
    const newQuestions = questions.map(({ id: _id, exam_id: _eid, ...rest }) => ({
      ...rest,
      exam_id: newExam.id,
    }));
    const { error: qError } = await adminClient.from("questions").insert(newQuestions);
    if (qError) {
      await adminClient.from("exams").delete().eq("id", newExam.id);
      return NextResponse.json({ error: qError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, newExamId: newExam.id });
}
