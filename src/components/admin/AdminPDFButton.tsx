"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { DocumentDownload } from "iconsax-react";

interface AdminPDFButtonProps {
  examId: string;
  examTitle: string;
  className?: string;
}

export default function AdminPDFButton({
  examId,
  examTitle,
  className,
}: AdminPDFButtonProps) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Fetch exam detail analytics
      const res = await fetch(
        `/api/admin/analytics?type=exam-detail&examId=${examId}`
      );
      const data = await res.json();

      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const margin = 15;
      let y = margin;

      // Helper: Türkçe -> ASCII
      const toAscii = (text: string) =>
        text
          .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
          .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
          .replace(/İ/g, "I").replace(/Ğ/g, "G").replace(/Ü/g, "U")
          .replace(/Ş/g, "S").replace(/Ö/g, "O").replace(/Ç/g, "C");

      // --- Title ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(toAscii("Sinav Analiz Raporu"), margin, y);
      y += 8;

      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(toAscii(examTitle), margin, y);
      y += 5;

      doc.setDrawColor(0, 103, 98);
      doc.setLineWidth(0.5);
      doc.line(margin, y, 210 - margin, y);
      y += 8;

      // --- Summary ---
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Toplam Katilimci: ${data.totalParticipants}`, margin, y);
      y += 6;
      doc.text(`Toplam Soru: ${data.questionStats?.length || 0}`, margin, y);
      y += 10;

      // --- Question Stats Table ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Soru Bazli Analiz", margin, y);
      y += 6;

      // Table header
      doc.setFillColor(230, 230, 250);
      doc.rect(margin, y, 180, 8, "F");
      doc.setFontSize(9);
      doc.text("No", margin + 2, y + 5.5);
      doc.text("Dogru", margin + 15, y + 5.5);
      doc.text("Yanlis", margin + 35, y + 5.5);
      doc.text("Bos", margin + 55, y + 5.5);
      doc.text("Basari %", margin + 70, y + 5.5);
      doc.text("Kazanim", margin + 95, y + 5.5);
      y += 8;

      doc.setFont("helvetica", "normal");
      for (const q of data.questionStats || []) {
        if (y > 270) {
          doc.addPage();
          y = margin;
        }

        const bg = q.correctRate >= 70 ? [240, 253, 244] : q.correctRate >= 50 ? [255, 251, 235] : [254, 242, 242];
        doc.setFillColor(...(bg as [number, number, number]));
        doc.rect(margin, y, 180, 7, "F");

        doc.setTextColor(0, 0, 0);
        doc.text(String(q.orderIndex), margin + 2, y + 5);
        doc.setTextColor(22, 163, 74);
        doc.text(String(q.correctCount), margin + 15, y + 5);
        doc.setTextColor(220, 38, 38);
        doc.text(String(q.wrongCount), margin + 35, y + 5);
        doc.setTextColor(100, 116, 139);
        doc.text(String(q.blankCount), margin + 55, y + 5);

        const rateColor = q.correctRate >= 70 ? [22, 163, 74] : q.correctRate >= 50 ? [180, 130, 0] : [220, 38, 38];
        doc.setTextColor(...(rateColor as [number, number, number]));
        doc.text(`%${q.correctRate}`, margin + 70, y + 5);

        doc.setTextColor(0, 0, 0);
        if (q.achievement) {
          doc.text(toAscii(q.achievement.slice(0, 40)), margin + 95, y + 5);
        }
        y += 7;
      }

      // --- Kazanım Summary ---
      if (data.achievementStats?.length > 0) {
        if (y > 250) {
          doc.addPage();
          y = margin;
        }
        y += 8;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Kazanim Bazli Basari", margin, y);
        y += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        for (const ach of data.achievementStats) {
          if (y > 270) {
            doc.addPage();
            y = margin;
          }
          const color = ach.correctRate >= 70 ? [22, 163, 74] : ach.correctRate >= 50 ? [180, 130, 0] : [220, 38, 38];
          doc.setTextColor(...(color as [number, number, number]));
          doc.text(
            `${toAscii(ach.name)}: %${ach.correctRate}`,
            margin + 5,
            y
          );
          y += 6;
        }
      }

      // --- Footer ---
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        "Berkan Matematik - Egitim Platformu | Sinav Analiz Raporu",
        105,
        290,
        { align: "center" }
      );

      doc.save(`${toAscii(examTitle)}-analiz.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={generating}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/20 text-foreground font-heading font-bold text-sm transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {generating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          PDF Hazırlanıyor...
        </>
      ) : (
        <>
          <DocumentDownload className="w-4 h-4 text-primary" variant="Bulk" />
          Rapor İndir
        </>
      )}
    </button>
  );
}
