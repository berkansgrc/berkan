"use client";

import { useState, useCallback } from "react";
import { m } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft2,
  VideoPlay,
  Chart,
  MessageQuestion,
  People,
  Wifi,
  CloseCircle,
  TickCircle,
  Archive,
} from "iconsax-react";
import { Loader2 } from "lucide-react";
import AdminPresencePanel from "@/components/admin/AdminPresencePanel";
import PollResultsPanel from "@/components/admin/PollResultsPanel";
import ArchiveLessonButton from "@/components/admin/ArchiveLessonButton";

interface LiveStreamConfig {
  id?: string;
  youtube_video_id?: string | null;
  youtube_chat_id?: string | null;
  is_live?: boolean;
  lesson_title?: string | null;
  lesson_description?: string | null;
  scheduled_at?: string | null;
  viewer_count?: number | null;
}

// Quick poll templates
const QUICK_POLLS = [
  {
    question: "Bu konuyu anladınız mı?",
    options: [
      { label: "A", text: "Evet, anladım" },
      { label: "B", text: "Kısmen anladım" },
      { label: "C", text: "Hayır, tekrar anlatır mısınız?" },
    ],
  },
  {
    question: "Devam edelim mi?",
    options: [
      { label: "A", text: "Evet, devam" },
      { label: "B", text: "Biraz daha pratik yapalım" },
    ],
  },
  {
    question: "Zorluk seviyesi nasıldı?",
    options: [
      { label: "A", text: "Kolaydı" },
      { label: "B", text: "Orta seviye" },
      { label: "C", text: "Zordu" },
      { label: "D", text: "Çok zordu" },
    ],
  },
];

export default function LiveDashboardClient({
  initialConfig,
}: {
  initialConfig: LiveStreamConfig | null;
}) {
  const [isLive, setIsLive] = useState(initialConfig?.is_live ?? false);
  const [toggling, setToggling] = useState(false);
  const [pollCreating, setPollCreating] = useState(false);
  const [pollSuccess, setPollSuccess] = useState(false);
  const [questions, setQuestions] = useState<
    { id: string; question: string; user_name: string; upvotes: number; is_answered: boolean }[]
  >([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  const youtubeId = initialConfig?.youtube_video_id ?? null;
  const lessonTitle = initialConfig?.lesson_title ?? "Canlı Ders";
  const lessonDescription = initialConfig?.lesson_description ?? "";

  // Toggle live status
  const toggleLive = useCallback(async () => {
    setToggling(true);
    try {
      await fetch("/api/admin/live-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...initialConfig,
          is_live: !isLive,
        }),
      });
      setIsLive(!isLive);
    } catch {
      /* ignore */
    } finally {
      setToggling(false);
    }
  }, [isLive, initialConfig]);

  // Quick poll creation
  const createQuickPoll = useCallback(
    async (poll: (typeof QUICK_POLLS)[0]) => {
      setPollCreating(true);
      setPollSuccess(false);
      try {
        const res = await fetch("/api/admin/live-polls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(poll),
        });
        if (res.ok) {
          setPollSuccess(true);
          setTimeout(() => setPollSuccess(false), 3000);
        }
      } catch {
        /* ignore */
      } finally {
        setPollCreating(false);
      }
    },
    []
  );

  // Fetch questions
  const fetchQuestions = useCallback(async () => {
    setQuestionsLoading(true);
    try {
      const res = await fetch("/api/live/questions");
      if (res.ok) {
        // Questions API doesn't have a GET, so we'll use the realtime approach
        // For now, show placeholder
      }
    } catch {
      /* ignore */
    } finally {
      setQuestionsLoading(false);
    }
  }, []);

  // Mark question as answered
  const markAnswered = useCallback(async (questionId: string) => {
    try {
      await fetch("/api/live/questions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, action: "answer" }),
      });
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, is_answered: true } : q))
      );
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/canli-ders"
            className="w-9 h-9 rounded-xl bg-input/50 border border-border/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft2 className="w-4 h-4 text-muted-foreground" variant="Outline" />
          </Link>
          <div>
            <h1 className="text-xl font-heading font-extrabold text-foreground">
              Canlı Kontrol Paneli
            </h1>
            <p className="text-xs text-muted-foreground font-bold">
              {lessonTitle}
            </p>
          </div>
        </div>

        {/* Live toggle */}
        <button
          onClick={toggleLive}
          disabled={toggling}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-bold text-xs transition-all hover:-translate-y-0.5 ${
            isLive
              ? "bg-red-500 text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)]"
              : "bg-emerald-500 text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)]"
          }`}
        >
          {toggling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isLive ? (
            <CloseCircle className="w-4 h-4" variant="Bold" />
          ) : (
            <Wifi className="w-4 h-4" variant="Bold" />
          )}
          {isLive ? "Yayını Kapat" : "Yayını Aç"}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Video + Quick Polls */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Preview */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm"
          >
            <div className="px-5 py-3 border-b border-border/50 flex items-center gap-2">
              <VideoPlay className="w-4 h-4 text-primary" variant="Bulk" />
              <span className="font-heading font-black text-sm text-foreground">
                Yayın Önizleme
              </span>
              {isLive && (
                <span className="ml-auto flex items-center gap-1.5 text-[10px] font-black uppercase text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  CANLI
                </span>
              )}
            </div>
            {isLive && youtubeId ? (
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&mute=1&rel=0&modestbranding=1`}
                  title="Live Preview"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-muted/20">
                <div className="text-center">
                  <VideoPlay className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" variant="Bulk" />
                  <p className="text-sm font-bold text-muted-foreground">
                    {youtubeId ? "Yayın başlatılmadı" : "YouTube ID ayarlanmamış"}
                  </p>
                </div>
              </div>
            )}
          </m.div>

          {/* Quick Polls */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Chart className="w-4 h-4 text-primary" variant="Bulk" />
              <h3 className="font-heading font-black text-sm text-foreground">
                Hızlı Anket
              </h3>
              {pollSuccess && (
                <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                  <TickCircle className="w-3 h-3" variant="Bold" />
                  Anket oluşturuldu!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {QUICK_POLLS.map((poll, idx) => (
                <button
                  key={idx}
                  onClick={() => createQuickPoll(poll)}
                  disabled={pollCreating}
                  className="text-left p-3 rounded-xl border border-border/50 bg-muted/10 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <p className="text-xs font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                    {poll.question}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {poll.options.map((opt) => (
                      <span
                        key={opt.label}
                        className="text-[9px] font-bold bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded"
                      >
                        {opt.label}: {opt.text}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </m.div>

          {/* Poll Results */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PollResultsPanel />
          </m.div>

          {/* Archive Button */}
          {youtubeId && (
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ArchiveLessonButton
                title={lessonTitle}
                description={lessonDescription}
                youtubeVideoId={youtubeId}
              />
            </m.div>
          )}
        </div>

        {/* Right Column: Presence + Questions */}
        <div className="space-y-4">
          {/* Presence Panel */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <AdminPresencePanel />
          </m.div>

          {/* Question Moderation */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm"
          >
            <div className="px-5 py-3.5 border-b border-border/50 flex items-center gap-2">
              <MessageQuestion className="w-4 h-4 text-primary" variant="Bulk" />
              <h3 className="font-heading font-black text-sm text-foreground">
                Soru Moderasyonu
              </h3>
            </div>

            <div className="p-5">
              <p className="text-xs text-muted-foreground font-medium text-center py-6">
                Öğrenci soruları canlı ders ekranındaki{" "}
                <Link
                  href="/dashboard/canli-ders"
                  className="text-primary font-bold hover:underline"
                >
                  Soru Kuyruğu
                </Link>{" "}
                üzerinden gelir. Cevaplanmamış soruları buradan takip edebilirsiniz.
              </p>

              <Link
                href="/admin/canli-ders"
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-primary hover:text-primary/80 border border-primary/20 bg-primary/5 py-2.5 rounded-xl transition-colors"
              >
                <MessageQuestion className="w-3.5 h-3.5" variant="Outline" />
                Tam Yönetim Paneline Git
              </Link>
            </div>
          </m.div>

          {/* Quick Stats */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-5 shadow-sm"
          >
            <h3 className="font-heading font-black text-sm text-foreground mb-3">
              Durum
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20">
                <span className="text-xs font-bold text-muted-foreground">Yayın</span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    isLive
                      ? "bg-red-500/10 border-red-500/30 text-red-500"
                      : "bg-muted border-border text-muted-foreground"
                  }`}
                >
                  {isLive ? "CANLI" : "KAPALI"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20">
                <span className="text-xs font-bold text-muted-foreground">YouTube ID</span>
                <span className="text-[10px] font-bold text-foreground font-mono">
                  {youtubeId || "—"}
                </span>
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </div>
  );
}
