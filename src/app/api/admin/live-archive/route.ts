import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET  — Arşivlenmiş dersleri listele
 * POST — Mevcut yayını arşivle
 * DELETE — Arşivden kaldır
 */
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("live_archive")
    .select("*")
    .order("archived_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ archives: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const {
    title,
    description,
    youtube_video_id,
    level,
    topic_tags,
    duration_minutes,
    participant_count,
  } = body;

  if (!title || !youtube_video_id) {
    return NextResponse.json(
      { error: "Başlık ve YouTube Video ID zorunludur." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("live_archive")
    .insert({
      title,
      description: description || null,
      youtube_video_id,
      level: level || null,
      topic_tags: topic_tags || [],
      duration_minutes: duration_minutes || null,
      participant_count: participant_count || 0,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Archive insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, archiveId: data.id });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("live_archive").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
