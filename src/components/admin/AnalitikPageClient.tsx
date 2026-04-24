"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";
import {
  Chart,
  Profile2User,
  Cup,
  Grid5,
  ArrowLeft,
} from "iconsax-react";
import Link from "next/link";
import ExamAnalyticsCard from "@/components/admin/ExamAnalyticsCard";
import ExamDetailModal from "@/components/admin/ExamDetailModal";
import AchievementHeatmap from "@/components/admin/AchievementHeatmap";
import AdminPDFButton from "@/components/admin/AdminPDFButton";

interface ExamStat {
  id: string;
  title: string;
  durationMinutes: number;
  isPublished: boolean;
  createdAt: string;
  participants: number;
  avgScore: number;
  avgCorrect: number;
  avgWrong: number;
  maxScore: number;
  minScore: number;
}

interface Summary {
  totalExams: number;
  totalParticipants: number;
  globalAvgScore: number;
  bestExamTitle: string | null;
  bestExamAvgScore: number;
}

export default function AnalitikPageClient() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [examStats, setExamStats] = useState<ExamStat[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedExamTitle, setSelectedExamTitle] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "heatmap">("overview");

  useEffect(() => {
    fetch("/api/admin/analytics?type=exam-overview")
      .then((res) => res.json())
      .then((data) => {
        setSummary(data.summary || null);
        setExamStats(data.exams || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleExamClick = (examId: string, title: string) => {
    setSelectedExamId(examId);
    setSelectedExamTitle(title);
  };

  const summaryCards = summary
    ? [
        {
          label: "Toplam Sınav",
          value: summary.totalExams,
          icon: Chart,
          color: "text-primary",
          bg: "bg-primary/10 border-primary/20",
        },
        {
          label: "Toplam Katılımcı",
          value: summary.totalParticipants,
          icon: Profile2User,
          color: "text-blue-500",
          bg: "bg-blue-500/10 border-blue-500/20",
        },
        {
          label: "Genel Ort. Net",
          value: summary.globalAvgScore,
          icon: Grid5,
          color: "text-violet-500",
          bg: "bg-violet-500/10 border-violet-500/20",
        },
        {
          label: "En Başarılı Sınav",
          value: summary.bestExamAvgScore,
          subLabel: summary.bestExamTitle
            ? `${summary.bestExamTitle.slice(0, 20)}…`
            : "—",
          icon: Cup,
          color: "text-amber-500",
          bg: "bg-amber-500/10 border-amber-500/20",
        },
      ]
    : [];

  return (
    <div className="p-6 lg:p-10 pb-24 lg:pb-10 relative z-10 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link
          href="/admin"
          className="w-10 h-10 rounded-full bg-input/50 border border-border/50 flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" variant="Outline" />
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Chart className="w-6 h-6 text-primary" variant="Bulk" />
            <h1 className="text-3xl font-heading font-extrabold text-foreground">
              Analitik
            </h1>
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            Sınav başarı analizleri, kazanım takibi ve performans raporları.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {summaryCards.map((card, idx) => (
              <m.div
                key={card.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: idx * 0.08,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`rounded-[1.25rem] border ${card.bg} backdrop-blur-xl p-5`}
              >
                <card.icon
                  className={`w-5 h-5 ${card.color} mb-2`}
                  variant="Bulk"
                />
                <p className="font-heading font-black text-2xl text-foreground">
                  {card.value}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                  {card.label}
                </p>
                {"subLabel" in card && card.subLabel && (
                  <p className="text-[10px] font-medium text-muted-foreground mt-1 truncate">
                    {card.subLabel}
                  </p>
                )}
              </m.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl text-sm font-heading font-bold transition-all ${
                activeTab === "overview"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              Sınav Analizi
            </button>
            <button
              onClick={() => setActiveTab("heatmap")}
              className={`px-4 py-2 rounded-xl text-sm font-heading font-bold transition-all ${
                activeTab === "heatmap"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              Kazanım Isı Haritası
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" ? (
            <div>
              {examStats.length === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-primary/20 bg-primary/5 p-16 text-center">
                  <Chart
                    className="w-12 h-12 mx-auto mb-4 text-primary opacity-20"
                    variant="Bulk"
                  />
                  <p className="font-heading font-bold text-foreground text-lg">
                    Henüz analiz verisi yok
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sınavlar tamamlandığında burada istatistikler görünecek.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {examStats.map((exam, idx) => (
                    <div key={exam.id} className="relative">
                      <ExamAnalyticsCard
                        examTitle={exam.title}
                        participants={exam.participants}
                        avgScore={exam.avgScore}
                        avgCorrect={exam.avgCorrect}
                        avgWrong={exam.avgWrong}
                        maxScore={exam.maxScore}
                        minScore={exam.minScore}
                        isPublished={exam.isPublished}
                        index={idx}
                        onClick={() => handleExamClick(exam.id, exam.title)}
                      />
                      {/* PDF download on card */}
                      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <AdminPDFButton
                          examId={exam.id}
                          examTitle={exam.title}
                          className="!px-2 !py-1.5 !text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <AchievementHeatmap />
          )}
        </>
      )}

      {/* Exam Detail Modal */}
      <ExamDetailModal
        examId={selectedExamId}
        examTitle={selectedExamTitle}
        onClose={() => setSelectedExamId(null)}
      />
    </div>
  );
}
