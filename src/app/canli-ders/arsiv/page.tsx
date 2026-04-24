import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, Play, Calendar, Clock, Users } from "lucide-react";

export const metadata = {
  title: "Ders Arşivi | Berkan Matematik",
  description: "Geçmiş canlı dersleri izleyin — Berkan Matematik ders arşivi.",
};

export const revalidate = 120;

interface ArchiveItem {
  id: string;
  title: string;
  description: string | null;
  youtube_video_id: string;
  level: string | null;
  topic_tags: string[] | null;
  duration_minutes: number | null;
  participant_count: number;
  archived_at: string;
}

export default async function ArsivPage() {
  const supabase = await createClient();
  const { data: archives } = await supabase
    .from("live_archive")
    .select("*")
    .order("archived_at", { ascending: false });

  const items: ArchiveItem[] = archives || [];

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-background overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container max-w-6xl mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/canli-ders"
            className="w-10 h-10 rounded-full bg-input/50 border border-border/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-4xl font-heading font-extrabold tracking-tight text-foreground">
              Ders Arşivi
            </h1>
            <p className="text-muted-foreground text-sm font-medium mt-1">
              Geçmiş canlı dersleri tekrar izle. {items.length} ders mevcut.
            </p>
          </div>
        </div>

        {/* Grid */}
        {items.length === 0 ? (
          <div className="rounded-[2rem] border border-border/50 bg-card/60 backdrop-blur-xl p-16 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
              <Play className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-heading font-black text-lg text-foreground">
              Henüz arşivlenmiş ders yok
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Canlı dersler tamamlandıktan sonra burada arşivlenecek. Yakında
              tekrar izleyebileceğin dersler burada olacak.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => {
              const archivedDate = new Date(item.archived_at);
              const dateStr = archivedDate.toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });

              return (
                <div
                  key={item.id}
                  className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/20 transition-all group"
                >
                  {/* Video Thumbnail */}
                  <div className="aspect-video relative bg-gradient-to-br from-background to-muted/30 overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${item.youtube_video_id}/hqdefault.jpg`}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                    {/* Play overlay */}
                    <a
                      href={`https://www.youtube.com/watch?v=${item.youtube_video_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-foreground ml-0.5" />
                      </div>
                    </a>

                    {/* Level badge */}
                    {item.level && (
                      <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest bg-primary/90 text-primary-foreground px-2.5 py-1 rounded-lg">
                        {item.level}
                      </span>
                    )}

                    {/* Duration badge */}
                    {item.duration_minutes && (
                      <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-black/70 text-white px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.duration_minutes} dk
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-heading font-black text-foreground text-base mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-muted-foreground text-xs font-medium line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                      </span>
                      {item.participant_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {item.participant_count} katılımcı
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {item.topic_tags && item.topic_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.topic_tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-black uppercase tracking-wider bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-md border border-border/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
