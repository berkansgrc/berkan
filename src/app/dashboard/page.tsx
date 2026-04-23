import { BookOpen, Trophy, Clock, Target, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { getCachedUser, getCachedProfile } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import DashboardLessons from "@/components/dashboard/DashboardLessons";

export const metadata = {
  title: "Panelim | Berkan Matematik",
  description: "Öğrenci ve admin kontrol paneli.",
};

// Auth sayfaları kısa süreli cache
export const revalidate = 30;

export default async function DashboardPage() {
  // getCachedUser, Navbar ile aynı istek — sıfır ekstra DB çağrısı
  const user = await getCachedUser();
  if (!user) return null;

  // getCachedProfile, Navbar ile aynı profile — sıfır ekstra DB çağrısı
  const profile = await getCachedProfile(user.id);
  const firstName = profile?.full_name?.split(" ")[0] || "Öğrenci";

  // ===================== YÖNETİCİ PANELİ =====================
  if (profile?.role === "admin") {
    const supabase = await createClient();
    const [{ count: totalStudents }, { count: totalExams }] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
      supabase.from("exams").select("*", { count: "exact", head: true }),
    ]);

    return (
      <div className="relative min-h-[calc(100vh-4rem)] w-full p-4 md:p-8 bg-background overflow-hidden pb-20">
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] z-0 pointer-events-none -translate-y-1/3 translate-x-1/3" />
        <div className="relative z-10 max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                Yönetici Paneli
              </h1>
              <p className="text-muted-foreground text-lg mt-2 font-medium">
                Sistem geneline hoş geldin, <span className="font-bold text-red-500">{firstName}</span>.
              </p>
            </div>
            <a
              href="/admin/exams"
              className="bg-gradient-to-br from-red-600 to-red-800 text-white font-heading font-bold text-[15px] px-6 py-3.5 rounded-[1.25rem] shadow-[0_12px_24px_rgba(220,38,38,0.25)] hover:shadow-[0_16px_32px_rgba(220,38,38,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Sistem Ayarlarına Git</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-card/70 backdrop-blur-xl border border-border p-6 rounded-[1.5rem] shadow-sm">
              <p className="text-sm font-semibold text-muted-foreground mb-1">Toplam Öğrenci</p>
              <div className="text-3xl font-heading font-bold text-foreground">{totalStudents || 0}</div>
            </div>
            <div className="bg-card/70 backdrop-blur-xl border border-border p-6 rounded-[1.5rem] shadow-sm">
              <p className="text-sm font-semibold text-muted-foreground mb-1">Toplam Sınav</p>
              <div className="text-3xl font-heading font-bold text-foreground">{totalExams || 0}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // ===================== ÖĞRENCİ PANELİ =====================
  const supabase = await createClient();
  const { data: studentResults } = await supabase
    .from("exam_results")
    .select("score, correct, wrong")
    .eq("user_id", user.id);

  const examCount = studentResults?.length || 0;
  const studentAvgScore =
    examCount > 0
      ? Math.round(
          (studentResults!.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0) / examCount) * 10
        ) / 10
      : 0;

  const lastResult = studentResults && studentResults.length > 0 ? studentResults[studentResults.length - 1] : null;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full p-4 md:p-8 bg-background overflow-hidden pb-20">
      {/* Dekoratif arka plan */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none -translate-y-1/3 translate-x-1/3" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] z-0 pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
              Öğrenci Paneli
            </h1>
            <p className="text-muted-foreground text-lg mt-2 font-medium">
              Hoş geldin, <span className="font-bold text-primary">{firstName}</span>. Eğitim serüvenine devam edelim.
            </p>
          </div>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card/70 backdrop-blur-xl border border-border p-6 rounded-[1.5rem] shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
            <div className="relative z-10">
              <div className="bg-background border border-border w-10 h-10 rounded-xl flex items-center justify-center shadow-sm mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">Girilen Sınavlar</p>
              <div className="text-3xl font-heading font-bold text-foreground">{examCount}</div>
              <div className="w-full bg-input/50 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${Math.min((examCount / 40) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-card/70 backdrop-blur-xl border border-border p-6 rounded-[1.5rem] shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/10 transition-colors" />
            <div className="relative z-10">
              <div className="bg-background border border-border w-10 h-10 rounded-xl flex items-center justify-center shadow-sm mb-4">
                <Target className="h-5 w-5 text-secondary" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">Genel Puan Ortalaması</p>
              <div className="text-3xl font-heading font-bold text-foreground">{studentAvgScore}</div>
              <p className="text-xs font-semibold text-muted-foreground mt-2">Tüm sınavlarınız baz alındı</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-container/40 to-primary/5 backdrop-blur-xl border border-primary/20 p-6 rounded-[1.5rem] shadow-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 text-primary/10 w-40 h-40 flex items-center justify-center">
              <Trophy className="w-full h-full" />
            </div>
            <div className="relative z-10">
              <div className="bg-primary/10 border border-primary/20 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm mb-4">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-semibold text-primary/80 mb-1">Son Sınav</p>
              {lastResult ? (
                <>
                  <div className="text-3xl font-heading font-bold text-primary">{lastResult.correct ?? 0} Doğru</div>
                  <p className="text-xs font-semibold text-primary/60 mt-1">
                    {lastResult.wrong ?? 0} yanlış
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Henüz sınav girmediniz</p>
              )}
            </div>
          </div>
        </div>

        {/* Yaklaşan Özel Derslerim */}
        <DashboardLessons userId={user.id} />
      </div>
    </div>
  );
}
