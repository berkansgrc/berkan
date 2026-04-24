import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 60;

interface Notification {
  id: string;
  type: "new_user" | "exam_entry" | "live_status";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export async function GET() {
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
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

  const now = new Date();
  const last48h = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();

  const notifications: Notification[] = [];

  // 1. Yeni kullanıcı kayıtları (son 48 saat)
  const { data: newUsers } = await supabase
    .from("profiles")
    .select("id, full_name, created_at")
    .gte("created_at", last48h)
    .order("created_at", { ascending: false })
    .limit(10);

  if (newUsers) {
    for (const u of newUsers) {
      notifications.push({
        id: `user-${u.id}`,
        type: "new_user",
        title: "Yeni Öğrenci Kaydı",
        description: u.full_name || "İsimsiz Kullanıcı",
        timestamp: u.created_at,
        read: false,
      });
    }
  }

  // 2. Yeni sınav girişleri (son 48 saat)
  const { data: recentResults } = await supabase
    .from("exam_results")
    .select("id, exam_id, submitted_at, exams(title)")
    .gte("submitted_at", last48h)
    .not("submitted_at", "is", null)
    .order("submitted_at", { ascending: false })
    .limit(10);

  if (recentResults) {
    // Group by exam
    const examGroups: Record<string, { title: string; count: number; latestAt: string }> = {};
    for (const r of recentResults) {
      const examTitle =
        (r as unknown as { exams: { title: string } | null }).exams?.title || "Bilinmeyen Sınav";
      if (!examGroups[r.exam_id]) {
        examGroups[r.exam_id] = {
          title: examTitle,
          count: 0,
          latestAt: r.submitted_at!,
        };
      }
      examGroups[r.exam_id].count++;
    }

    for (const [examId, group] of Object.entries(examGroups)) {
      notifications.push({
        id: `exam-${examId}`,
        type: "exam_entry",
        title: `${group.count} Yeni Sınav Girişi`,
        description: group.title,
        timestamp: group.latestAt,
        read: false,
      });
    }
  }

  // 3. Canlı ders durumu
  const { data: liveConfig } = await supabase
    .from("live_stream_config")
    .select("is_live, lesson_title, updated_at")
    .single();

  if (liveConfig) {
    notifications.push({
      id: "live-status",
      type: "live_status",
      title: liveConfig.is_live ? "Canlı Yayın Aktif" : "Yayın Kapalı",
      description: liveConfig.lesson_title || "Durum bilgisi",
      timestamp: liveConfig.updated_at || now.toISOString(),
      read: !liveConfig.is_live, // Aktif yayın okunmamış sayılır
    });
  }

  // Sort by timestamp descending
  notifications.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return NextResponse.json({
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
  });
}
