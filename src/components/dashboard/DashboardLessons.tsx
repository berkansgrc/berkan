"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Video, Calendar, Clock, School, CheckCircle2 } from "lucide-react";

export default function DashboardLessons({ userId }: { userId: string }) {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      const supabase = createClient();
      
      // Öğrencinin kendisi için atanmış VEYA herkese açık (student_id = null) olan,
      // ve henüz tamamlanmamış veya bitiş süresi geçmemiş dersleri getir.
      // Sadece gelecekteki veya şu anki dersler
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from("private_lessons")
        .select(`
          *,
          lesson_participants(user_id)
        `)
        .gt("end_time", now)
        .order("start_time", { ascending: true })
        .limit(20); // fetch more to filter locally

      if (!error && data) {
        // İstemci tarafında filtrele: Herkese açık (is_private=false) VEYA öğrenci katılımcı listesinde
        const filteredLessons = data.filter(lesson => {
          if (!lesson.is_private) return true;
          return lesson.lesson_participants?.some((p: any) => p.user_id === userId);
        }).slice(0, 5); // Sonra ilk 5'i al
        
        setLessons(filteredLessons);
      }
      setLoading(false);
    }

    fetchLessons();
  }, [userId]);

  if (loading) {
    return (
      <div className="animate-pulse bg-card/60 backdrop-blur-xl border border-border rounded-[1.5rem] p-6 h-40">
        <div className="h-6 w-40 bg-muted rounded mb-4"></div>
        <div className="h-20 bg-muted/50 rounded-xl"></div>
      </div>
    );
  }

  if (lessons.length === 0) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-2xl font-black font-heading text-foreground flex items-center gap-2">
        <Video className="w-6 h-6 text-primary" />
        Yaklaşan Özel Derslerim
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => {
          const startTime = new Date(lesson.start_time);
          const endTime = new Date(lesson.end_time);
          const now = new Date();
          
          // Katılma butonu dersten 5 dakika önce aktif olsun, bitene kadar aktif kalsın
          const isActive = now >= new Date(startTime.getTime() - 5 * 60000) && now <= endTime;
          const isPassed = now > endTime;

          return (
            <div 
              key={lesson.id} 
              className={`bg-card/70 backdrop-blur-xl border relative overflow-hidden flex flex-col p-6 rounded-[1.5rem] shadow-sm hover:shadow-lg transition-all duration-300 ${
                isActive ? "border-green-500/50 shadow-green-500/10" : "border-border"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              )}
              
              <div className="flex-1 relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-[10px] uppercase font-black tracking-wider px-2 py-1 rounded-md mb-3 inline-block ${
                    lesson.is_private 
                      ? "bg-blue-500/10 text-blue-500" 
                      : "bg-orange-500/10 text-orange-500"
                  }`}>
                    {lesson.is_private ? "Özel Ders" : `Grup Dersi: ${lesson.target_group || "Genel"}`}
                  </span>
                  
                  {isActive && (
                    <span className="flex h-3 w-3 mt-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-bold text-lg text-foreground leading-tight mb-2">
                  {lesson.title}
                </h3>
                {lesson.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                    {lesson.description}
                  </p>
                )}

                <div className="space-y-2 mt-auto">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                    <Calendar className="w-4 h-4 text-primary" />
                    {startTime.toLocaleDateString("tr-TR", { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                    <Clock className="w-4 h-4 text-secondary" />
                    {startTime.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                    {" - "}
                    {endTime.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-border/50 relative z-10">
                {isPassed ? (
                  <div className="w-full bg-muted text-muted-foreground font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm opacity-50 cursor-not-allowed">
                    <CheckCircle2 className="w-4 h-4" /> Tamamlandı
                  </div>
                ) : isActive ? (
                  <Link
                    href={`/dashboard/ozel-ders/${lesson.id}`}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-heading font-black py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                  >
                    <Video className="w-4 h-4" /> Derse Katıl
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full bg-input/50 text-muted-foreground font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm cursor-not-allowed border border-border"
                  >
                    <Clock className="w-4 h-4" /> Link Ders Saatinde Açılacak
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
