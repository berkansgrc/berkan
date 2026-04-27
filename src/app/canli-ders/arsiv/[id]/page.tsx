import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Users, Play } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("live_archive")
    .select("title, description")
    .eq("id", id)
    .single();

  return {
    title: data?.title ? `${data.title} | Ders Arşivi` : "Ders Arşivi",
    description: data?.description ?? "Berkan Matematik ders arşivi.",
  };
}

export const revalidate = 3600;

export default async function ArsivDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("live_archive")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) notFound();

  const archivedDate = new Date(item.archived_at).toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-background overflow-hidden pb-20">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container max-w-5xl mx-auto px-6 lg:px-12 py-10">
        {/* Back link */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/canli-ders/arsiv"
            className="w-10 h-10 rounded-full bg-input/50 border border-border/50 flex items-center justify-center hover:bg-muted transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="text-sm text-muted-foreground font-medium">
            <Link href="/canli-ders/arsiv" className="hover:text-foreground transition-colors">
              Ders Arşivi
            </Link>
            <span className="mx-2 text-border">›</span>
            <span className="text-foreground font-bold line-clamp-1">{item.title}</span>
          </div>
        </div>

        {/* Embed Player */}
        <div className="rounded-[2rem] overflow-hidden border border-primary/20 bg-card/80 backdrop-blur-xl shadow-2xl mb-8">
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${item.youtube_video_id}?rel=0&modestbranding=1`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Info + Meta grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Level + Title */}
            <div>
              {item.level && (
                <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg mb-3">
                  {item.level}
                </span>
              )}
              <h1 className="text-3xl font-heading font-extrabold text-foreground leading-tight">
                {item.title}
              </h1>
            </div>

            {item.description && (
              <p className="text-muted-foreground font-medium leading-relaxed">
                {item.description}
              </p>
            )}

            {/* Tags */}
            {item.topic_tags && item.topic_tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.topic_tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs font-bold bg-muted/60 text-muted-foreground px-3 py-1 rounded-full border border-border/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Meta Sidebar */}
          <div className="space-y-3">
            <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-5 space-y-4">
              <h3 className="font-heading font-black text-sm text-foreground">Ders Bilgileri</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-muted/40 border border-border/30 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tarih</p>
                    <p className="font-bold text-foreground text-xs">{archivedDate}</p>
                  </div>
                </div>

                {item.duration_minutes && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-muted/40 border border-border/30 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Süre</p>
                      <p className="font-bold text-foreground text-xs">{item.duration_minutes} dakika</p>
                    </div>
                  </div>
                )}

                {item.participant_count > 0 && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-muted/40 border border-border/30 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Katılımcı</p>
                      <p className="font-bold text-foreground text-xs">{item.participant_count} öğrenci</p>
                    </div>
                  </div>
                )}
              </div>

              {/* YouTube external link */}
              <a
                href={`https://www.youtube.com/watch?v=${item.youtube_video_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border/50 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                YouTube'da İzle
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
