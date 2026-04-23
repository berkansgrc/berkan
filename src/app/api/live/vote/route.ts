import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

// POST: Öğrenci anket oyu verir
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });

  const body = await request.json();
  const { pollId, selectedOption } = body;

  if (!pollId || !selectedOption) {
    return NextResponse.json({ error: "Eksik parametreler." }, { status: 400 });
  }

  const admin = createAdminClient();

  // Anketin aktif olduğunu kontrol et
  const { data: poll } = await admin.from("live_polls").select("is_active").eq("id", pollId).single();
  if (!poll?.is_active) {
    return NextResponse.json({ error: "Bu anket artık aktif değil." }, { status: 400 });
  }

  // Daha önce oy vermiş mi?
  const { data: existing } = await admin
    .from("live_poll_votes")
    .select("id")
    .eq("poll_id", pollId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Bu ankete zaten oy verdiniz." }, { status: 409 });
  }

  const { error } = await admin.from("live_poll_votes").insert({
    poll_id: pollId,
    user_id: user.id,
    selected_option: selectedOption,
  });

  if (error) {
    console.error("Vote error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
