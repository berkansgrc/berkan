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
      .limit(5),
    supabase.from("live_stream_config").select("is_live, lesson_title").single(),
  ]);

  const stats = [
    {
      label: "Toplam Öğrenci",
      value: totalStudents || 0,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10 border-blue-500/20",
      href: "/admin/kullanici",
      trend: "+12% bu ay",
    },
    {
      label: "Toplam Sınav",
      value: totalExams || 0,
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
      href: "/admin/exams",
      trend: `${publishedExams || 0} yayında`,
    },
    {
      label: "Sınav Girişleri",
      value: totalResults || 0,
      icon: TrendingUp,
      color: "text-violet-500",
      bg: "bg-violet-500/10 border-violet-500/20",
      href: "/admin/exams",
      trend: "Toplam katılım",
    },
    {
      label: "Canlı Durum",
      value: liveConfig?.is_live ? "CANLI" : "KAPALI",
      icon: Radio,
      color: liveConfig?.is_live ? "text-red-500" : "text-muted-foreground",
      bg: liveConfig?.is_live
        ? "bg-red-500/10 border-red-500/20"
        : "bg-muted/40 border-border/50",
      href: "/admin/canli-ders",
      trend: liveConfig?.is_live ? liveConfig.lesson_title || "Yayın Aktif" : "Yayın yok",
    },
  ];

  return (
    <div className="p-6 lg:p-10 pb-24 lg:pb-10 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Yönetici Erişimi
            </span>
          </div>
          <h1 className="text-4xl font-heading font-extrabold tracking-tight text-foreground">
            Hoş geldin, <span className="text-primary">{firstName}</span> 👋
          </h1>
          <p className="text-muted-foreground text-base mt-1 font-medium">
            Platform geneline genel bakış.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 border border-border/50 px-4 py-2 rounded-full">
          <Activity className="w-3.5 h-3.5" />
          <span className="font-bold">Sistem Aktif</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-[1.5rem] border bg-card/60 backdrop-blur-xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none ${stat.bg}`} />
            <div className="relative z-10">
              <div className={`w-10 h-10 rounded-[10px] border ${stat.bg} flex items-center justify-center mb-4`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">{stat.label}</p>
              <div className={`text-3xl font-heading font-black ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">{stat.trend}</p>
            </div>
            <ArrowRight className="absolute bottom-5 right-5 w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      {/* Quick Actions + Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hızlı Aksiyonlar */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-heading font-black text-lg text-foreground flex items-center gap-2">
            <span className="w-2 h-5 rounded-full bg-primary inline-block" />
            Hızlı Aksiyonlar
          </h2>
          <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm divide-y divide-border/50">
            {[
              { label: "Yeni Sınav Oluştur", href: "/admin/exams/new", icon: BookOpen, color: "text-primary" },
              { label: "Canlı Dersi Yönet", href: "/admin/canli-ders", icon: Radio, color: "text-red-500" },
              { label: "Kullanıcıları Görüntüle", href: "/admin/kullanici", icon: Users, color: "text-blue-500" },
              { label: "Sınavları Yönet", href: "/admin/exams", icon: BookOpen, color: "text-violet-500" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 px-5 py-4 hover:bg-primary/5 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                </div>
                <span className="font-heading font-bold text-sm text-foreground flex-1">{action.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* Son Kayıtlar */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-heading font-black text-lg text-foreground flex items-center gap-2">
            <span className="w-2 h-5 rounded-full bg-secondary inline-block" />
            Son Kayıtlar
          </h2>
          <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm">
            {recentUsers && recentUsers.length > 0 ? (
              <div className="divide-y divide-border/50">
                {recentUsers.map((u) => {
                  const initials = u.full_name
                    ? u.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
                    : "?";
                  const isAdmin = u.role === "admin";
                  return (
                    <div key={u.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/20 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-border flex items-center justify-center font-heading font-black text-sm text-foreground flex-shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-foreground text-sm truncate">
                          {u.full_name || "İsimsiz"}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground font-medium">
                            {new Date(u.created_at).toLocaleDateString("tr-TR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                        isAdmin
                          ? "bg-red-500/10 text-red-500 border-red-500/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}>
                        {u.role || "student"}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Henüz kullanıcı yok.</p>
              </div>
            )}
            <div className="px-6 py-3 border-t border-border/50 bg-muted/10">
              <Link href="/admin/kullanici" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5">
                Tüm kullanıcıları gör <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
