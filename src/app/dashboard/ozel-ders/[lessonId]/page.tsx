import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Video, Pencil, ShieldCheck, CheckCircle2, Camera, Mic, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Ders Hazırlık Odası | Berkan Matematik",
  description: "Canlı ders öncesi hazırlık ve not alanı.",
};

export default async function OzelDersLobbyPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Dersi çek
  const { data: lesson, error } = await supabase
    .from("private_lessons")
    .select(`*, lesson_participants(user_id)`)
    .eq("id", lessonId)
    .single();

  if (error || !lesson) return notFound();

  // Yetki kontrolü
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const isTeacher = profile?.role === "teacher" || profile?.role === "admin";
  const isAssignedStudent = lesson.lesson_participants?.some((p: any) => p.user_id === user.id);
  const isGroupLesson = !lesson.is_private;

  if (!isTeacher && !isAssignedStudent && !isGroupLesson) {
    redirect("/dashboard");
  }

  const displayName = profile?.full_name || "Öğrenci";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border/50 bg-card/60 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="w-9 h-9 rounded-full bg-input/50 border border-border/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </Link>
          <div className="flex flex-col">
            <h1 className="font-heading font-black text-foreground leading-none">{lesson.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Hazırlık Odası</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>Bitiş: {new Date(lesson.end_time).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <div className="h-6 w-px bg-border/50" />
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <ShieldCheck className="w-4 h-4" />
            Güvenli Bağlantı
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 grid grid-cols-1 xl:grid-cols-4 gap-8 max-w-7xl mx-auto w-full">
        
        {/* Lobby Card — 3 Cols */}
        <div className="xl:col-span-3 space-y-8">
          
          <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mb-8 shadow-inner">
                <Video className="w-12 h-12 text-primary" />
              </div>

              <h2 className="text-3xl md:text-4xl font-heading font-black text-foreground mb-4">
                Derse Hazır Mısın?
              </h2>
              <p className="text-muted-foreground text-lg font-medium mb-10 leading-relaxed">
                Google Meet üzerinden gerçekleştirilecek dersliğimize geçiş yapmadan önce son kontrollerini yapalım.
              </p>

              {/* Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-12">
                {[
                  { icon: Camera, text: "Kamera Kontrolü" },
                  { icon: Mic, text: "Mikrofon Testi" },
                  { icon: CheckCircle2, text: "İnternet Bağlantısı" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-background/50 border border-border/50 shadow-sm">
                    <item.icon className="w-6 h-6 text-primary/70" />
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="flex flex-col items-center gap-4 w-full">
                <a 
                  href={lesson.meet_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto min-w-[320px] bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-black text-lg px-10 py-5 rounded-2xl shadow-[0_20px_40px_rgba(0,103,98,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
                >
                  <Video className="w-6 h-6" />
                  Derse Katıl
                  <ExternalLink className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
                <p className="text-xs text-muted-foreground font-medium italic">
                  Butona tıkladığında Google Meet yeni sekmede açılacaktır.
                </p>
              </div>
            </div>
          </div>

          {/* Guide Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-[1.5rem] bg-card/40 border border-border/50 flex gap-4">
               <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-secondary" />
               </div>
               <div>
                  <h4 className="font-bold text-foreground mb-1">Verimli Bir Ders İçin</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Ders sırasında mikrofonunu kapalı tutman, hoca söz verdiğinde açman ve kamera paylaşımı yapman öğrenme verimini artırır.
                  </p>
               </div>
            </div>
            <div className="p-6 rounded-[1.5rem] bg-card/40 border border-border/50 flex gap-4">
               <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Pencil className="w-6 h-6 text-primary" />
               </div>
               <div>
                  <h4 className="font-bold text-foreground mb-1">Ders Notları</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Sağ taraftaki not alanını ders boyunca kullanabilirsin. Sekmeler arası geçiş yaparak notlarını almayı unutma!
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar — 1 Col */}
        <aside className="xl:col-span-1 space-y-6 flex flex-col h-full">
          <div className="flex-1 rounded-[2rem] border border-border/50 bg-card/60 backdrop-blur-xl p-6 shadow-sm flex flex-col min-h-[400px]">
            <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Pencil className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-heading font-black text-foreground">Ders Notlarım</h3>
            </div>
            <textarea 
              placeholder="Ders sırasında önemli yerleri buraya not alabilirsin..."
              className="flex-1 w-full bg-background/50 border border-border/50 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium"
            />
            <div className="pt-4 text-center">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest bg-muted py-1 rounded-full">
                Sadece Senin İçin Saklanır
              </p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border/50 bg-card/40 p-4 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border border-primary/20 flex items-center justify-center font-black text-primary">
                B
             </div>
             <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Eğitmen</p>
                <p className="text-sm font-black text-foreground">Berkan Hoca</p>
             </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
