import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Radio,
  ArrowRight,
  TrendingUp,
  Shield,
  Activity,
  Clock,
} from "lucide-react";
import DashboardStatCard from "@/components/admin/DashboardStatCard";
import ActivityChart from "@/components/admin/ActivityChart";

export const metadata = {
  title: "Admin Paneli | Berkan Matematik",
};

// ISR: 60 saniyede bir yenile
export const revalidate = 60;

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const firstName = profile?.full_name?.split(" ")[0] || "Admin";

  // Paralel veri çekimi
  const [
    { count: totalStudents },
    { count: totalExams },
    { count: publishedExams },
    { count: totalResults },
    { data: recentUsers },
    { data: liveConfig },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("exams").select("*", { count: "exact", head: true }),
    supabase.from("exams").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("exam_results").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id, full_name, role, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("live_stream_config").select("is_live, lesson_title").single(),
  ]);

  const stats = [
    {
      label: "Toplam Öğrenci",
      value: totalStudents || 0,
      iconName: "users" as const,
      color: "text-blue-500",
      bg: "bg-blue-500/10 border-blue-500/20",
      href: "/admin/kullanici",
      trend: "+12% bu ay",
      trendUp: true,
      delay: 0.1,
    },
    {
      label: "Toplam Sınav",
      value: totalExams || 0,
      iconName: "book" as const,
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
      href: "/admin/exams",
      trend: `${publishedExams || 0} yayında`,
      trendUp: true,
      delay: 0.2,
    },
    {
      label: "Sınav Girişleri",
      value: totalResults || 0,
      iconName: "trend" as const,
      color: "text-violet-500",
      bg: "bg-violet-500/10 border-violet-500/20",
      href: "/admin/exams",
      trend: "Rekor katılım",
      trendUp: true,
      delay: 0.3,
    },
    {
      label: "Canlı Durum",
      value: liveConfig?.is_live ? "CANLI" : "KAPALI",
      iconName: "radio" as const,
      color: liveConfig?.is_live ? "text-red-500" : "text-muted-foreground",
      bg: liveConfig?.is_live
        ? "bg-red-500/10 border-red-500/20"
        : "bg-muted/40 border-border/50",
      href: "/admin/canli-ders",
      trend: liveConfig?.is_live ? liveConfig.lesson_title || "Yayın Aktif" : "Yayın yok",
      trendUp: !!liveConfig?.is_live,
      delay: 0.4,
    },
  ];

  return (
    <div className="p-6 lg:p-10 pb-24 lg:pb-10 space-y-10 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Yönetici Erişimi
            </span>
          </div>
          <h1 className="text-4xl font-heading font-extrabold tracking-tight text-foreground">
            Hoş geldin, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#005a55]">{firstName}</span> 👋
          </h1>
          <p className="text-muted-foreground text-base mt-1 font-medium">
            Platform geneline kuşbakışı inceleme ve hızlı yönetim.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card/60 backdrop-blur-xl border border-border/50 px-5 py-2.5 rounded-full shadow-sm">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="font-bold tracking-wide">Sistem Aktif</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
        {stats.map((stat) => (
          <DashboardStatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
        {/* Sol Kolon: Aktivite Grafiği & Hızlı Aksiyonlar */}
        <div className="xl:col-span-2 space-y-8">
          {/* Aktivite Grafiği */}
          <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-6 lg:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-heading font-black text-xl text-foreground">Öğrenci Aktivitesi</h2>
                <p className="text-sm text-muted-foreground font-medium mt-1">Son 7 günlük platform etkileşimi</p>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                Bu Hafta
              </div>
            </div>
            <ActivityChart />
          </div>

          {/* Hızlı Aksiyonlar (Tile Grid) */}
          <div>
            <h2 className="font-heading font-black text-lg text-foreground flex items-center gap-2 mb-4">
              <span className="w-1.5 h-6 rounded-full bg-primary inline-block" />
              Hızlı Aksiyonlar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Yeni Sınav Oluştur", desc: "Öğrenciler için yeni bir değerlendirme hazırla.", href: "/admin/exams/new", icon: BookOpen, color: "text-primary", bg: "bg-primary/10", border: "hover:border-primary/50" },
                { label: "Canlı Dersi Yönet", desc: "Yayını başlat veya durumunu güncelle.", href: "/admin/canli-ders", icon: Radio, color: "text-red-500", bg: "bg-red-500/10", border: "hover:border-red-500/50" },
                { label: "Kullanıcıları İncele", desc: "Öğrenci listesi ve ilerleme durumları.", href: "/admin/kullanici", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "hover:border-blue-500/50" },
                { label: "Sınav Sonuçları", desc: "Detaylı analizler ve genel başarı durumu.", href: "/admin/exams", icon: TrendingUp, color: "text-violet-500", bg: "bg-violet-500/10", border: "hover:border-violet-500/50" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`flex flex-col gap-3 p-5 rounded-[1.25rem] border border-border/50 bg-card/60 backdrop-blur-xl hover:-translate-y-1 transition-all duration-300 group shadow-sm hover:shadow-md ${action.border}`}
                >
                  <div className={`w-10 h-10 rounded-[10px] ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <div>
                    <span className="font-heading font-bold text-base text-foreground block mb-1">{action.label}</span>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sağ Kolon: Son Kayıtlar */}
        <div className="xl:col-span-1 space-y-4">
          <h2 className="font-heading font-black text-lg text-foreground flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-secondary inline-block" />
            Son Kayıtlar
          </h2>
          <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm flex flex-col h-full min-h-[400px]">
            {recentUsers && recentUsers.length > 0 ? (
              <div className="flex-1 divide-y divide-border/50 p-2">
                {recentUsers.map((u) => {
                  const initials = u.full_name
                    ? u.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
                    : "?";
                  const isAdmin = u.role === "admin";
                  return (
                    <div key={u.id} className="flex items-center gap-4 px-4 py-3.5 hover:bg-muted/40 rounded-xl transition-colors cursor-default">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-border flex items-center justify-center font-heading font-black text-sm text-foreground flex-shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-foreground text-sm truncate">
                          {u.full_name || "İsimsiz"}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground font-medium">
                            {new Date(u.created_at).toLocaleDateString("tr-TR", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                        isAdmin
                          ? "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.15)]"
                          : "bg-muted text-muted-foreground border-border"
                      }`}>
                        {u.role === "student" ? "Öğrenci" : u.role}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-medium text-sm">Henüz kayıtlı kullanıcı yok.</p>
              </div>
            )}
            <div className="p-4 bg-muted/10 border-t border-border/50 mt-auto">
              <Link href="/admin/kullanici" className="w-full py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-sm font-bold text-foreground transition-colors flex items-center justify-center gap-2 group shadow-sm">
                Tüm Kullanıcılar <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
