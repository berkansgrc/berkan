import jsPDF from "jspdf";

type ResultData = {
  studentName: string;
  examTitle: string;
  date: string;
  durationMinutes: number;
  correct: number;
  wrong: number;
  blank: number;
  score: number;
  questions: {
    orderIndex: number;
    body: string;
    selectedOption: string | null;
    correctOption: string;
    isCorrect: boolean;
  }[];
};

export function generateResultPDF(data: ResultData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 15;
  let y = margin;

  // --- Başlık ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Sinav Sonuc Raporu", margin, y);
  y += 10;

  doc.setDrawColor(100, 100, 255);
  doc.setLineWidth(0.5);
  doc.line(margin, y, 210 - margin, y);
  y += 8;

  // --- Öğrenci Bilgileri ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Ogrenci: ${data.studentName}`, margin, y); y += 7;
  doc.text(`Sinav: ${data.examTitle}`, margin, y); y += 7;
  doc.text(`Tarih: ${data.date}`, margin, y); y += 7;
  doc.text(`Sure: ${data.durationMinutes} dakika`, margin, y); y += 12;

  // --- Sonuç Özeti Kutuları ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Sonuc Ozeti", margin, y); y += 6;

  const boxW = 40;
  const boxH = 18;
  const boxes = [
    { label: "Dogru", value: data.correct, color: [34, 197, 94] as [number, number, number] },
    { label: "Yanlis", value: data.wrong, color: [239, 68, 68] as [number, number, number] },
    { label: "Bos", value: data.blank, color: [148, 163, 184] as [number, number, number] },
    { label: "Net", value: Number(data.score.toFixed(2)), color: [99, 102, 241] as [number, number, number] },
  ];

  boxes.forEach((box, i) => {
    const x = margin + i * (boxW + 4);
    doc.setFillColor(...box.color);
    doc.roundedRect(x, y, boxW, boxH, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(box.label, x + boxW / 2, y + 6, { align: "center" });
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(String(box.value), x + boxW / 2, y + 14, { align: "center" });
  });

  doc.setTextColor(0, 0, 0);
  y += boxH + 10;

  // --- Soru Bazlı Tablo ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Soru Analizi", margin, y); y += 6;

  // Tablo başlıkları
  doc.setFillColor(230, 230, 250);
  doc.rect(margin, y, 180, 8, "F");
  doc.setFontSize(9);
  doc.text("No", margin + 2, y + 5.5);
  doc.text("Senin Cevabın", margin + 15, y + 5.5);
  doc.text("Dogru Cevap", margin + 55, y + 5.5);
  doc.text("Sonuc", margin + 95, y + 5.5);
  y += 8;

  doc.setFont("helvetica", "normal");
  data.questions.forEach((q) => {
    if (y > 270) {
      doc.addPage();
      y = margin;
    }

    const bg = q.isCorrect ? [240, 253, 244] : q.selectedOption ? [254, 242, 242] : [248, 250, 252];
    doc.setFillColor(...(bg as [number, number, number]));
    doc.rect(margin, y, 180, 7, "F");

    doc.setTextColor(0, 0, 0);
    doc.text(String(q.orderIndex), margin + 2, y + 5);
    doc.text(q.selectedOption ?? "-", margin + 15, y + 5);
    doc.text(q.correctOption, margin + 55, y + 5);

    const sonuc = q.isCorrect ? "Dogru" : q.selectedOption ? "Yanlis" : "Bos";
    const sonucColor = q.isCorrect ? [22, 163, 74] : q.selectedOption ? [220, 38, 38] : [100, 116, 139];
    doc.setTextColor(...(sonucColor as [number, number, number]));
    doc.text(sonuc, margin + 95, y + 5);
    doc.setTextColor(0, 0, 0);
    y += 7;
  });

  // --- Alt bilgi ---
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Berkan Matematik - Egitim Platformu", 105, 290, { align: "center" });

  doc.save(`${data.examTitle}-sonuc.pdf`);
}
