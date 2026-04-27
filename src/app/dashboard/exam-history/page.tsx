import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCachedUser } from "@/utils/supabase/queries";
import { ArrowLeft, CheckCircle2, XCircle, MinusCircle, Trophy } from "lucide-react";

export const metadata = {
  title: "Sınav Geçmişim | Berkan Matematik",
  description: "Tüm sınav sonuçlarınızı inceleyin ve performansınızı takip edin.",
};

export const revalidate = 30;

export default async function ExamHistoryPage() {
  const user = await getCachedUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  const { data: results } = await supabase
    .from("exam_results")
    .select("id, score, correct, wrong, blank, submitted_at, exams(title, duration_minutes)")
    .eq("user_id", user.id)
    .not("submitted_at", "is", null)
    .order("submitted_at", { ascending: false });

  const totalExams = results?.length ?? 0;
  const avgScore = totalExams > 0
    ? (results!.reduce((acc, r) => acc + Number(r.score ?? 0), 0) / totalExams).toFixed(1)
    : "—";
  const bestScore = totalExams > 0
    ? Math.max(...results!.map((r) => Number(r.score ?? 0))).toFixed(2)
    : "—";

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden pb-20">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] z-0 pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="container max-w-4xl mx-auto px-4 py-10 relative z-10 space-y-10">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-input/50 border border-border/50 flex items-center justify-center hover:bg-input transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-3xl font-heading font-extrabold tracking-tight text-foreground">Sınav Geçmişim</h1>
            <p className="text-muted-foreground font-medium mt-0.5">Tüm sınav performansınızı buradan takip edebilirsiniz.</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Toplam Sınav", value: totalExams, icon: Trophy, color: "text-primary" },
            { label: "Ortalama Puan", value: avgScore, icon: CheckCircle2, color: "text-emerald-500" },
            { label: "En Yüksek Puan", value: bestScore, icon: Trophy, color: "text-amber-500" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-5 text-center shadow-sm">
              <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
              <p className="text-2xl font-heading font-black text-foreground">{value}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Results List */}
        {!results || results.length === 0 ? (
          <div className="text-center py-20 rounded-[2rem] border border-dashed border-primary/20 bg-primary/5">
            <p className="text-xl font-heading font-bold text-foreground">Henüz sınav çözmediniz.</p>
            <p className="text-muted-foreground mt-2">Sınavlar bölümünden bir sınav seçerek başlayabilirsiniz.</p>
            <Link href="/exams" className="inline-block mt-6 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold hover:-translate-y-0.5 transition-all shadow-[0_8px_16px_rgba(0,103,98,0.2)]">
              Sınavlara Gözat
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((r, idx) => {
              const exam = r.exams as unknown as { title: string; duration_minutes: number } | null;
              const score = Number(r.score ?? 0);
              const date = new Date(r.submitted_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
              const scoreColor = score >= 70 ? "text-emerald-600" : score >= 40 ? "text-amber-600" : "text-red-600";
              const scoreBg = score >= 70 ? "bg-emerald-500/10 border-emerald-500/20" : score >= 40 ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20";
              return (
                <Link key={r.id} href={`/exams/result/${r.id}`} className="block group">
                  <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 hover:border-border transition-all duration-300 flex items-center gap-5">
                    <div className={`shrink-0 w-12 h-12 rounded-[1rem] flex items-center justify-center font-heading font-black text-xl border ${scoreBg} ${scoreColor}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-foreground group-hover:text-primary transition-colors truncate">{exam?.title ?? "Sınav"}</p>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">{date}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 text-sm font-bold">
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />{r.correct ?? 0}
                      </span>
                      <span className="flex items-center gap-1 text-red-500">
                        <XCircle className="w-4 h-4" />{r.wrong ?? 0}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <MinusCircle className="w-4 h-4" />{r.blank ?? 0}
                      </span>
                      <span className={`px-3 py-1.5 rounded-xl border font-heading font-black text-base ${scoreBg} ${scoreColor}`}>
                        {score.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
