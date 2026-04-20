import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Globe, Lock, Users, ArrowLeft, Play, LayoutGrid } from "lucide-react";

type Props = {
  params: Promise<{ examId: string }>;
};

export default async function ExamDetailPage({ params }: Props) {
  const { examId } = await params;
  const supabase = await createClient();

  const { data: exam } = await supabase
    .from("exams")
    .select("id, title, description, duration_minutes, access_mode, is_published, share_code")
    .eq("id", examId)
    .single();

  if (!exam || !exam.is_published) return notFound();

  const { count } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("exam_id", examId);

  const isPublic = exam.access_mode === "public";

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-6 bg-background overflow-hidden w-full">
      {/* Decorative Ethereal Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\\\'0 0 200 200\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\'%3E%3Cfilter id=\\\'noiseFilter\\\'%3E%3CfeTurbulence type=\\\'fractalNoise\\\' baseFrequency=\\\'0.65\\\' numOctaves=\\\'3\\\' stitchTiles=\\\'stitch\\\'/%3E%3C/filter%3E%3Crect width=\\\'100%25\\\' height=\\\'100%25\\\' filter=\\\'url(%23noiseFilter)\\\'/%3E%3C/svg%3E")' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] z-0 pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10 flex flex-col gap-6">
        
        {/* Navigation */}
        <Link
          href="/exams"
          className="inline-flex items-center gap-2 text-sm font-bold font-heading text-muted-foreground hover:text-primary transition-colors self-start"
        >
          <div className="bg-input/50 p-2 rounded-full border border-border/50">
             <ArrowLeft className="h-4 w-4" />
          </div>
          Tüm Sınavlara Dön
        </Link>
        
        {/* Main Bento Box */}
        <div className="rounded-[2.5rem] border border-border/50 bg-card/60 backdrop-blur-2xl p-8 md:p-12 shadow-[0_24px_48px_rgba(44,47,48,0.06)] relative overflow-hidden">
          {/* Subtle Top Gradient */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
              
              <div className="flex flex-col items-center gap-5">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-primary-container to-background flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10 relative">
                     <div className="absolute inset-2 bg-primary/10 blur-md rounded-full"></div>
                     <LayoutGrid className="w-10 h-10 text-primary relative z-10" />
                  </div>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold tracking-wide uppercase ${
                      isPublic ? "bg-primary-container/40 text-primary border border-primary/20" : "bg-surface-variant text-on-surface-variant border border-muted-foreground/30"
                    }`}
                  >
                    {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    {isPublic ? "Herkese Açık Deneme" : "Özel Oturum"}
                  </span>
              </div>

              <div>
                <h1 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground leading-tight">{exam.title}</h1>
                {exam.description && (
                  <p className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto font-medium leading-relaxed">
                     {exam.description}
                  </p>
                )}
              </div>

              {/* Bento Grid Info */}
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="rounded-[1.5rem] bg-input/40 border border-border/50 p-6 flex flex-col items-center justify-center space-y-2 hover:bg-input/60 transition-colors">
                  <div className="bg-background rounded-full p-3 border border-border/50 shadow-sm mb-2">
                     <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-3xl font-heading font-black">{exam.duration_minutes}</p>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-[#005a55]">Dakika</p>
                </div>
                <div className="rounded-[1.5rem] bg-input/40 border border-border/50 p-6 flex flex-col items-center justify-center space-y-2 hover:bg-input/60 transition-colors">
                  <div className="bg-background rounded-full p-3 border border-border/50 shadow-sm mb-2">
                     <Users className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-3xl font-heading font-black">{count ?? 0}</p>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-[#005a55]">Soru</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="w-full pt-4">
                  <Link href={`/exams/${exam.id}/take`} className="block w-full">
                    <button className="w-full group relative overflow-hidden bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-extrabold text-xl h-16 rounded-[1.5rem] shadow-[0_12px_24px_rgba(0,103,98,0.25)] hover:shadow-[0_20px_40px_rgba(0,103,98,0.35)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 border-0">
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
                      <span className="relative z-10">Sınava Başla</span>
                      <Play className="ml-1 h-6 w-6 fill-primary-foreground relative z-10 group-hover:scale-110 transition-transform" />
                    </button>
                  </Link>

                  <p className="text-sm text-center text-muted-foreground font-medium mt-6 bg-input/30 py-3 rounded-xl border border-border/50 inline-block px-6">
                    Sınava başladığınızda süre geriye saymaya başlar. Süre bittiğinde otomatik testim edilir.
                  </p>
              </div>

          </div>
        </div>

      </div>
    </div>
  );
}
