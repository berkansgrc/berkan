import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Kullanıcı ve rol kontrolü
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, duration_minutes, access_mode, is_published, questions } = body;

  if (!title || !questions || questions.length === 0) {
    return NextResponse.json({ error: "Başlık ve en az bir soru gereklidir." }, { status: 400 });
  }

  // 9 karakterlik okunabilir bir kod oluştur
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let shareCode = "";
  for (let i = 0; i < 9; i++) {
    shareCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Sınavı oluştur
  const { data: exam, error: examError } = await supabase
    .from("exams")
    .insert({
      title,
      description: description || null,
      duration_minutes: duration_minutes || 40,
      access_mode: access_mode || "public",
      is_published: is_published ?? false,
      created_by: user.id,
      share_code: shareCode,
    })
    .select("id, share_code")
    .single();

  if (examError) {
    return NextResponse.json({ error: examError.message }, { status: 500 });
  }

  // Soruları ekle
  const questionRows = questions.map((q: Record<string, unknown>) => ({
    exam_id: exam.id,
    body: q.body,
    option_count: q.option_count || 4,
    options: q.options,
    correct_option: q.correct_option,
    order_index: q.order_index,
    image_url: q.image_url || null,
    achievement: q.achievement || null,
  }));

  const { error: qError } = await supabase.from("questions").insert(questionRows);

  if (qError) {
    // Sınavı da sil (rollback)
    await supabase.from("exams").delete().eq("id", exam.id);
    return NextResponse.json({ error: qError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, examId: exam.id, shareCode: exam.share_code });
}
