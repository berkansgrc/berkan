import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET  — Kullanıcının hatırlatıcı tercihini döner
 * POST — Tercihi oluşturur veya günceller (upsert)
 */

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("lesson_reminders")
    .select("reminder_enabled, remind_before_minutes")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({
    reminder_enabled: data?.reminder_enabled ?? false,
    remind_before_minutes: data?.remind_before_minutes ?? 30,
  });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reminder_enabled, remind_before_minutes } = await req.json();

  const { error } = await supabase
    .from("lesson_reminders")
    .upsert(
      {
        user_id: user.id,
        reminder_enabled: reminder_enabled ?? true,
        remind_before_minutes: remind_before_minutes ?? 30,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
