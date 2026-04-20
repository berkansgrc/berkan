import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Radio, Users, Calendar, ArrowRight, Lock, Bell, Play, Wifi, WifiOff } from "lucide-react";
import { getCachedUser } from "@/utils/supabase/queries";

export const metadata = {
  title: "Canlı Dersler | Berkan Matematik",
  description: "Berkan Matematik ile canlı matematik derslerine katılın. Gerçek zamanlı öğrenme deneyimi.",
};

export const revalidate = 60;

export default async function CanliDersPage() {
  // getCachedUser + live_stream_config paralel çal›ş›r — seri değil
  const supabase = await createClient();
  const [user, { data: config }] = await Promise.all([
    getCachedUser(),
    supabase.from("live_stream_config").select("*").single(),
  ]);

  const isLive = config?.is_live ?? false;
  const youtubeId = config?.youtube_video_id ?? null;
  const lessonTitle = config?.lesson_title ?? "Canlı Ders";
  const lessonDescription = config?.lesson_description ?? "Yakında canlı ders başlayacak.";
  const viewerCount = config?.viewer_count ?? 0;
  const scheduledAt = config?.scheduled_at ? new Date(config.scheduled_at) : null;


  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-background overflow-hidden">
      {/* Animated Network Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-red-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container max-w-7xl mx-auto px-6 lg:px-12 py-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border ${isLive ? "bg-red-500/10 border-red-500/30 text-red-500 animate-pulse" : "bg-muted border-border text-muted-foreground"}`}>
                {isLive ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isLive ? "CANLI" : "ÇEVRIMDIŞI"}
              </div>
              {isLive && viewerCount > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                  <Users className="w-3 h-3" />
                  {viewerCount} izleyici
                </div>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
              Canlı Dersler
            </h1>
            <p className="text-muted-foreground text-lg mt-2 font-medium max-w-xl">
              Matematik öğrenimini gerçek zamanlı, etkileşimli bir deneyime dönüştür.
            </p>
          </div>

          {!user && (
            <Link href="/register">
              <button className="flex items-center gap-2 bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-bold text-sm px-6 py-3.5 rounded-[1.25rem] shadow-[0_12px_24px_rgba(0,103,98,0.25)] hover:shadow-[0_16px_32px_rgba(0,103,98,0.3)] hover:-translate-y-0.5 transition-all">
                <Lock className="w-4 h-4" />
                Kayıt Ol — Tam Erişim
              </button>
            </Link>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Video Player — Col Span 2 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Player Box */}
            <div className="rounded-[2rem] overflow-hidden border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl relative">
              {isLive && youtubeId ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1`}
                    title={lessonTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/30 relative">
                  {/* Decorative geometric elements */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-5">
                    <div className="w-96 h-96 border-2 border-foreground rounded-full" />
                    <div className="absolute w-64 h-64 border border-foreground rounded-full" />
                    <div className="absolute w-32 h-32 border border-foreground rounded-full" />
                  </div>

                  <div className="relative z-10 flex flex-col items-center gap-6 text-center px-8">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-muted border border-border flex items-center justify-center">
                      <Radio className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xl font-heading font-black text-foreground">Şu an canlı ders yok</p>
                      <p className="text-muted-foreground mt-2 text-sm font-medium max-w-sm">
                        {scheduledAt
                          ? `Sonraki ders: ${scheduledAt.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}`
                          : "Yakında canlı ders başlayacak. Bildirimleri aç."}
                      </p>
                    </div>

                    {!user ? (
                      <Link href="/register">
                        <button className="flex items-center gap-2 bg-primary text-primary-foreground font-heading font-bold px-6 py-3 rounded-xl hover:-translate-y-0.5 transition-all text-sm">
                          <Bell className="w-4 h-4" />
                          Bildirim Al
                        </button>
                      </Link>
                    ) : (
                      <Link href="/dashboard/canli-ders">
                        <button className="flex items-center gap-2 bg-primary text-primary-foreground font-heading font-bold px-6 py-3 rounded-xl hover:-translate-y-0.5 transition-all text-sm">
                          <Bell className="w-4 h-4" />
                          Öğrenci Panelinden Takip Et
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Live Badge Overlay */}
              {isLive && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  CANLI
                </div>
              )}
            </div>

            {/* Lesson Info */}
            <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-2xl font-heading font-black text-foreground mb-2">{lessonTitle}</h2>
              <p className="text-muted-foreground font-medium leading-relaxed">{lessonDescription}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Upgrade CTA — Kayıtlı değilse */}
            {!user && (
              <div className="rounded-[1.5rem] border border-primary/30 bg-primary-container/20 backdrop-blur-xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-[1rem] bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-black text-foreground text-lg mb-2">Tam Erişim</h3>
                  <p className="text-muted-foreground text-sm font-medium mb-5">
                    Kayıtlı öğrenciler canlı ders akışlarına, not alma araçlarına ve özel sorulara erişebilir.
                  </p>
                  <div className="space-y-3 mb-6">
                    {["Canlı soru-cevap", "Ders notları", "Arşiv dersleri", "Öğrenci paneli"].map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <Link href="/register">
                    <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-bold text-sm py-3 rounded-xl hover:-translate-y-0.5 transition-all">
                      Ücretsiz Kayıt Ol <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* Logged In CTA */}
            {user && (
              <div className="rounded-[1.5rem] border border-primary/30 bg-primary-container/10 backdrop-blur-xl p-6 shadow-sm">
                <div className="w-12 h-12 rounded-[1rem] bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Play className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-black text-foreground text-lg mb-2">Öğrenci Paneli</h3>
                <p className="text-muted-foreground text-sm font-medium mb-5">
                  Not alma, canlı sorular ve kişisel izleme için paneline geç.
                </p>
                <Link href="/dashboard/canli-ders">
                  <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-bold text-sm py-3 rounded-xl hover:-translate-y-0.5 transition-all">
                    Panele Git <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            )}

            {/* Schedule Info */}
            <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-black text-foreground">Ders Takvimi</h3>
              </div>
              <div className="space-y-3">
                {[
                  { day: "Pazartesi", time: "19:00", topic: "Türev Uygulamaları", level: "TYT" },
                  { day: "Çarşamba", time: "19:00", topic: "İntegral Başlangıç", level: "AYT" },
                  { day: "Cuma", time: "20:00", topic: "Geometri Soru Çözümü", level: "LGS" },
                ].map((lesson) => (
                  <div key={lesson.day} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                    <div>
                      <p className="text-xs font-black text-primary uppercase tracking-wide">{lesson.day} · {lesson.time}</p>
                      <p className="font-semibold text-foreground text-sm mt-0.5">{lesson.topic}</p>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-background border border-border px-2 py-1 rounded-lg text-muted-foreground">
                      {lesson.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
