import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/admin/live-polls/results
 * Her anket sorusu için oy dağılımını döndürür.
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();

  // Auth
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

  // Tüm anketleri son 7 güne göre çek
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: questions } = await supabase
    .from("live_questions")
    .select("id, body, options, created_at")
    .gte("created_at", sevenDaysAgo)
    .order("created_at", { ascending: false });

  if (!questions || questions.length === 0) {
    return NextResponse.json({ polls: [] });
  }

  // Her soru için oyları çek
  const pollResults = await Promise.all(
    questions.map(async (q) => {
      const { data: votes } = await supabase
        .from("live_votes")
        .select("selected_option")
        .eq("question_id", q.id);

      const options = (q.options as string[]) || [];
      const distribution: Record<string, number> = {};
      options.forEach((opt) => {
        distribution[opt] = 0;
      });

      (votes || []).forEach((v) => {
        const opt = v.selected_option;
        if (distribution[opt] !== undefined) {
          distribution[opt]++;
        }
      });

      const totalVotes = votes?.length || 0;

      return {
        id: q.id,
        body: q.body,
        createdAt: q.created_at,
        options,
        totalVotes,
        distribution,
      };
    })
  );

  return NextResponse.json({ polls: pollResults });
}
