import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET    — Kullanıcının bildirimlerini döner (son 20, okunmamışlar önce)
 * PATCH  — Bildirim(leri) okundu yap
 * DELETE — Tüm bildirimlerini sil
 */

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("in_app_notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("is_read", { ascending: true })       // okunmamışlar önce
    .order("created_at", { ascending: false })
    .limit(20);

  const unreadCount = (data ?? []).filter((n: { is_read: boolean }) => !n.is_read).length;

  return NextResponse.json({ notifications: data ?? [], unreadCount });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, markAllRead } = await req.json();

  if (markAllRead) {
    await supabase
      .from("in_app_notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
  } else if (id) {
    await supabase
      .from("in_app_notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", user.id);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await supabase
    .from("in_app_notifications")
    .delete()
    .eq("user_id", user.id)
    .eq("is_read", true); // Sadece okunmuşları sil

  return NextResponse.json({ success: true });
}
