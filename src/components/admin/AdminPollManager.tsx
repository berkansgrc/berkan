"use client";

import { useState } from "react";
import { BarChart3, Plus, Trash2, ToggleLeft, ToggleRight, Loader2, CheckCircle2 } from "lucide-react";

interface PollOption {
  label: string;
  text: string;
}

export default function AdminPollManager() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<PollOption[]>([
    { label: "A", text: "" },
    { label: "B", text: "" },
    { label: "C", text: "" },
    { label: "D", text: "" },
  ]);
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const labels = "ABCDEFGH";

  const addOption = () => {
    if (options.length >= 8) return;
    setOptions([...options, { label: labels[options.length], text: "" }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    const newOpts = options.filter((_, i) => i !== index).map((opt, i) => ({
      ...opt,
      label: labels[i],
    }));
    setOptions(newOpts);
  };

  const updateOption = (index: number, text: string) => {
    const newOpts = [...options];
    newOpts[index] = { ...newOpts[index], text };
    setOptions(newOpts);
  };

  const handleCreate = async () => {
    if (!question.trim()) {
      setError("Anket sorusu yazın.");
      return;
    }
    const filledOptions = options.filter((o) => o.text.trim());
    if (filledOptions.length < 2) {
      setError("En az 2 şık doldurulmalı.");
      return;
    }

    setCreating(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/live-polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          options: filledOptions,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setQuestion("");
        setOptions([
          { label: "A", text: "" },
          { label: "B", text: "" },
          { label: "C", text: "" },
          { label: "D", text: "" },
        ]);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error ?? "Bir hata oluştu.");
      }
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setCreating(false);
    }
  };

  const inputClass =
    "w-full h-11 bg-input/50 border border-border/60 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 text-sm transition-all outline-none font-medium text-foreground placeholder:text-muted-foreground/60";

  return (
    <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-7 shadow-sm space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h2 className="font-heading font-black text-xl text-foreground">Canlı Anket Oluştur</h2>
      </div>

      {/* Soru */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-foreground">Anket Sorusu</label>
        <input
          className={inputClass}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Örn: Bu konuyu anladınız mı?"
        />
      </div>

      {/* Şıklar */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-foreground">Şıklar</label>
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-black shrink-0">
              {opt.label}
            </span>
            <input
              className={inputClass}
              value={opt.text}
              onChange={(e) => updateOption(idx, e.target.value)}
              placeholder={`${opt.label} şıkkının metni`}
            />
            {options.length > 2 && (
              <button
                onClick={() => removeOption(idx)}
                className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}

        {options.length < 8 && (
          <button
            onClick={addOption}
            className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors mt-2"
          >
            <Plus className="w-4 h-4" /> Şık Ekle
          </button>
        )}
      </div>

      {/* Hata / Başarı */}
      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm font-bold text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-sm font-bold text-primary flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Anket oluşturuldu ve aktif!
        </div>
      )}

      {/* Oluştur */}
      <button
        onClick={handleCreate}
        disabled={creating}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-bold text-sm py-3.5 rounded-xl shadow-[0_8px_16px_rgba(0,103,98,0.2)] hover:shadow-[0_12px_24px_rgba(0,103,98,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {creating ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Oluşturuluyor...</>
        ) : (
          <><BarChart3 className="w-5 h-5" /> Anketi Yayınla</>
        )}
      </button>

      <p className="text-[11px] text-muted-foreground font-medium text-center">
        Yeni anket yayınlandığında önceki anket otomatik olarak deaktif olur.
      </p>
    </div>
  );
}
