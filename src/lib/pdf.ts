// PDF üretimi: HTML template → html2canvas → jsPDF
// Türkçe karakter sorunu tamamen çözülür (tarayıcı kendi fontunu kullanır)

type QuestionItem = {
  orderIndex: number;
  body: string;
  selectedOption: string | null;
  correctOption: string;
  isCorrect: boolean;
  timeSpentMs?: number;
  achievement?: string | null;
};

type ResultData = {
  studentName: string;
  examTitle: string;
  date: string;
  durationMinutes: number;
  correct: number;
  wrong: number;
  blank: number;
  score: number;
  questions: QuestionItem[];
};

function buildHTML(data: ResultData): string {
  const { studentName, examTitle, date, durationMinutes, correct, wrong, blank, score, questions } = data;
  const total = correct + wrong + blank;
  const successRate = total > 0 ? Math.round((correct / total) * 100) : 0;
  const scoreColor = score >= 70 ? "#16a34a" : score >= 40 ? "#d97706" : "#dc2626";
  const scoreLight = score >= 70 ? "#dcfce7" : score >= 40 ? "#fef3c7" : "#fee2e2";

  // İyileştirme alanları (yanlış cevaplanan kazanımlar)
  const wrongAchievements: Record<string, number> = {};
  questions.filter(q => !q.isCorrect && q.achievement).forEach(q => {
    wrongAchievements[q.achievement!] = (wrongAchievements[q.achievement!] || 0) + 1;
  });
  const improvementAreas = Object.entries(wrongAchievements)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const rowsHTML = questions.map(q => {
    const status = q.isCorrect ? "Doğru" : q.selectedOption ? "Yanlış" : "Boş";
    const rowBg = q.isCorrect ? "#f0fdf4" : q.selectedOption ? "#fff1f2" : "#f8fafc";
    const statusColor = q.isCorrect ? "#16a34a" : q.selectedOption ? "#dc2626" : "#94a3b8";
    const timeStr = q.timeSpentMs
      ? (() => {
          const sec = Math.floor(q.timeSpentMs / 1000);
          const m = Math.floor(sec / 60);
          const s = sec % 60;
          return m > 0 ? `${m}dk ${s}sn` : `${s}sn`;
        })()
      : "—";
    const timeColor = q.timeSpentMs && q.timeSpentMs > 120000 ? "#f97316" : "#64748b";

    const bodyShort = q.body.length > 80 ? q.body.substring(0, 77) + "..." : q.body;

    return `
      <tr style="background:${rowBg}">
        <td style="padding:10px 12px;font-weight:700;color:#334155;border-bottom:1px solid #e2e8f0">${q.orderIndex}</td>
        <td style="padding:10px 12px;color:#475569;border-bottom:1px solid #e2e8f0;max-width:260px">${bodyShort}</td>
        <td style="padding:10px 12px;text-align:center;font-weight:800;color:#1e293b;border-bottom:1px solid #e2e8f0">${q.selectedOption ?? "—"}</td>
        <td style="padding:10px 12px;text-align:center;font-weight:800;color:#16a34a;border-bottom:1px solid #e2e8f0">${q.correctOption}</td>
        <td style="padding:10px 12px;text-align:center;font-weight:700;color:${statusColor};border-bottom:1px solid #e2e8f0">${status}</td>
        <td style="padding:10px 12px;text-align:center;color:${timeColor};font-weight:600;border-bottom:1px solid #e2e8f0">${timeStr}</td>
        <td style="padding:10px 12px;color:#64748b;font-size:11px;border-bottom:1px solid #e2e8f0">${q.achievement ?? "—"}</td>
      </tr>
    `;
  }).join("");

  const improvementHTML = improvementAreas.length > 0 ? `
    <div style="margin-top:32px">
      <h3 style="font-size:16px;font-weight:800;color:#dc2626;margin-bottom:16px;display:flex;align-items:center;gap:8px">
        ⚠️ Geliştirilmesi Gereken Konular
      </h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        ${improvementAreas.map(([topic, count]) => `
          <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:10px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center">
            <span style="font-weight:600;color:#9f1239;font-size:13px">${topic}</span>
            <span style="background:#dc2626;color:white;font-size:11px;font-weight:800;padding:3px 10px;border-radius:999px">${count} hata</span>
          </div>
        `).join("")}
      </div>
    </div>
  ` : "";

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background: white; color: #1e293b; }
  table { border-collapse: collapse; width: 100%; }
  th { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; background: #f1f5f9; padding: 10px 12px; text-align: left; }
</style>
</head>
<body>
<div style="width:794px;padding:48px 48px 56px;background:white">

  <!-- HEADER -->
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:36px">
    <div>
      <div style="font-size:26px;font-weight:900;color:#006762;letter-spacing:-0.5px">Berkan Matematik</div>
      <div style="font-size:13px;color:#94a3b8;margin-top:4px;font-weight:500">Eğitim Platformu — Sınav Sonuç Raporu</div>
    </div>
    <div style="text-align:right;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;padding:12px 20px">
      <div style="font-size:11px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:0.08em">Tarih</div>
      <div style="font-size:14px;font-weight:700;color:#1e293b;margin-top:2px">${date}</div>
    </div>
  </div>

  <!-- DIVIDER -->
  <div style="height:3px;background:linear-gradient(to right,#006762,#34d399,transparent);border-radius:99px;margin-bottom:32px"></div>

  <!-- STUDENT + EXAM INFO -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:32px">
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:18px 20px">
      <div style="font-size:11px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px">Öğrenci</div>
      <div style="font-size:18px;font-weight:800;color:#1e293b">${studentName}</div>
    </div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:18px 20px">
      <div style="font-size:11px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px">Sınav</div>
      <div style="font-size:16px;font-weight:800;color:#1e293b;line-height:1.3">${examTitle}</div>
      <div style="font-size:12px;color:#64748b;margin-top:4px">Süre: ${durationMinutes} dakika · Toplam ${total} soru</div>
    </div>
  </div>

  <!-- SCORE CARDS -->
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:32px">
    <div style="grid-column:span 2;background:${scoreLight};border:2px solid ${scoreColor}30;border-radius:16px;padding:20px;text-align:center">
      <div style="font-size:11px;font-weight:800;color:${scoreColor};text-transform:uppercase;letter-spacing:0.1em">Net Puan</div>
      <div style="font-size:40px;font-weight:900;color:${scoreColor};margin-top:4px">${score.toFixed(2)}</div>
      <div style="font-size:13px;font-weight:600;color:${scoreColor}99;margin-top:2px">%${successRate} Başarı</div>
    </div>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:16px;padding:20px;text-align:center">
      <div style="font-size:11px;font-weight:800;color:#16a34a;text-transform:uppercase;letter-spacing:0.1em">Doğru</div>
      <div style="font-size:36px;font-weight:900;color:#16a34a;margin-top:4px">${correct}</div>
    </div>
    <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:16px;padding:20px;text-align:center">
      <div style="font-size:11px;font-weight:800;color:#dc2626;text-transform:uppercase;letter-spacing:0.1em">Yanlış</div>
      <div style="font-size:36px;font-weight:900;color:#dc2626;margin-top:4px">${wrong}</div>
    </div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:20px;text-align:center">
      <div style="font-size:11px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em">Boş</div>
      <div style="font-size:36px;font-weight:900;color:#94a3b8;margin-top:4px">${blank}</div>
    </div>
  </div>

  <!-- QUESTION TABLE -->
  <h3 style="font-size:16px;font-weight:800;color:#1e293b;margin-bottom:14px">Soru Bazlı Analiz</h3>
  <div style="border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;margin-bottom:8px">
    <table>
      <thead>
        <tr>
          <th style="width:36px">#</th>
          <th>Soru</th>
          <th style="width:60px;text-align:center">Cevabın</th>
          <th style="width:60px;text-align:center">Doğru</th>
          <th style="width:64px;text-align:center">Durum</th>
          <th style="width:72px;text-align:center">Süre</th>
          <th>Kazanım</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHTML}
      </tbody>
    </table>
  </div>

  ${improvementHTML}

  <!-- FOOTER -->
  <div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center">
    <div style="font-size:12px;color:#94a3b8;font-weight:500">Berkan Matematik Eğitim Platformu</div>
    <div style="font-size:12px;color:#94a3b8">Bu rapor otomatik olarak oluşturulmuştur.</div>
  </div>
</div>
</body>
</html>`;
}

export async function generateResultPDF(data: ResultData): Promise<void> {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  // Gizli iframe içinde HTML render et
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  container.style.width = "794px";
  container.style.backgroundColor = "white";
  container.innerHTML = buildHTML(data);
  document.body.appendChild(container);

  try {
    await new Promise(resolve => setTimeout(resolve, 100)); // font yüklenmesi için kısa bekleme

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: 794,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({ unit: "px", format: "a4", orientation: "portrait" });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width / 2; // scale=2 nedeniyle
    const imgHeight = canvas.height / 2;

    const ratio = pdfWidth / imgWidth;
    const scaledHeight = imgHeight * ratio;

    let posY = 0;
    let remainingHeight = scaledHeight;
    let firstPage = true;

    while (remainingHeight > 0) {
      if (!firstPage) pdf.addPage();

      const sliceHeight = Math.min(remainingHeight, pdfHeight);
      const srcY = posY / ratio;
      const srcH = sliceHeight / ratio;

      // Sayfanın görüntü dilimini ekle
      pdf.addImage(
        imgData,
        "JPEG",
        0,
        firstPage ? 0 : -posY,
        pdfWidth,
        scaledHeight
      );

      posY += pdfHeight;
      remainingHeight -= pdfHeight;
      firstPage = false;
    }

    pdf.save(`${data.examTitle}-sonuc.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
