import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { checkRateLimit, getClientIP } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  // ─── Rate Limit: 1 dakikada en fazla 3 sınav gönderimi ───
  const ip = getClientIP(req);
  const rateCheck = await checkRateLimit(ip, "exam_submit", {
    maxRequests: 3,
    windowMs: 60_000, // 1 dakika
  });

  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: "Çok fazla istek gönderdiniz. Lütfen biraz bekleyin.",
        retryAfter: Math.ceil((rateCheck.resetAt.getTime() - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateCheck.resetAt.getTime() - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const { resultId, answers, examId } = await req.json();

  if (!resultId || !examId) {
    return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Sınav sorularını ve doğru cevapları al
  const { data: questions } = await supabase
    .from("questions")
    .select("id, correct_option, order_index")
    .eq("exam_id", examId);

  if (!questions) {
    return NextResponse.json({ error: "Sorular bulunamadı" }, { status: 404 });
  }

  let correct = 0;
  let wrong = 0;
  let blank = 0;

  for (const q of questions) {
    const given = answers[q.id];
    if (!given) {
      blank++;
    } else if (given === q.correct_option) {
      correct++;
    } else {
      wrong++;
    }
  }

  // Net hesabı (YGS/TYT formatı: her 4 yanlış 1 doğruyu götürür)
  const score = Math.max(0, correct - wrong / 4);

  // Sonucu güncelle
  const { error } = await supabase
    .from("exam_results")
    .update({
      answers,
      correct,
      wrong,
      blank,
      score,
      submitted_at: new Date().toISOString(),
    })
    .eq("id", resultId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, correct, wrong, blank, score });
}
