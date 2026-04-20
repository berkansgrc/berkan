import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const { resultId, answers } = await req.json();

  if (!resultId || !answers) {
    return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
  }

  const supabase = await createClient();

  // Sadece cevapları güncelle (heartbeat / ara kayıt)
  const { error } = await supabase
    .from("exam_results")
    .update({
      answers,
      // submitted_at güncellemiyoruz çünkü henüz bitmedi
    })
    .eq("id", resultId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
