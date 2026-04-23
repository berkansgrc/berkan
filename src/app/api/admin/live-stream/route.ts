import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();

  const { data: existing } = await supabase.from("live_stream_config").select("id").single();

  const adminClient = getAdminClient();
  let result;
  if (existing?.id) {
    result = await adminClient
      .from("live_stream_config")
      .update({
        youtube_video_id: body.youtube_video_id || null,
        youtube_chat_id: body.youtube_chat_id || null,
        is_live: body.is_live ?? false,
        lesson_title: body.lesson_title || null,
        lesson_description: body.lesson_description || null,
        scheduled_at: body.scheduled_at || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    result = await adminClient.from("live_stream_config").insert({
      youtube_video_id: body.youtube_video_id || null,
      youtube_chat_id: body.youtube_chat_id || null,
      is_live: body.is_live ?? false,
      lesson_title: body.lesson_title || null,
      lesson_description: body.lesson_description || null,
      scheduled_at: body.scheduled_at || null,
    });
  }

  if (result.error) {
    console.error("Live stream config error:", result.error);
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  // Yayın kapatıldığında tüm canlı etkileşim verilerini temizle
  if (body.is_live === false) {
    await Promise.all([
      adminClient.from("live_poll_votes").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      adminClient.from("live_question_upvotes").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    ]);
    // Cascade silinecekler temizlendikten sonra ana tabloları sil
    await Promise.all([
      adminClient.from("live_polls").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      adminClient.from("live_questions").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    ]);
  }

  return NextResponse.json({ success: true });
}
