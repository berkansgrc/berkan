"use client";

import { useState, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  CloseCircle,
  Clock,
  Book,
  Edit2,
  Chart,
  ArrowRight2,
  Danger,
  TickCircle,
  MessageQuestion,
} from "iconsax-react";

interface ExamPreviewData {
  id: string;
  title: string;
  description?: string | null;
  duration_minutes: number;
  is_published: boolean;
  created_at: string;
  questions: {
    id: string;
    body: string;
    correct_option: string;
    order_index: number;
    achievement?: string | null;
  }[];
  _resultCount?: number;
}

interface QuickPreviewDrawerProps {
  exam: ExamPreviewData | null;
  onClose: () => void;
}

export default function QuickPreviewDrawer({
  exam,
  onClose,
}: QuickPreviewDrawerProps) {
  // Close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (exam) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [exam, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (exam) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [exam]);

  return (
    <AnimatePresence>
      {exam && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[90]"
            onClick={onClose}
          />

          {/* Drawer */}
          <m.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[91] bg-card/95 backdrop-blur-3xl border-l border-border/50 shadow-2xl shadow-black/10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5 text-primary" variant="Bulk" />
                <h2 className="font-heading font-black text-base text-foreground">
                  Sınav Önizleme
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all active:scale-95"
              >
                <CloseCircle className="w-5 h-5" variant="Outline" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {/* Title & Status */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-heading font-black text-xl text-foreground leading-tight">
                    {exam.title}
                  </h3>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                      exam.is_published
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}
                  >
                    {exam.is_published ? (
                      <>
                        <TickCircle className="w-3 h-3" variant="Bold" /> Yayında
                      </>
                    ) : (
                      <>
                        <Danger className="w-3 h-3" variant="Bold" /> Taslak
                      </>
                    )}
                  </span>
                </div>
                {exam.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                    {exam.description}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Soru Sayısı",
                    value: exam.questions.length,
                    icon: MessageQuestion,
                    color: "text-violet-500",
                    bg: "bg-violet-500/10 border-violet-500/20",
                  },
                  {
                    label: "Süre",
                    value: `${exam.duration_minutes}dk`,
                    icon: Clock,
                    color: "text-blue-500",
                    bg: "bg-blue-500/10 border-blue-500/20",
                  },
                  {
                    label: "Katılımcı",
                    value: exam._resultCount ?? "—",
                    icon: Chart,
                    color: "text-emerald-500",
                    bg: "bg-emerald-500/10 border-emerald-500/20",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-[1rem] border ${stat.bg} p-3.5 text-center`}
                  >
                    <stat.icon
                      className={`w-4 h-4 mx-auto mb-1.5 ${stat.color}`}
                      variant="Bulk"
                    />
                    <p className="font-heading font-black text-lg text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Questions Preview */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-3">
                  İlk {Math.min(5, exam.questions.length)} Soru
                </p>
                <div className="space-y-2">
                  {exam.questions
                    .sort((a, b) => a.order_index - b.order_index)
                    .slice(0, 5)
                    .map((q, idx) => (
                      <m.div
                        key={q.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        className="rounded-xl bg-muted/30 border border-border/40 px-4 py-3"
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5">
                            {q.order_index}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground line-clamp-2 font-medium">
                              {q.body}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                Doğru: {q.correct_option}
                              </span>
                              {q.achievement && (
                                <span className="text-[10px] font-bold text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
                                  {q.achievement}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </m.div>
                    ))}
                  {exam.questions.length > 5 && (
                    <p className="text-center text-[11px] text-muted-foreground font-bold py-2">
                      +{exam.questions.length - 5} soru daha...
                    </p>
                  )}
                </div>
              </div>

              {/* Kazanımlar */}
              {exam.questions.some((q) => q.achievement) && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-3">
                    Kazanımlar
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      ...new Set(
                        exam.questions
                          .map((q) => q.achievement)
                          .filter(Boolean) as string[]
                      ),
                    ].map((ach) => (
                      <span
                        key={ach}
                        className="text-[11px] font-bold text-primary bg-primary/5 border border-primary/10 px-2.5 py-1 rounded-full"
                      >
                        {ach}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-border/50 bg-muted/5 flex items-center gap-3">
              <Link
                href={`/admin/exams/${exam.id}/edit`}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-bold text-sm py-3 rounded-xl shadow-[0_8px_16px_rgba(0,103,98,0.2)] hover:shadow-[0_12px_24px_rgba(0,103,98,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all"
              >
                <Edit2 className="w-4 h-4" variant="Bold" />
                Düzenle
              </Link>
              <Link
                href={`/admin/analitik?exam=${exam.id}`}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border/50 bg-card hover:bg-muted/30 text-foreground font-heading font-bold text-sm transition-all hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <Chart className="w-4 h-4" variant="Outline" />
                Sonuçlar
                <ArrowRight2 className="w-3.5 h-3.5" variant="Outline" />
              </Link>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
