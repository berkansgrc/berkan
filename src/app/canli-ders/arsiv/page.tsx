import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ArsivClient from "@/components/live/ArsivClient";
import { getCachedUser } from "@/utils/supabase/queries";

export const metadata = {
  title: "Ders Arşivi | Berkan Matematik",
  description: "Geçmiş canlı dersleri izleyin — Berkan Matematik ders arşivi.",
};

export const revalidate = 120;

export interface ArchiveItem {
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
  const [user, { data: archives }] = await Promise.all([
    getCachedUser(),
    supabase
      .from("live_archive")
      .select("*")
      .order("archived_at", { ascending: false }),
  ]);

  // Admin kontrolü
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

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

        {/* Client Component — arama, filtreleme, player, silme */}
        <ArsivClient items={items} isAdmin={isAdmin} />
      </div>
    </div>
  );
}
