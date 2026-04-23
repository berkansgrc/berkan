import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

// POST: Yeni soru gönder
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });

  const body = await request.json();
  const { question } = body;

  if (!question || question.trim().length < 3) {
    return NextResponse.json({ error: "Soru en az 3 karakter olmalı." }, { status: 400 });
  }

  // Kullanıcı adını al
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("live_questions")
    .insert({
      user_id: user.id,
      user_name: profile?.full_name || "Öğrenci",
      question: question.trim(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Question insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, questionId: data.id });
}

// PATCH: Upvote veya "cevaplandı" işaretle
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });

  const body = await request.json();
  const { questionId, action } = body;
  const admin = createAdminClient();

  if (action === "upvote") {
    // Daha önce oy vermiş mi?
    const { data: existing } = await admin
      .from("live_question_upvotes")
      .select("id")
      .eq("question_id", questionId)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      // Geri al
      await admin.from("live_question_upvotes").delete().eq("id", existing.id);
      const { error: rpcError } = await admin.rpc("decrement_upvote", { q_id: questionId });
      if (rpcError) {
        // Fallback: Manuel güncelle
        const { data } = await admin.from("live_questions").select("upvotes").eq("id", questionId).single();
        if (data) {
          await admin.from("live_questions").update({ upvotes: Math.max(0, (data.upvotes || 1) - 1) }).eq("id", questionId);
        }
      }
      return NextResponse.json({ success: true, action: "removed" });
    }

    await admin.from("live_question_upvotes").insert({
      question_id: questionId,
      user_id: user.id,
    });

    // upvotes sayacını artır
    const { data: q } = await admin.from("live_questions").select("upvotes").eq("id", questionId).single();
    await admin.from("live_questions").update({ upvotes: (q?.upvotes || 0) + 1 }).eq("id", questionId);

    return NextResponse.json({ success: true, action: "added" });
  }

  if (action === "answer") {
    // Sadece admin/teacher
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (!profile || !["admin", "teacher"].includes(profile.role)) {
      return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
    }

    await admin.from("live_questions").update({ is_answered: true }).eq("id", questionId);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

// DELETE: Tüm soruları temizle (admin)
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "teacher"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  await admin.from("live_questions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  return NextResponse.json({ success: true });
}
