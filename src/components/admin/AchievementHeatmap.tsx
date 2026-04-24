"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";

interface HeatmapCell {
  achievement: string;
  examId: string;
  examTitle: string;
  correctRate: number;
  participantCount: number;
}

interface HeatmapProps {
  className?: string;
}

function getCellColor(rate: number): string {
  if (rate >= 80) return "bg-emerald-500";
  if (rate >= 60) return "bg-emerald-400/70";
  if (rate >= 40) return "bg-amber-400/70";
  if (rate >= 20) return "bg-orange-500/70";
  return "bg-red-500/70";
}

function getCellTextColor(rate: number): string {
  if (rate >= 60) return "text-white";
  return "text-white";
}

export default function AchievementHeatmap({ className }: HeatmapProps) {
  const [heatmap, setHeatmap] = useState<HeatmapCell[]>([]);
  const [exams, setExams] = useState<{ id: string; title: string }[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics?type=achievement-heatmap")
      .then((res) => res.json())
      .then((data) => {
        setHeatmap(data.heatmap || []);
        setExams(data.exams || []);
        setAchievements(data.achievements || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getCell = (achievement: string, examId: string): HeatmapCell | undefined => {
    return heatmap.find(
      (h) => h.achievement === achievement && h.examId === examId
    );
  };

  const handleCellHover = (
    e: React.MouseEvent,
    cell: HeatmapCell | undefined,
    achievement: string,
    examTitle: string
  ) => {
    if (!cell) {
      setTooltip({
        text: `${achievement} → ${examTitle}: Veri yok`,
        x: e.clientX,
        y: e.clientY,
      });
      return;
    }
    setTooltip({
      text: `${achievement} → ${examTitle}: %${cell.correctRate} başarı (${cell.participantCount} öğrenci)`,
      x: e.clientX,
      y: e.clientY,
    });
  };

  if (loading) {
    return (
      <div className={`rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-8 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (achievements.length === 0 || exams.length === 0) {
    return (
      <div className={`rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-8 text-center ${className}`}>
        <p className="text-muted-foreground text-sm font-medium">
          Isı haritası için yeterli kazanım verisi yok. Sınavlara kazanım
          ataması yapıldığında burada görünecek.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-6 relative ${className}`}>
      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-[200] bg-foreground text-background text-[11px] font-bold px-3 py-2 rounded-lg shadow-lg pointer-events-none max-w-xs whitespace-nowrap"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 10,
          }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Scrollable Grid */}
      <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 pb-3 pr-4 w-40">
                Kazanım
              </th>
              {exams.map((exam) => (
                <th
                  key={exam.id}
                  className="text-center text-[9px] font-black uppercase tracking-wider text-muted-foreground/50 pb-3 px-1"
                  style={{ minWidth: 50 }}
                >
                  <span className="line-clamp-2 block leading-tight">
                    {exam.title.length > 12
                      ? exam.title.slice(0, 10) + "…"
                      : exam.title}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {achievements.map((ach, rowIdx) => (
              <tr key={ach}>
                <td className="text-xs font-bold text-foreground pr-4 py-1 truncate max-w-[160px]">
                  {ach}
                </td>
                {exams.map((exam, colIdx) => {
                  const cell = getCell(ach, exam.id);
                  return (
                    <td key={exam.id} className="px-0.5 py-0.5">
                      <m.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: (rowIdx * exams.length + colIdx) * 0.01,
                          duration: 0.3,
                        }}
                        className={`aspect-square rounded-lg flex items-center justify-center cursor-default transition-transform hover:scale-110 ${
                          cell
                            ? `${getCellColor(cell.correctRate)} ${getCellTextColor(cell.correctRate)}`
                            : "bg-muted/30 text-muted-foreground/30"
                        }`}
                        style={{ minWidth: 36, minHeight: 36 }}
                        onMouseMove={(e) =>
                          handleCellHover(e, cell, ach, exam.title)
                        }
                        onMouseLeave={() => setTooltip(null)}
                      >
                        <span className="text-[10px] font-black">
                          {cell ? `${cell.correctRate}` : "—"}
                        </span>
                      </m.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 mt-4 text-[9px] font-bold text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-500/70" /> 0-20%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-orange-500/70" /> 20-40%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-amber-400/70" /> 40-60%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-emerald-400/70" /> 60-80%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-emerald-500" /> 80-100%
        </span>
      </div>
    </div>
  );
}
