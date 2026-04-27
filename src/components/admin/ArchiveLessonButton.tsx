"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Archive, TickCircle, Danger, Add } from "iconsax-react";
import { Loader2 } from "lucide-react";

interface ArchiveLessonButtonProps {
  title: string;
  description: string;
  youtubeVideoId: string;
  lessonId?: string; // Katılım verisini çekmek için
}

const LEVELS = ["TYT", "AYT", "10. Sınıf", "11. Sınıf", "12. Sınıf", "Geometri", "Diğer"];

export default function ArchiveLessonButton({
  title,
  description,
  youtubeVideoId,
  lessonId,
}: ArchiveLessonButtonProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [level, setLevel] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [loadingCount, setLoadingCount] = useState(false);

  // Otomatik katılımcı sayısı çek
  useEffect(() => {
    if (!lessonId) return;
    const fetchCount = async () => {
      setLoadingCount(true);
      try {
        const res = await fetch(
          `/api/live/attendance?lessonId=${encodeURIComponent(lessonId)}`
        );
        if (res.ok) {
          const data = await res.json();
          setParticipantCount(data.stats?.totalParticipants ?? 0);
        }
      } catch {
        /* ignore */
      } finally {
        setLoadingCount(false);
      }
    };
    fetchCount();
  }, [lessonId]);

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleArchive = async () => {
    if (!youtubeVideoId) {
      setError("YouTube Video ID gerekli.");
      return;
    }
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/admin/live-archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "Canlı Ders",
          description: description || null,
          youtube_video_id: youtubeVideoId,
          level: level || null,
          topic_tags: tags,
          duration_minutes: durationMinutes ? parseInt(durationMinutes) : null,
          participant_count: participantCount,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      } else {
        const data = await res.json();
        setError(data.error || "Arşivleme başarısız.");
      }
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full h-10 bg-input/50 border border-border/60 hover:border-amber-500/40 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 rounded-xl px-3 text-sm transition-all outline-none font-medium text-foreground placeholder:text-muted-foreground/60";

  return (
    <div className="rounded-[1.25rem] border border-amber-500/20 bg-amber-500/5 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Archive className="w-5 h-5 text-amber-500" variant="Bulk" />
        <h3 className="font-heading font-black text-sm text-foreground">Dersi Arşivle</h3>
      </div>

      <p className="text-xs text-muted-foreground font-medium">
        Bu dersi arşivlediğinizde öğrenciler sonradan izleyebilecek.
      </p>

      {/* Süre + Seviye */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
            Süre (dk)
          </label>
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            placeholder="90"
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
            Seviye
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className={inputClass + " cursor-pointer"}
          >
            <option value="">Seçin...</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Otomatik katılımcı sayısı */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium p-2.5 rounded-lg bg-muted/20 border border-border/30">
        {loadingCount ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <span className="font-black text-foreground">{participantCount}</span>
        )}
        <span>katılımcı (otomatik hesaplandı)</span>
      </div>

      {/* Konu Etiketleri */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
          Konu Etiketleri
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="Türev, integral..."
            className={inputClass + " flex-1"}
          />
          <button
            onClick={addTag}
            disabled={!tagInput.trim()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors disabled:opacity-40"
          >
            <Add className="w-4 h-4 text-amber-500" variant="Outline" />
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-lg cursor-pointer hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-colors"
                onClick={() => removeTag(tag)}
                title="Kaldırmak için tıkla"
              >
                {tag} ×
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <AnimatePresence>
        {error && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 text-xs font-bold text-destructive"
          >
            <Danger className="w-3 h-3" variant="Bold" />
            {error}
          </m.div>
        )}
        {saved && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-500"
          >
            <TickCircle className="w-3 h-3" variant="Bold" />
            Ders arşive eklendi!
          </m.div>
        )}
      </AnimatePresence>

      {/* Archive Button */}
      <button
        onClick={handleArchive}
        disabled={saving || !youtubeVideoId}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-amber-500 to-amber-600 text-white font-heading font-bold text-xs py-3 rounded-xl shadow-[0_6px_12px_rgba(245,158,11,0.2)] hover:shadow-[0_8px_16px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Arşivleniyor...</>
        ) : (
          <><Archive className="w-4 h-4" variant="Bold" /> Arşive Ekle</>
        )}
      </button>
    </div>
  );
}
