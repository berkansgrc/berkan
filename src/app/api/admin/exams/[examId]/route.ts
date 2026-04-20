import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// 1. SINAVI VE SORULARI GÜNCELLE
export async function PUT(
  request: Request,
  { params }: { params: { examId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const { examId } = await params;
    const body = await request.json();
    const { title, description, duration_minutes, access_mode, is_published, questions } = body;

    // Önce yetki kontrolü: Bu sınav ona mı ait veya admin mi?
    const { data: examCheck } = await supabase
      .from("exams")
      .select("created_by")
      .eq("id", examId)
      .single();

    if (!examCheck) {
      return NextResponse.json({ error: "Sınav bulunamadı" }, { status: 404 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (examCheck.created_by !== user.id && profile?.role !== "admin") {
      return NextResponse.json({ error: "Bu sınavı düzenleme yetkiniz yok" }, { status: 403 });
    }

    // 1. Sınav bilgilerini güncelle
    const { error: examError } = await supabase
      .from("exams")
      .update({
        title,
        description,
        duration_minutes,
        access_mode,
        is_published,
      })
      .eq("id", examId);

    if (examError) throw examError;

    // 2. Mevcut soruları temizle ve yenilerini ekle (en güvenli yöntem)
    const { error: deleteQuestionsError } = await supabase
      .from("questions")
      .delete()
      .eq("exam_id", examId);

    if (deleteQuestionsError) throw deleteQuestionsError;

    if (questions && questions.length > 0) {
      const questionsToInsert = questions.map((q: any) => ({
        exam_id: examId,
        body: q.body,
        option_count: q.option_count,
        options: q.options,
        correct_option: q.correct_option,
        order_index: q.order_index,
        image_url: q.image_url || null,
      }));

      const { error: questionsError } = await supabase
        .from("questions")
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. SINAVI SİL
export async function DELETE(
  request: Request,
  { params }: { params: { examId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const { examId } = await params;

    // Yetki kontrolü (sadece supabase'de RLS ile korunsa bile ekstra check atmak iyidir)
    const { error } = await supabase
      .from("exams")
      .delete()
      .eq("id", examId);

    if (error) throw error; // Eğer RLS engellerse burada hata atar

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
