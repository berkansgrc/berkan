import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 60;

/**
 * Analytics API — Admin sınav başarı analizleri
 * 
 * GET /api/admin/analytics?type=exam-overview     → Tüm sınavların özet istatistikleri
 * GET /api/admin/analytics?type=exam-detail&examId=xxx → Tek sınav detay analizi
 * GET /api/admin/analytics?type=achievement-heatmap    → Kazanım bazlı ısı haritası verisi
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();

  // Auth & role check
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

  const type = req.nextUrl.searchParams.get("type") || "exam-overview";

  // ─── Exam Overview ───
  if (type === "exam-overview") {
    const { data: exams } = await supabase
      .from("exams")
      .select("id, title, duration_minutes, is_published, created_at")
      .order("created_at", { ascending: false });

    if (!exams) {
      return NextResponse.json({ exams: [] });
    }

    // Her sınav için toplam sonuç verilerini çek
    const examStats = await Promise.all(
      exams.map(async (exam) => {
        const { data: results } = await supabase
          .from("exam_results")
          .select("correct, wrong, blank, score")
          .eq("exam_id", exam.id)
          .not("submitted_at", "is", null);

        const participants = results?.length || 0;
        const avgScore = participants > 0
          ? results!.reduce((sum, r) => sum + (r.score || 0), 0) / participants
          : 0;
        const avgCorrect = participants > 0
          ? results!.reduce((sum, r) => sum + (r.correct || 0), 0) / participants
          : 0;
        const avgWrong = participants > 0
          ? results!.reduce((sum, r) => sum + (r.wrong || 0), 0) / participants
          : 0;
        const maxScore = participants > 0
          ? Math.max(...results!.map((r) => r.score || 0))
          : 0;
        const minScore = participants > 0
          ? Math.min(...results!.map((r) => r.score || 0))
          : 0;

        return {
          id: exam.id,
          title: exam.title,
          durationMinutes: exam.duration_minutes,
          isPublished: exam.is_published,
          createdAt: exam.created_at,
          participants,
          avgScore: Number(avgScore.toFixed(2)),
          avgCorrect: Number(avgCorrect.toFixed(1)),
          avgWrong: Number(avgWrong.toFixed(1)),
          maxScore: Number(maxScore.toFixed(2)),
          minScore: Number(minScore.toFixed(2)),
        };
      })
    );

    // Genel toplam istatistikler
    const totalParticipants = examStats.reduce((sum, e) => sum + e.participants, 0);
    const globalAvgScore = totalParticipants > 0
      ? examStats.reduce((sum, e) => sum + e.avgScore * e.participants, 0) / totalParticipants
      : 0;
    const bestExam = examStats.length > 0
      ? examStats.reduce((best, e) => (e.avgScore > best.avgScore ? e : best), examStats[0])
      : null;

    return NextResponse.json({
      summary: {
        totalExams: exams.length,
        totalParticipants,
        globalAvgScore: Number(globalAvgScore.toFixed(2)),
        bestExamTitle: bestExam?.title || null,
        bestExamAvgScore: bestExam?.avgScore || 0,
      },
      exams: examStats,
    });
  }

  // ─── Exam Detail ───
  if (type === "exam-detail") {
    const examId = req.nextUrl.searchParams.get("examId");
    if (!examId) {
      return NextResponse.json({ error: "examId required" }, { status: 400 });
    }

    // Soru bilgilerini çek
    const { data: questions } = await supabase
      .from("questions")
      .select("id, body, correct_option, order_index, achievement")
      .eq("exam_id", examId)
      .order("order_index", { ascending: true });

    // Sonuçları çek
    const { data: results } = await supabase
      .from("exam_results")
      .select("answers, correct, wrong, blank, score")
      .eq("exam_id", examId)
      .not("submitted_at", "is", null);

    if (!questions) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    // Soru bazlı yanlış oranı hesapla
    const questionStats = questions.map((q) => {
      let correctCount = 0;
      let wrongCount = 0;
      let blankCount = 0;

      (results || []).forEach((r) => {
        const answers = r.answers as Record<string, string> | null;
        if (!answers || !answers[q.id]) {
          blankCount++;
        } else if (answers[q.id] === q.correct_option) {
          correctCount++;
        } else {
          wrongCount++;
        }
      });

      const total = correctCount + wrongCount + blankCount;
      return {
        id: q.id,
        orderIndex: q.order_index,
        body: q.body,
        correctOption: q.correct_option,
        achievement: q.achievement,
        correctCount,
        wrongCount,
        blankCount,
        total,
        correctRate: total > 0 ? Number(((correctCount / total) * 100).toFixed(1)) : 0,
        wrongRate: total > 0 ? Number(((wrongCount / total) * 100).toFixed(1)) : 0,
      };
    });

    // En zorlanılan 5 soru
    const hardestQuestions = [...questionStats]
      .sort((a, b) => b.wrongRate - a.wrongRate)
      .slice(0, 5);

    // Kazanım bazlı başarı
    const achievementMap: Record<string, { correct: number; total: number }> = {};
    questionStats.forEach((q) => {
      if (q.achievement) {
        if (!achievementMap[q.achievement]) {
          achievementMap[q.achievement] = { correct: 0, total: 0 };
        }
        achievementMap[q.achievement].correct += q.correctCount;
        achievementMap[q.achievement].total += q.total;
      }
    });

    const achievementStats = Object.entries(achievementMap)
      .map(([name, { correct, total }]) => ({
        name,
        correctRate: total > 0 ? Number(((correct / total) * 100).toFixed(1)) : 0,
        total,
      }))
      .sort((a, b) => a.correctRate - b.correctRate); // En düşük başarı üste

    return NextResponse.json({
      questionStats,
      hardestQuestions,
      achievementStats,
      totalParticipants: results?.length || 0,
    });
  }

  // ─── Achievement Heatmap ───
  if (type === "achievement-heatmap") {
    // Tüm sınavlardaki tüm soruların kazanımlarını çek
    const { data: exams } = await supabase
      .from("exams")
      .select("id, title")
      .eq("is_published", true)
      .order("created_at", { ascending: true });

    if (!exams || exams.length === 0) {
      return NextResponse.json({ heatmap: [], exams: [], achievements: [] });
    }

    // Her sınav için soru ve sonuç verilerini çek
    const heatmapData: {
      achievement: string;
      examId: string;
      examTitle: string;
      correctRate: number;
      participantCount: number;
    }[] = [];

    const allAchievements = new Set<string>();

    for (const exam of exams) {
      const { data: questions } = await supabase
        .from("questions")
        .select("id, correct_option, achievement")
        .eq("exam_id", exam.id);

      const { data: results } = await supabase
        .from("exam_results")
        .select("answers")
        .eq("exam_id", exam.id)
        .not("submitted_at", "is", null);

      if (!questions || !results) continue;

      // Kazanım bazlı grupla
      const achMap: Record<string, { correct: number; total: number }> = {};

      for (const q of questions) {
        if (!q.achievement) continue;
        allAchievements.add(q.achievement);

        if (!achMap[q.achievement]) {
          achMap[q.achievement] = { correct: 0, total: 0 };
        }

        for (const r of results) {
          const answers = r.answers as Record<string, string> | null;
          achMap[q.achievement].total++;
          if (answers && answers[q.id] === q.correct_option) {
            achMap[q.achievement].correct++;
          }
        }
      }

      for (const [ach, stats] of Object.entries(achMap)) {
        heatmapData.push({
          achievement: ach,
          examId: exam.id,
          examTitle: exam.title,
          correctRate: stats.total > 0
            ? Number(((stats.correct / stats.total) * 100).toFixed(1))
            : 0,
          participantCount: results.length,
        });
      }
    }

    return NextResponse.json({
      heatmap: heatmapData,
      exams: exams.map((e) => ({ id: e.id, title: e.title })),
      achievements: [...allAchievements].sort(),
    });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
