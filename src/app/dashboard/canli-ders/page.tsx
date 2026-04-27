import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Radio, Wifi, WifiOff, Users, MessageSquare, Pencil, ArrowLeft, Bell, Play, BookOpen } from "lucide-react";
import LivePollWidget from "@/components/live/LivePollWidget";
import LiveQuestionQueue from "@/components/live/LiveQuestionQueue";
import LessonReminderBanner from "@/components/live/LessonReminderBanner";
import LivePresenceTracker from "@/components/live/LivePresenceTracker";
import ReminderOptIn from "@/components/live/ReminderOptIn";

export const metadata = {
  title: "Canlı Dersim | Berkan Matematik",
  description: "Canlı derse öğrenci panelinden katıl.",
};

export const revalidate = 30;

async function getLiveStreamConfig() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("live_stream_config")
    .select("*")
    .single();
  return data;
}

export default async function DashboardCanliDersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const firstName = profile?.full_name?.split(" ")[0] || "Öğrenci";

  const config = await getLiveStreamConfig();
  const isLive = config?.is_live ?? false;
  const youtubeId = config?.youtube_video_id ?? null;
  const chatVideoId = config?.youtube_chat_id ?? youtubeId;
  const lessonTitle = config?.lesson_title ?? "Canlı Ders";
  const lessonDescription = config?.lesson_description ?? "Ders başlamadı.";
  const viewerCount = config?.viewer_count ?? 0;

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-background overflow-hidden pb-20">
      {/* Decorative background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3" />
      </div>

      <div className="relative z-10 container max-w-7xl mx-auto px-6 lg:px-12 py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="w-10 h-10 rounded-full bg-input/50 border border-border/50 flex items-center justify-center hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isLive ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-muted border-border text-muted-foreground"}`}>
                  {isLive ? <><Wifi className="w-3 h-3" /> CANLI</> : <><WifiOff className="w-3 h-3" /> ÇEVRIMDIŞI</>}
                </div>
                {isLive && (
                  <LivePresenceTracker
                    userId={user.id}
                    userName={firstName}
                    lessonId={lessonTitle}
                  />
                )}
              </div>
              <h1 className="text-3xl font-heading font-extrabold tracking-tight text-foreground">Canlı Dersim</h1>
              <p className="text-muted-foreground font-medium text-sm mt-0.5">
                Hoş geldin, <span className="text-primary font-bold">{firstName}</span>.
              </p>
            </div>
          </div>
          <Link href="/canli-ders" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
            <Radio className="w-4 h-4" /> Herkese açık yayın
          </Link>
        </div>

        {/* Hatırlatma Banner */}
        {!isLive && (
          <div className="mb-6">
            <LessonReminderBanner
              scheduledAt={config?.scheduled_at ?? null}
              lessonTitle={lessonTitle}
            />
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* Video — 2 cols */}
          <div className="xl:col-span-2 space-y-6">
            <div className="rounded-[2rem] overflow-hidden border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl relative">
              {isLive && youtubeId ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title={lessonTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
                  <div className="text-center space-y-4 px-10">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-muted border border-border flex items-center justify-center mx-auto">
                      <Radio className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <p className="text-xl font-heading font-black text-foreground">Ders henüz başlamadı</p>
                    <p className="text-muted-foreground text-sm">Ders başladığında bu sayfa otomatik olarak güncellenecek.</p>
                  </div>
                </div>
              )}
              {isLive && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white text-xs font-black uppercase px-3 py-1.5 rounded-full z-20">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  CANLI
                </div>
              )}
            </div>

            {/* Lesson Info */}
            <div className="rounded-[1.5rem] border border-border/50 bg-card/60 p-6">
              <h2 className="text-xl font-heading font-black text-foreground mb-2">{lessonTitle}</h2>
              <p className="text-muted-foreground leading-relaxed">{lessonDescription}</p>
            </div>

            {/* Note Taking Area — Exclusive to authenticated students */}
            <div className="rounded-[1.5rem] border border-primary/20 bg-primary-container/10 backdrop-blur-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Pencil className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-heading font-black text-foreground">Ders Notlarım</h3>
                <span className="text-[10px] font-black uppercase text-primary/70 tracking-widest bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                  Yalnızca sana
                </span>
              </div>
              <textarea
                placeholder="Ders sırasında notlarını buraya al..."
                className="w-full min-h-[140px] bg-background/60 border border-border/60 rounded-[1rem] p-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none font-medium"
              />
              <p className="text-xs text-muted-foreground mt-2 font-medium">💡 Notlar yerel olarak saklanır — ders arşivine eklenecek.</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Canlı Anket Widget */}
            <LivePollWidget userId={user.id} />

            {/* Soru Kuyruğu */}
            <LiveQuestionQueue
              userId={user.id}
              isTeacher={profile?.role === "teacher" || profile?.role === "admin"}
            />

            {/* Live Chat — YouTube Chat embed */}
            {isLive && chatVideoId && (
              <div className="rounded-[1.5rem] overflow-hidden border border-border/50 bg-card/60 shadow-sm">
                <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <h3 className="font-heading font-black text-foreground text-sm">YouTube Sohbet</h3>
                </div>
                <iframe
                  src={`https://www.youtube.com/live_chat?v=${chatVideoId}&embed_domain=${process.env.NEXT_PUBLIC_SITE_DOMAIN || "localhost"}`}
                  title="Canlı Sohbet"
                  className="w-full h-[360px]"
                  allow="clipboard-write"
                />
              </div>
            )}

            {/* Hatırlatıcı tercihi */}
            {!isLive && <ReminderOptIn />}

            {/* Quick Actions */}
            <div className="rounded-[1.5rem] border border-border/50 bg-card/60 p-5 space-y-3">
              <h3 className="font-heading font-black text-sm text-foreground mb-2">Hızlı Menü</h3>
              <Link href="/exams" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group">
                <BookOpen className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-foreground">Sınavlar</span>
              </Link>
              <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group">
                <Play className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-foreground">Panele Dön</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
