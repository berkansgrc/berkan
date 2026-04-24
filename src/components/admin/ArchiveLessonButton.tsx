"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Archive, TickCircle, Danger } from "iconsax-react";
import { Loader2 } from "lucide-react";

interface ArchiveLessonButtonProps {
  title: string;
  description: string;
  youtubeVideoId: string;
  level?: string;
  participantCount?: number;
}

export default function ArchiveLessonButton({
  title,
  description,
  youtubeVideoId,
  level,
  participantCount,
}: ArchiveLessonButtonProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");

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
          duration_minutes: durationMinutes ? parseInt(durationMinutes) : null,
          participant_count: participantCount || 0,
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

  return (
    <div className="rounded-[1.25rem] border border-amber-500/20 bg-amber-500/5 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Archive className="w-5 h-5 text-amber-500" variant="Bulk" />
        <h3 className="font-heading font-black text-sm text-foreground">
          Dersi Arşivle
        </h3>
      </div>

      <p className="text-xs text-muted-foreground font-medium">
        Bu dersi arşivlediğinizde öğrenciler sonradan izleyebilecek.
      </p>

      {/* Duration input */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value)}
          placeholder="Süre (dk)"
          className="w-24 h-9 bg-input/50 border border-border/60 rounded-lg px-3 text-xs font-bold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        />
        <span className="text-[10px] text-muted-foreground font-bold">dakika (opsiyonel)</span>
      </div>

      {/* Status messages */}
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

      {/* Archive button */}
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
