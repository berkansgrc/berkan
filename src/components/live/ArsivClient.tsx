"use client";

import { useState, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Play, Calendar, Clock, Users, Search, Trash2, X, ChevronDown } from "lucide-react";
import type { ArchiveItem } from "@/app/canli-ders/arsiv/page";

const LEVELS = ["Tümü", "TYT", "AYT", "10. Sınıf", "11. Sınıf", "12. Sınıf", "Geometri", "Diğer"];

interface ArsivClientProps {
  items: ArchiveItem[];
  isAdmin: boolean;
}

export default function ArsivClient({ items, isAdmin }: ArsivClientProps) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("Tümü");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [localItems, setLocalItems] = useState<ArchiveItem[]>(items);

  const filtered = useMemo(() => {
    return localItems.filter((item) => {
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.description?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (item.topic_tags?.some((t) => t.toLowerCase().includes(search.toLowerCase())) ?? false);
      const matchesLevel =
        levelFilter === "Tümü" || item.level === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [localItems, search, levelFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu dersi arşivden kaldırmak istediğinize emin misiniz?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/live-archive?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLocalItems((prev) => prev.filter((item) => item.id !== id));
        if (activeVideoId === localItems.find((i) => i.id === id)?.youtube_video_id) {
          setActiveVideoId(null);
        }
      }
    } catch {
      /* ignore */
    } finally {
      setDeletingId(null);
    }
  };

  const openPlayer = (item: ArchiveItem) => {
    setActiveVideoId(item.youtube_video_id);
    setActiveTitle(item.title);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* In-App Player */}
      <AnimatePresence>
        {activeVideoId && (
          <m.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[2rem] overflow-hidden border border-primary/20 bg-card/80 backdrop-blur-xl shadow-2xl"
          >
            {/* Player Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50 bg-primary/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-heading font-black text-sm text-foreground truncate max-w-xs">
                  {activeTitle}
                </span>
              </div>
              <button
                onClick={() => setActiveVideoId(null)}
                className="p-1.5 rounded-lg hover:bg-background/50 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            {/* Embed */}
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Başlık veya konu ara..."
            className="w-full h-11 bg-card/60 border border-border/60 hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl pl-9 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 outline-none transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted/50"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Level Filter */}
        <div className="relative">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="h-11 bg-card/60 border border-border/60 hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl px-4 pr-9 text-sm font-bold text-foreground outline-none transition-all appearance-none cursor-pointer"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Results Count */}
      {(search || levelFilter !== "Tümü") && (
        <p className="text-xs font-bold text-muted-foreground">
          {filtered.length} sonuç bulundu
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-[2rem] border border-border/50 bg-card/60 backdrop-blur-xl p-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
            <Play className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="font-heading font-black text-lg text-foreground">
            {localItems.length === 0 ? "Henüz arşivlenmiş ders yok" : "Aramanızla eşleşen ders bulunamadı"}
          </p>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            {localItems.length === 0
              ? "Canlı dersler tamamlandıktan sonra burada arşivlenecek."
              : "Farklı anahtar kelimeler veya filtreler deneyin."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filtered.map((item, idx) => {
              const archivedDate = new Date(item.archived_at);
              const dateStr = archivedDate.toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });
              const isPlaying = activeVideoId === item.youtube_video_id;

              return (
                <m.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={`rounded-[1.5rem] border bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group ${
                    isPlaying
                      ? "border-primary/40 shadow-[0_0_20px_rgba(0,103,98,0.1)]"
                      : "border-border/50 hover:border-primary/20"
                  }`}
                >
                  {/* Video Thumbnail */}
                  <div className="aspect-video relative bg-gradient-to-br from-background to-muted/30 overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${item.youtube_video_id}/hqdefault.jpg`}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                    {/* Play overlay */}
                    <button
                      onClick={() => openPlayer(item)}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform ${
                        isPlaying ? "bg-primary text-primary-foreground" : "bg-white/90"
                      }`}>
                        <Play className={`w-6 h-6 ml-0.5 ${isPlaying ? "text-white" : "text-foreground"}`} />
                      </div>
                    </button>

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

                    {/* Admin delete */}
                    {isAdmin && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                        disabled={deletingId === item.id}
                        className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 disabled:opacity-50"
                        title="Arşivden Kaldır"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <Link href={`/canli-ders/arsiv/${item.id}`}>
                      <h3 className="font-heading font-black text-foreground text-base mb-1 line-clamp-2 hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                    </Link>
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
                </m.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
