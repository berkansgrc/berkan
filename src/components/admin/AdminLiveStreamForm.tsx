"use client";

import { useState } from "react";
import { Save, Wifi, WifiOff, Loader2, CheckCircle2 } from "lucide-react";

interface LiveStreamConfig {
  id?: string;
  youtube_video_id?: string | null;
  youtube_chat_id?: string | null;
  is_live?: boolean;
  lesson_title?: string | null;
  lesson_description?: string | null;
  viewer_count?: number | null;
  scheduled_at?: string | null;
}

export default function AdminLiveStreamForm({ initialConfig }: { initialConfig: LiveStreamConfig | null }) {
  const [isLive, setIsLive] = useState(initialConfig?.is_live ?? false);
  const [youtubeVideoId, setYoutubeVideoId] = useState(initialConfig?.youtube_video_id ?? "");
  const [youtubeChatId, setYoutubeChatId] = useState(initialConfig?.youtube_chat_id ?? "");
  const [lessonTitle, setLessonTitle] = useState(initialConfig?.lesson_title ?? "");
  const [lessonDescription, setLessonDescription] = useState(initialConfig?.lesson_description ?? "");
  const [scheduledAt, setScheduledAt] = useState(
    initialConfig?.scheduled_at ? initialConfig.scheduled_at.slice(0, 16) : ""
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/live-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtube_video_id: youtubeVideoId,
          youtube_chat_id: youtubeChatId || youtubeVideoId,
          is_live: isLive,
          lesson_title: lessonTitle,
          lesson_description: lessonDescription,
          scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Bir hata oluştu.");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full h-12 bg-input/50 border border-border/60 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-[1rem] px-4 text-base transition-all outline-none font-medium text-foreground placeholder:text-muted-foreground/60";

  return (
    <div className="space-y-8">
      {/* Toggle: Is Live */}
      <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-7 shadow-sm space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-black text-xl text-foreground flex items-center gap-2">
              {isLive ? <Wifi className="w-5 h-5 text-red-500" /> : <WifiOff className="w-5 h-5 text-muted-foreground" />}
              Yayın Durumu
            </h2>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              {isLive ? "Şu an canlı yayın aktif — kullanıcılar görebilir." : "Yayın kapalı — kullanıcılar 'Çevrimdışı' görür."}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isLive}
              onChange={(e) => setIsLive(e.target.checked)}
            />
            <div className="w-14 h-8 bg-input border border-border/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500 peer-checked:border-red-500 shadow-inner" />
          </label>
        </div>
      </div>

      {/* YouTube Settings */}
      <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-7 shadow-sm space-y-5">
        <h2 className="font-heading font-black text-xl text-foreground flex items-center gap-2">
          <span className="w-2 h-6 rounded-full bg-primary inline-block" />
          YouTube Ayarları
        </h2>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-foreground">YouTube Video ID</label>
          <input
            className={inputClass}
            value={youtubeVideoId}
            onChange={(e) => setYoutubeVideoId(e.target.value)}
            placeholder="Örn: dQw4w9WgXcQ"
          />
          <p className="text-xs text-muted-foreground font-medium">
            YouTube linkindeki <code className="bg-muted px-1 rounded text-xs">v=</code> sonrasındaki kısım.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-foreground">Sohbet Video ID (opsiyonel)</label>
          <input
            className={inputClass}
            value={youtubeChatId}
            onChange={(e) => setYoutubeChatId(e.target.value)}
            placeholder="Boş bırakılırsa Video ID kullanılır"
          />
        </div>
      </div>

      {/* Lesson Info */}
      <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-7 shadow-sm space-y-5">
        <h2 className="font-heading font-black text-xl text-foreground flex items-center gap-2">
          <span className="w-2 h-6 rounded-full bg-secondary inline-block" />
          Ders Bilgisi
        </h2>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-foreground">Ders Başlığı</label>
          <input
            className={inputClass}
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            placeholder="Örn: TYT Türev — Soru Çözümü #14"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-foreground">Ders Açıklaması</label>
          <textarea
            className="w-full min-h-[100px] bg-input/50 border border-border/60 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-[1rem] px-4 py-3 text-base transition-all outline-none font-medium text-foreground placeholder:text-muted-foreground/60"
            value={lessonDescription}
            onChange={(e) => setLessonDescription(e.target.value)}
            placeholder="Bu derste hangi konular işlenecek?"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-foreground">Sonraki Ders Tarihi (opsiyonel)</label>
          <input
            type="datetime-local"
            className={inputClass}
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm font-bold text-destructive flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">!</div>
          {error}
        </div>
      )}

      {saved && (
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-sm font-bold text-primary flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          Ayarlar kaydedildi!
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-bold text-[15px] py-4 rounded-[1.25rem] shadow-[0_12px_24px_rgba(0,103,98,0.25)] hover:shadow-[0_16px_32px_rgba(0,103,98,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Kaydediliyor...</>
        ) : (
          <><Save className="w-5 h-5" /> Ayarları Kaydet</>
        )}
      </button>
    </div>
  );
}
