import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET  ?lessonId=xxx  — Admin: o derse katılan öğrencileri listele
 * POST               — Öğrenci derse katıldı kaydını oluştur
 * PATCH              — Öğrenci ayrıldı (left_at güncelle)
 */

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get("lessonId");

  let query = supabase
    .from("live_attendance")
    .select("id, user_id, lesson_id, joined_at, left_at, profiles(full_name)")
    .order("joined_at", { ascending: false });

  if (lessonId) {
    query = query.eq("lesson_id", lessonId);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Unique lesson IDs for history panel
  if (!lessonId) {
    const lessonIds = [...new Set((data ?? []).map((r: { lesson_id: string }) => r.lesson_id))];
    return NextResponse.json({ lessonIds, attendance: data ?? [] });
  }

  // Stats for specific lesson
  const records = data ?? [];
  const uniqueUsers = new Set(records.map((r: { user_id: string }) => r.user_id)).size;
  const durations = records
    .filter((r: { left_at: string | null }) => r.left_at)
    .map((r: { joined_at: string; left_at: string }) =>
      (new Date(r.left_at).getTime() - new Date(r.joined_at).getTime()) / 1000
    );
  const avgDurationSeconds = durations.length
    ? Math.round(durations.reduce((a: number, b: number) => a + b, 0) / durations.length)
    : 0;

  return NextResponse.json({
    attendance: records,
    stats: {
      totalParticipants: uniqueUsers,
      avgDurationSeconds,
      avgDurationFormatted: formatDuration(avgDurationSeconds),
    },
  });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lessonId } = await req.json();
  if (!lessonId) return NextResponse.json({ error: "lessonId gerekli" }, { status: 400 });

  // Aynı derse zaten aktif kayıt varsa yenisini oluşturma
  const { data: existing } = await supabase
    .from("live_attendance")
    .select("id")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .is("left_at", null)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ attendanceId: existing.id, alreadyActive: true });
  }

  const { data, error } = await supabase
    .from("live_attendance")
    .insert({ user_id: user.id, lesson_id: lessonId })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ attendanceId: data.id });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { attendanceId } = await req.json();
  if (!attendanceId) return NextResponse.json({ error: "attendanceId gerekli" }, { status: 400 });

  const { error } = await supabase
    .from("live_attendance")
    .update({ left_at: new Date().toISOString() })
    .eq("id", attendanceId)
    .eq("user_id", user.id); // Sadece kendi kaydını güncelleyebilir

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}sn`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return `${mins}dk ${secs}sn`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}sa ${remainMins}dk`;
}
