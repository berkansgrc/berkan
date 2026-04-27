"use client";

import { useState } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import {
  Global,
  Lock1,
  Clock,
  Edit2,
  Category,
  Eye,
  Copy,
} from "iconsax-react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import DeleteExamButton from "@/components/admin/DeleteExamButton";
import QuickPreviewDrawer from "@/components/admin/QuickPreviewDrawer";

interface Exam {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  access_mode: string;
  is_published: boolean;
  share_code: string | null;
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

interface ExamListClientProps {
  exams: Exam[];
}

export default function ExamListClient({ exams }: ExamListClientProps) {
  const [previewExam, setPreviewExam] = useState<Exam | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDuplicate = async (examId: string) => {
    setDuplicatingId(examId);
    try {
      const res = await fetch(`/api/admin/exams/${examId}/duplicate`, { method: "POST" });
      if (res.ok) router.refresh();
      else alert("Kopyalama başarısız.");
    } catch {
      alert("Bir hata oluştu.");
    } finally {
      setDuplicatingId(null);
    }
  };

  if (!exams || exams.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-primary/20 bg-primary/5 p-16 text-center text-muted-foreground flex flex-col items-center justify-center md:min-h-[400px]">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20 shadow-sm">
          <Category
            className="w-8 h-8 text-primary opacity-80"
            variant="Bold"
          />
        </div>
        <p className="text-2xl font-heading font-bold text-foreground">
          Henüz sınav oluşturmadınız.
        </p>
        <p className="text-base mt-2 max-w-sm">
          Sağ üstteki &quot;Yeni Sınav Oluştur&quot; butonuna tıklayarak ilk
          interaktif sınavını hazırla.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {exams.map((exam, idx) => (
          <m.div
            key={exam.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: idx * 0.05,
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group flex flex-col justify-between rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-6 hover:shadow-[0_20px_40px_rgba(44,47,48,0.06)] hover:-translate-y-1 hover:border-border transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors pointer-events-none" />

            <div>
              <div className="flex justify-between items-start mb-4">
                {/* Yayın durumu */}
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                    exam.is_published
                      ? "bg-primary-container/30 text-primary-fixed-variant border border-primary/20"
                      : "bg-surface-variant text-on-surface-variant border border-border"
                  }`}
                >
                  {exam.is_published ? "Yayında" : "Taslak"}
                </span>

                {/* Erişim */}
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-input/40 px-2.5 py-1 rounded-full border border-border/50">
                  {exam.access_mode === "public" ? (
                    <>
                      <Global
                        className="h-3 w-3 text-secondary"
                        variant="Outline"
                      />
                      Açık Sınav
                    </>
                  ) : (
                    <>
                      <Lock1
                        className="h-3 w-3 text-tertiary-foreground"
                        variant="Outline"
                      />
                      Gizli Sınav
                    </>
                  )}
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl text-foreground line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">
                {exam.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-6">
                {exam.description || "Açıklama bulunmuyor."}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6 font-medium">
                <span className="flex items-center gap-1.5 bg-input/50 px-3 py-1.5 rounded-lg border border-border/50">
                  <Clock
                    className="h-4 w-4 text-primary"
                    variant="Outline"
                  />
                  {exam.duration_minutes} Dk
                </span>
                {exam.share_code && (
                  <span className="flex items-center justify-between gap-2 font-mono text-xs bg-primary/5 text-primary px-3 py-1.5 rounded-lg border border-primary/20 font-bold tracking-widest">
                    {exam.share_code}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto gap-2">
              <Link href={`/admin/exams/${exam.id}/edit`} className="flex-1">
                <button className="w-full flex items-center justify-center gap-2 bg-input/40 hover:bg-primary-container/20 border border-border hover:border-primary/30 text-foreground font-heading font-bold text-sm h-11 rounded-xl shadow-sm transition-all group/edit">
                  <Edit2
                    className="h-4 w-4 text-primary group-hover/edit:rotate-12 transition-transform"
                    variant="Bold"
                  />
                  Düzenle
                </button>
              </Link>
              <button
                onClick={() => setPreviewExam(exam)}
                className="flex items-center justify-center gap-1.5 px-3 h-11 rounded-xl border border-border/50 bg-input/30 hover:bg-primary/5 hover:border-primary/20 text-muted-foreground hover:text-primary font-heading font-bold text-sm transition-all active:scale-95"
                title="Hızlı Önizle"
              >
                <Eye className="h-4 w-4" variant="Outline" />
                <span className="hidden sm:inline">Önizle</span>
              </button>
              <button
                onClick={() => handleDuplicate(exam.id)}
                disabled={duplicatingId === exam.id}
                className="flex items-center justify-center gap-1.5 px-3 h-11 rounded-xl border border-border/50 bg-input/30 hover:bg-amber-500/5 hover:border-amber-500/20 text-muted-foreground hover:text-amber-600 font-heading font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
                title="Kopyasını Oluştur"
              >
                {duplicatingId === exam.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Copy className="h-4 w-4" variant="Outline" />
                )}
                <span className="hidden sm:inline">Kopya</span>
              </button>
              <div className="pl-2 border-l border-border/50 flex items-center">
                <DeleteExamButton examId={exam.id} />
              </div>
            </div>

          </m.div>
        ))}
      </div>

      {/* Quick Preview Drawer */}
      <QuickPreviewDrawer
        exam={previewExam}
        onClose={() => setPreviewExam(null)}
      />
    </>
  );
}
