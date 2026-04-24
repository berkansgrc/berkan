"use client";

import { useState, useRef, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  DocumentUpload,
  TickCircle,
  Danger,
  Trash,
  ArrowRight2,
  CloseCircle,
} from "iconsax-react";
import { Loader2 } from "lucide-react";

interface ParsedQuestion {
  body: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  achievement: string;
}

interface BulkQuestionUploaderProps {
  examId?: string;
  onQuestionsReady: (questions: ParsedQuestion[]) => void;
}

export default function BulkQuestionUploader({
  onQuestionsReady,
}: BulkQuestionUploaderProps) {
  const [parsed, setParsed] = useState<ParsedQuestion[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const parseFile = useCallback(
    async (file: File) => {
      setErrors([]);
      setParsed([]);
      setFileName(file.name);

      const ext = file.name.split(".").pop()?.toLowerCase();

      try {
        if (ext === "json") {
          const text = await file.text();
          const data = JSON.parse(text);

          if (!Array.isArray(data)) {
            setErrors(["JSON dosyası bir dizi (array) içermelidir."]);
            return;
          }

          const questions: ParsedQuestion[] = [];
          const errs: string[] = [];

          data.forEach((item: Record<string, string>, idx: number) => {
            const q: ParsedQuestion = {
              body: item["Soru Metni"] || item.body || item.question || "",
              optionA: item["A"] || item.optionA || item.a || "",
              optionB: item["B"] || item.optionB || item.b || "",
              optionC: item["C"] || item.optionC || item.c || "",
              optionD: item["D"] || item.optionD || item.d || "",
              correctOption: (
                item["Doğru Cevap"] ||
                item.correctOption ||
                item.correct ||
                item.answer ||
                ""
              ).toUpperCase(),
              achievement:
                item["Kazanım"] || item.achievement || item.kazanim || "",
            };

            if (!q.body.trim()) {
              errs.push(`Satır ${idx + 1}: Soru metni boş.`);
            }
            if (!["A", "B", "C", "D"].includes(q.correctOption)) {
              errs.push(
                `Satır ${idx + 1}: Geçersiz doğru cevap "${q.correctOption}".`
              );
            }
            questions.push(q);
          });

          setErrors(errs);
          setParsed(questions);
        } else if (ext === "xlsx" || ext === "xls") {
          const { read, utils } = await import("xlsx");
          const buffer = await file.arrayBuffer();
          const wb = read(buffer);
          const sheet = wb.Sheets[wb.SheetNames[0]];
          const rows = utils.sheet_to_json<Record<string, string>>(sheet);

          const questions: ParsedQuestion[] = [];
          const errs: string[] = [];

          rows.forEach((row, idx) => {
            const q: ParsedQuestion = {
              body: row["Soru Metni"] || row["body"] || "",
              optionA: row["A"] || row["optionA"] || "",
              optionB: row["B"] || row["optionB"] || "",
              optionC: row["C"] || row["optionC"] || "",
              optionD: row["D"] || row["optionD"] || "",
              correctOption: (
                row["Doğru Cevap"] || row["correct"] || row["answer"] || ""
              )
                .toString()
                .toUpperCase(),
              achievement: row["Kazanım"] || row["achievement"] || "",
            };

            if (!q.body.trim()) {
              errs.push(`Satır ${idx + 2}: Soru metni boş.`);
            }
            if (!["A", "B", "C", "D"].includes(q.correctOption)) {
              errs.push(
                `Satır ${idx + 2}: Geçersiz doğru cevap "${q.correctOption}".`
              );
            }
            questions.push(q);
          });

          setErrors(errs);
          setParsed(questions);
        } else {
          setErrors(["Desteklenmeyen dosya formatı. .xlsx veya .json kullanın."]);
        }
      } catch (err) {
        setErrors([`Dosya okunamadı: ${(err as Error).message}`]);
      }
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) parseFile(file);
    },
    [parseFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) parseFile(file);
    },
    [parseFile]
  );

  const handleClear = () => {
    setParsed([]);
    setErrors([]);
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleConfirm = () => {
    const validQuestions = parsed.filter(
      (q) => q.body.trim() && ["A", "B", "C", "D"].includes(q.correctOption)
    );
    if (validQuestions.length === 0) {
      setErrors(["Geçerli soru bulunamadı."]);
      return;
    }
    onQuestionsReady(validQuestions);
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative rounded-[1.5rem] border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
          dragOver
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border/50 bg-card/30 hover:border-primary/30 hover:bg-primary/[0.02]"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.json"
          onChange={handleFileChange}
          className="hidden"
        />
        <DocumentUpload
          className={`w-10 h-10 mx-auto mb-3 transition-colors ${
            dragOver ? "text-primary" : "text-muted-foreground/40"
          }`}
          variant="Bulk"
        />
        <p className="font-heading font-bold text-foreground text-sm">
          {fileName || "Dosyayı sürükleyin veya tıklayın"}
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">
          Excel (.xlsx) veya JSON formatı desteklenir
        </p>

        {/* Format hint */}
        <div className="mt-4 inline-flex items-center gap-2 text-[10px] text-muted-foreground/60 font-bold bg-muted/30 px-3 py-1.5 rounded-lg">
          Sütunlar: Soru Metni | A | B | C | D | Doğru Cevap | Kazanım
        </div>
      </div>

      {/* Errors */}
      <AnimatePresence>
        {errors.length > 0 && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 space-y-1 overflow-hidden"
          >
            {errors.slice(0, 5).map((err, idx) => (
              <p key={idx} className="text-xs font-bold text-destructive flex items-center gap-1.5">
                <Danger className="w-3 h-3 shrink-0" variant="Bold" />
                {err}
              </p>
            ))}
            {errors.length > 5 && (
              <p className="text-[10px] text-destructive/60 font-bold">
                +{errors.length - 5} hata daha...
              </p>
            )}
          </m.div>
        )}
      </AnimatePresence>

      {/* Preview Table */}
      <AnimatePresence>
        {parsed.length > 0 && (
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="rounded-[1.25rem] border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TickCircle className="w-4 h-4 text-emerald-500" variant="Bulk" />
                <span className="font-heading font-black text-sm text-foreground">
                  {parsed.length} Soru Algılandı
                </span>
              </div>
              <button
                onClick={handleClear}
                className="flex items-center gap-1 text-xs font-bold text-destructive hover:text-destructive/80 transition-colors"
              >
                <Trash className="w-3 h-3" variant="Outline" />
                Temizle
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/20 sticky top-0 z-10">
                    <th className="px-4 py-2 text-left font-black text-[9px] uppercase tracking-widest text-muted-foreground">
                      #
                    </th>
                    <th className="px-4 py-2 text-left font-black text-[9px] uppercase tracking-widest text-muted-foreground">
                      Soru
                    </th>
                    <th className="px-4 py-2 text-center font-black text-[9px] uppercase tracking-widest text-muted-foreground">
                      Cevap
                    </th>
                    <th className="px-4 py-2 text-left font-black text-[9px] uppercase tracking-widest text-muted-foreground">
                      Kazanım
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {parsed.map((q, idx) => {
                    const isValid =
                      q.body.trim() &&
                      ["A", "B", "C", "D"].includes(q.correctOption);
                    return (
                      <tr
                        key={idx}
                        className={`${
                          isValid
                            ? "hover:bg-muted/10"
                            : "bg-destructive/5"
                        } transition-colors`}
                      >
                        <td className="px-4 py-2 font-bold text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-2 font-medium text-foreground max-w-[200px] truncate">
                          {q.body || "—"}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`inline-flex w-6 h-6 items-center justify-center rounded-lg text-[10px] font-black ${
                              isValid
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                : "bg-destructive/10 text-destructive border border-destructive/20"
                            }`}
                          >
                            {q.correctOption || "?"}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground truncate max-w-[120px]">
                          {q.achievement || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Confirm Button */}
            <div className="px-5 py-4 border-t border-border/50 bg-muted/5">
              <button
                onClick={handleConfirm}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-bold text-sm py-3.5 rounded-xl shadow-[0_8px_16px_rgba(0,103,98,0.2)] hover:shadow-[0_12px_24px_rgba(0,103,98,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all"
              >
                <TickCircle className="w-5 h-5" variant="Bold" />
                {parsed.length} Soruyu Ekle
                <ArrowRight2 className="w-4 h-4" variant="Outline" />
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
