"use client";

import { useState, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { People, Profile, Clock, Chart, ArrowDown2 } from "iconsax-react";
import { Loader2 } from "lucide-react";

interface AttendanceRecord {
  id: string;
  user_id: string;
  lesson_id: string;
  joined_at: string;
  left_at: string | null;
  profiles: { full_name: string | null } | null;
}

interface Stats {
  totalParticipants: number;
  avgDurationSeconds: number;
  avgDurationFormatted: string;
}

export default function AttendanceHistoryPanel() {
  const [lessonIds, setLessonIds] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Tüm ders ID'lerini çek
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch("/api/live/attendance");
        if (res.ok) {
          const data = await res.json();
          setLessonIds(data.lessonIds ?? []);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  // Belirli bir dersin katılımını çek
  const fetchDetail = useCallback(async (lessonId: string) => {
    setDetailLoading(true);
    setAttendance([]);
    setStats(null);
    try {
      const res = await fetch(
        `/api/live/attendance?lessonId=${encodeURIComponent(lessonId)}`
      );
      if (res.ok) {
        const data = await res.json();
        setAttendance(data.attendance ?? []);
        setStats(data.stats ?? null);
      }
    } catch {
      /* ignore */
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleSelect = (lessonId: string) => {
    setSelectedLesson(lessonId);
    fetchDetail(lessonId);
    setOpen(false);
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const calcDuration = (joined: string, left: string | null): string => {
    const end = left ? new Date(left) : new Date();
    const seconds = Math.round(
      (end.getTime() - new Date(joined).getTime()) / 1000
    );
    if (seconds < 60) return `${seconds}sn`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}dk`;
    return `${Math.floor(mins / 60)}sa ${mins % 60}dk`;
  };

  return (
    <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Chart className="w-4 h-4 text-primary" variant="Bulk" />
          <h3 className="font-heading font-black text-sm text-foreground">
            Katılım Geçmişi
          </h3>
          {lessonIds.length > 0 && (
            <span className="text-[10px] font-black bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
              {lessonIds.length} ders
            </span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : lessonIds.length === 0 ? (
          <div className="py-8 text-center">
            <People className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" variant="Bulk" />
            <p className="text-xs font-bold text-muted-foreground">
              Henüz katılım kaydı yok
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
              Öğrenciler canlı derse katıldığında burada görünecek.
            </p>
          </div>
        ) : (
          <>
            {/* Ders Seçici */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20 hover:border-primary/30 transition-colors text-left"
              >
                <span className="text-sm font-bold text-foreground truncate">
                  {selectedLesson ?? "Ders seçin..."}
                </span>
                <ArrowDown2
                  className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                  variant="Outline"
                />
              </button>

              <AnimatePresence>
                {open && (
                  <m.div
                    initial={{ opacity: 0, y: -8, scaleY: 0.9 }}
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: -8, scaleY: 0.9 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-0 right-0 mt-1 z-20 bg-card border border-border/50 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto"
                  >
                    {lessonIds.map((id) => (
                      <button
                        key={id}
                        onClick={() => handleSelect(id)}
                        className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-primary/5 transition-colors border-b border-border/20 last:border-0 ${
                          selectedLesson === id
                            ? "text-primary bg-primary/5"
                            : "text-foreground"
                        }`}
                      >
                        {id}
                      </button>
                    ))}
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            {/* İstatistikler */}
            {stats && (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/20 p-3 text-center">
                  <p className="text-xl font-heading font-black text-foreground">
                    {stats.totalParticipants}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                    Katılımcı
                  </p>
                </div>
                <div className="rounded-xl bg-muted/20 p-3 text-center">
                  <p className="text-xl font-heading font-black text-foreground">
                    {stats.avgDurationFormatted || "—"}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                    Ort. Süre
                  </p>
                </div>
              </div>
            )}

            {/* Katılımcı Listesi */}
            {selectedLesson && (
              <div className="space-y-1 max-h-[260px] overflow-y-auto scrollbar-hide">
                {detailLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                ) : attendance.length === 0 ? (
                  <p className="text-xs text-center text-muted-foreground py-4">
                    Bu ders için kayıt bulunamadı.
                  </p>
                ) : (
                  <AnimatePresence>
                    {attendance.map((record, idx) => (
                      <m.div
                        key={record.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.25 }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/10 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <Profile className="w-3.5 h-3.5 text-primary" variant="Bold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">
                            {record.profiles?.full_name || "Anonim"}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold">
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" variant="Outline" />
                              {formatTime(record.joined_at)}
                            </span>
                            <span className="text-muted-foreground/40">·</span>
                            <span>{formatDate(record.joined_at)}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md shrink-0">
                          {calcDuration(record.joined_at, record.left_at)}
                        </span>
                      </m.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
