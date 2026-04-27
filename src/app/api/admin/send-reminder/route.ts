import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST — Tüm opt-in öğrencilere in-app hatırlatma bildirimi gönderir
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { lessonTitle, scheduledAt, message } = await req.json();

  // Opt-in kullanıcıları çek
  const { data: reminders } = await supabase
    .from("lesson_reminders")
    .select("user_id")
    .eq("reminder_enabled", true);

  if (!reminders || reminders.length === 0) {
    return NextResponse.json({ sent: 0, message: "Hatırlatıcı açık kullanıcı bulunamadı." });
  }

  const admin = createAdminClient();

  // Bildirim içeriği
  const title = `📚 Ders Hatırlatıcısı: ${lessonTitle || "Canlı Ders"}`;
  const body = message || (scheduledAt
    ? `Ders ${new Date(scheduledAt).toLocaleString("tr-TR", { hour: "2-digit", minute: "2-digit" })} saatinde başlıyor.`
    : "Canlı ders yakında başlıyor! Kaçırmamak için hemen katıl.");

  const notifications = reminders.map((r: { user_id: string }) => ({
    user_id: r.user_id,
    type: "lesson_reminder",
    title,
    body,
    is_read: false,
    action_url: "/dashboard/canli-ders",
  }));

  const { error, data: insertedData } = await admin
    .from("in_app_notifications")
    .insert(notifications)
    .select("id");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ sent: insertedData?.length ?? notifications.length });
}
