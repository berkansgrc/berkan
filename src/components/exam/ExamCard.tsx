import Link from "next/link";
import { Clock, Globe, Lock, ArrowRight, Play } from "lucide-react";
import type { ExamSearchItem } from "@/lib/fuse";

type Props = {
  exam: ExamSearchItem;
};

export default function ExamCard({ exam }: Props) {
  const isPublic = exam.access_mode === "public";

  return (
    <div className="group flex flex-col justify-between rounded-[1.5rem] bg-card/60 backdrop-blur-xl border border-border/50 p-6 hover:shadow-[0_20px_40px_rgba(44,47,48,0.06)] hover:-translate-y-1 hover:border-border transition-all duration-300 relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full">
         <div className="flex justify-between items-start mb-4">
             {/* Badge */}
             <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold tracking-wide uppercase ${
                isPublic
                  ? "bg-primary-container/30 text-primary-fixed-variant border border-primary/20"
                  : "bg-surface-variant text-on-surface-variant border border-border"
              }`}
             >
              {isPublic ? (
                <><Globe className="h-3.5 w-3.5 text-primary" /> Herkese Açık</>
              ) : (
                <><Lock className="h-3.5 w-3.5" /> Özel Sınav</>
              )}
             </span>
         </div>
         
         <div className="flex-1">
            <h3 className="font-heading font-extrabold text-2xl text-foreground leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
              {exam.title}
            </h3>
            
            {exam.description && (
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4 font-medium">
                 {exam.description}
              </p>
            )}
         </div>

         <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground bg-input/40 self-start px-3 py-1.5 rounded-lg border border-border/50">
               <Clock className="h-4 w-4 text-primary" />
               <span>{exam.duration_minutes} Dakika</span>
            </div>

            <Link href={`/exams/${exam.id}`} className="w-full mt-2">
              <button className="w-full group/btn bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-bold text-[15px] h-12 rounded-[1rem] shadow-[0_8px_16px_rgba(0,103,98,0.2)] hover:shadow-[0_12px_24px_rgba(0,103,98,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 border-0">
                 <Play className="w-4 h-4 fill-primary-foreground group-hover/btn:scale-110 transition-transform" />
                 <span>Hemen Çöz</span>
              </button>
            </Link>
         </div>
      </div>
    </div>
  );
}
