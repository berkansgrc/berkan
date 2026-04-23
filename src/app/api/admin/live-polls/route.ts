import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

// POST: Yeni anket oluştur
// PATCH: Anketi aktif/pasif yap veya sil
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "teacher"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { question, options } = body;

  if (!question || !options || options.length < 2) {
    return NextResponse.json({ error: "Soru ve en az 2 şık gerekli." }, { status: 400 });
  }

  const admin = createAdminClient();

  // Önce tüm aktif anketleri kapat
  await admin.from("live_polls").update({ is_active: false }).eq("is_active", true);

  const { data, error } = await admin
    .from("live_polls")
    .insert({
      question,
      options,
      is_active: true,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Poll create error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, pollId: data.id });
}

// PATCH: Toggle aktif/pasif veya sil
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "teacher"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { pollId, action } = body;

  const admin = createAdminClient();

  if (action === "toggle") {
    const { data: poll } = await admin.from("live_polls").select("is_active").eq("id", pollId).single();
    if (!poll) return NextResponse.json({ error: "Anket bulunamadı." }, { status: 404 });

    // Aktif yapacaksak diğerlerini kapat
    if (!poll.is_active) {
      await admin.from("live_polls").update({ is_active: false }).eq("is_active", true);
    }

    await admin.from("live_polls").update({ is_active: !poll.is_active }).eq("id", pollId);
    return NextResponse.json({ success: true, is_active: !poll.is_active });
  }

  if (action === "delete") {
    await admin.from("live_polls").delete().eq("id", pollId);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
