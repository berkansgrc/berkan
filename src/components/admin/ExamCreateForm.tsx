"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, ArrowLeft, GripVertical, Copy, ChevronUp, ChevronDown, Check, Image as ImageIcon } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

export type QuestionDraft = {
  id: string;
  body: string;
  optionCount: 4 | 5;
  options: { label: string; text: string }[];
  correctOption: string;
  imageUrl: string;
};

export type ExamDraft = {
  id?: string;
  title: string;
  description: string;
  duration_minutes: number;
  access_mode: "public" | "private";
  is_published: boolean;
  questions: QuestionDraft[];
};

const LABELS = ["A", "B", "C", "D", "E"];

function createEmptyQuestion(count: 4 | 5 = 4): QuestionDraft {
  return {
    id: crypto.randomUUID(),
    body: "",
    optionCount: count,
    options: LABELS.slice(0, count).map((l) => ({ label: l, text: "" })),
    correctOption: "A",
    imageUrl: "",
  };
}

export default function ExamCreateForm({ initialData }: { initialData?: ExamDraft }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [duration, setDuration] = useState(initialData?.duration_minutes || 40);
  const [accessMode, setAccessMode] = useState<"public" | "private">(initialData?.access_mode || "public");
  const [isPublished, setIsPublished] = useState(initialData?.is_published || false);
  const [questions, setQuestions] = useState<QuestionDraft[]>(
    initialData?.questions && initialData.questions.length > 0 
      ? initialData.questions 
      : [createEmptyQuestion()]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEditing = !!initialData;

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestion(prev[prev.length - 1]?.optionCount ?? 4)]);
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const duplicateQuestion = (q: QuestionDraft) => {
    const newQ = { ...q, id: crypto.randomUUID() };
    setQuestions((prev) => {
      const idx = prev.findIndex((item) => item.id === q.id);
      const newArr = [...prev];
      newArr.splice(idx + 1, 0, newQ);
      return newArr;
    });
  };

  const moveQuestion = (id: string, dir: -1 | 1) => {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.id === id);
      if (idx < 0 || idx + dir < 0 || idx + dir >= prev.length) return prev;
      const newArr = [...prev];
      const temp = newArr[idx];
      newArr[idx] = newArr[idx + dir];
      newArr[idx + dir] = temp;
      return newArr;
    });
  };

  const updateQuestion = (id: string, field: string, value: unknown) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        if (field === "optionCount") {
          const count = value as 4 | 5;
          return {
            ...q,
            optionCount: count,
            options: LABELS.slice(0, count).map((l, i) => ({
              label: l,
              text: q.options[i]?.text ?? "",
            })),
            correctOption: LABELS.slice(0, count).includes(q.correctOption)
              ? q.correctOption
              : "A",
          };
        }
        return { ...q, [field]: value };
      })
    );
  };

  const updateOption = (qId: string, label: string, text: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((o) => (o.label === label ? { ...o, text } : o)),
            }
          : q
      )
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Sınav başlığı gereklidir.");
      return;
    }
    if (questions.some((q) => !q.body.trim())) {
      setError("Tüm soruların metni doldurulmalıdır.");
      return;
    }
    if (questions.some((q) => q.options.some((o) => !o.text.trim()))) {
      setError("Tüm seçenek alanları doldurulmalıdır.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const endpoint = isEditing ? `/api/admin/exams/${initialData.id}` : "/api/admin/exams";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          duration_minutes: duration,
          access_mode: accessMode,
          is_published: isPublished,
          questions: questions.map((q, i) => ({
            body: q.body,
            option_count: q.optionCount,
            options: q.options,
            correct_option: q.correctOption,
            order_index: i + 1,
            image_url: q.imageUrl || null,
          })),
        }),
      });

      if (res.ok) {
        router.push("/admin/exams");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Bir hata oluştu.");
      }
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 lg:px-8 py-10 relative z-10 w-full h-full pb-32">
      {/* Geometrik Arka Plan */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\\\'0 0 200 200\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\'%3E%3Cfilter id=\\\'noiseFilter\\\'%3E%3CfeTurbulence type=\\\'fractalNoise\\\' baseFrequency=\\\'0.65\\\' numOctaves=\\\'3\\\' stitchTiles=\\\'stitch\\\'/%3E%3C/filter%3E%3Crect width=\\\'100%25\\\' height=\\\'100%25\\\' filter=\\\'url(%23noiseFilter)\\\'/%3E%3C/svg%3E")' }}></div>
      <div className="fixed top-20 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2"></div>
      
      {/* Sticky Header Bar */}
      <div className="sticky top-0 z-50 -mx-4 px-4 py-4 backdrop-blur-xl bg-background/80 border-b border-border/50 mb-10 border-x border-t-0 rounded-b-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-primary/10 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-heading font-extrabold tracking-tight text-foreground">{isEditing ? "Sınavı Düzenle" : "Yeni Sınav Oluştur"}</h1>
            <p className="text-sm font-medium text-muted-foreground">{questions.length} Soru • {duration} Dakika</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.back()} className="rounded-xl font-heading font-bold px-6 h-11 border-border/50 bg-card/50 hover:bg-muted">
              İptal
            </Button>
            <Button onClick={handleSave} disabled={saving} className="rounded-xl font-heading font-bold px-6 h-11 bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground border-0 shadow-[0_8px_16px_rgba(0,103,98,0.2)] hover:shadow-[0_12px_24px_rgba(0,103,98,0.3)] hover:-translate-y-0.5 transition-all w-40">
              {saving ? (
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                    Kaydediliyor
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> Sınavı Kaydet
                </div>
              )}
            </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-[1rem] bg-destructive/10 border border-destructive/20 p-5 mb-8 text-sm font-bold text-destructive flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">!</div>
           {error}
        </div>
      )}

      {/* Sınav Genel Ayarları */}
      <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-8 space-y-6 mb-10 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>
        <h2 className="font-heading font-bold text-xl relative z-10 flex items-center gap-2">
           <span className="w-2 h-6 rounded-full bg-primary inline-block"></span>
           Sınav Bilgileri
        </h2>

        <div className="space-y-3 relative z-10">
          <Label htmlFor="title" className="font-semibold text-foreground">Sınav Başlığı *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn: Limit ve Süreklilik Karma Deneme"
            className="h-12 bg-input/50 backdrop-blur-sm border-border/60 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-[1rem] text-base transition-all"
          />
        </div>

        <div className="space-y-3 relative z-10">
          <Label htmlFor="desc" className="font-semibold text-foreground">Açıklama (Opsiyonel)</Label>
          <textarea
            id="desc"
            className="flex min-h-[100px] w-full rounded-[1rem] border border-border/60 bg-input/50 backdrop-blur-sm px-4 py-3 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition-all hover:border-primary/40"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Öğrencilerinizin sınav öncesi bilmesi gerekenler..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-3">
            <Label htmlFor="duration" className="font-semibold text-foreground">Süre (Dakika)</Label>
            <div className="relative">
                <Input
                  id="duration"
                  type="number"
                  min={5}
                  max={240}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="h-12 bg-input/50 backdrop-blur-sm border-border/60 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-[1rem] text-base transition-all pl-4 pr-12 font-mono font-bold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">dk</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="font-semibold text-foreground">Erişim İzni</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAccessMode("public")}
                className={`flex-1 rounded-[1rem] border h-12 flex items-center justify-center font-heading font-bold text-sm transition-all ${
                  accessMode === "public"
                    ? "bg-primary-container text-primary-fixed-variant border-primary shadow-[inset_0_0_0_1px_rgba(0,103,98,0.2)]"
                    : "bg-input/30 border-border/60 text-muted-foreground hover:bg-input hover:text-foreground"
                }`}
              >
                Herkese Açık
              </button>
              <button
                type="button"
                onClick={() => setAccessMode("private")}
                className={`flex-1 rounded-[1rem] border h-12 flex items-center justify-center font-heading font-bold text-sm transition-all ${
                  accessMode === "private"
                    ? "bg-surface-variant text-on-surface-variant border-muted-foreground/30 shadow-[inset_0_0_0_1px_rgba(100,116,139,0.2)]"
                    : "bg-input/30 border-border/60 text-muted-foreground hover:bg-input hover:text-foreground"
                }`}
              >
                Sadece Linkle
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-2 border-t border-border/50 relative z-10 flex items-center justify-between">
           <div>
               <p className="font-heading font-bold text-foreground">Sınavı Yayınla</p>
               <p className="text-sm text-muted-foreground font-medium">Öğrencilerin anında sınava girmesine izin ver.</p>
           </div>
           <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
              <div className="w-14 h-8 bg-input border border-border/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary peer-checked:border-primary shadow-inner"></div>
           </label>
        </div>
      </div>

      {/* Soru Listesi */}
      <div className="space-y-6">
        <div className="flex items-center justify-between sticky top-24 z-40 bg-background/90 backdrop-blur-md py-4 border-b border-border x-4">
          <h2 className="font-heading font-bold text-xl text-foreground">
             Sorular <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm ml-2 border border-primary/20">{questions.length} Addet</span>
          </h2>
          <Button variant="outline" onClick={addQuestion} className="h-10 rounded-[1rem] gap-2 font-heading font-bold border-primary/30 text-primary bg-primary/5 hover:bg-primary hover:text-primary-foreground transform active:scale-95 transition-all">
            <Plus className="h-4 w-4" /> Yeni Soru
          </Button>
        </div>

        <div className="space-y-8 mt-6">
            {questions.map((q, idx) => (
            <div key={q.id} className="rounded-[1.5rem] border border-border/60 bg-card/80 backdrop-blur-xl p-6 md:p-8 space-y-6 relative group shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                
                {/* Soru Header Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground hover:bg-input p-1 rounded transition-colors hide-on-mobile">
                             <GripVertical className="h-5 w-5" />
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground text-base border border-primary shadow-sm font-heading font-bold">
                        {idx + 1}
                        </div>
                        <span className="text-base font-bold text-foreground">. Soru</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Seçenek Sayısı Seçici */}
                        <div className="relative mr-2">
                             <select
                                value={q.optionCount}
                                onChange={(e) => updateQuestion(q.id, "optionCount", Number(e.target.value))}
                                className="appearance-none bg-input/50 border border-border/80 text-foreground text-sm rounded-[1rem] focus:ring-primary focus:border-primary block w-full p-2.5 pr-8 font-medium hover:border-primary/50 transition-colors cursor-pointer outline-none"
                             >
                                <option value={4}>4 Seçenek</option>
                                <option value={5}>5 Seçenek</option>
                             </select>
                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                                <ChevronDown className="h-4 w-4" />
                             </div>
                        </div>

                        <Button variant="ghost" size="icon" onClick={() => moveQuestion(q.id, -1)} disabled={idx === 0} className="h-10 w-10 rounded-[1rem] bg-input/30 hover:bg-input border border-border/50">
                             <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => moveQuestion(q.id, 1)} disabled={idx === questions.length - 1} className="h-10 w-10 rounded-[1rem] bg-input/30 hover:bg-input border border-border/50">
                             <ChevronDown className="h-4 w-4" />
                        </Button>
                        
                        <div className="w-px h-6 bg-border mx-1"></div>

                        <Button variant="ghost" size="icon" onClick={() => duplicateQuestion(q)} className="h-10 w-10 rounded-[1rem] bg-input/30 hover:bg-input hover:text-primary transition-colors border border-border/50" title="Soruyu Kopyala">
                             <Copy className="h-4 w-4" />
                        </Button>
                        
                        {questions.length > 1 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQuestion(q.id)}
                            className="h-10 w-10 rounded-[1rem] text-destructive bg-destructive/5 hover:bg-destructive hover:text-destructive-foreground transition-colors border border-destructive/20"
                            title="Soruyu Sil"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        )}
                    </div>
                </div>

                {/* Soru Metni Geometrisi */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Sol Kolon - Soru Gövdesi ve Resim */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <div className="space-y-3">
                            <Label className="font-semibold text-foreground flex items-center gap-2">
                                Soru Metni <span className="text-primary">*</span>
                            </Label>
                            <textarea
                                className="flex min-h-[140px] w-full rounded-[1.25rem] border border-border/80 bg-input/40 px-5 py-4 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition-all shadow-inner"
                                value={q.body}
                                onChange={(e) => updateQuestion(q.id, "body", e.target.value)}
                                placeholder="Soru metnini buraya giriniz..."
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="font-semibold text-foreground flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                Görsel Ek (Opsiyonel)
                            </Label>
                            <div className="border border-border/80 bg-background/50 rounded-[1.25rem] p-1 overflow-hidden">
                                <ImageUploader
                                    currentUrl={q.imageUrl}
                                    onUploadSuccess={(url) => updateQuestion(q.id, "imageUrl", url)}
                                    onClear={() => updateQuestion(q.id, "imageUrl", "")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sağ Kolon - Seçenekler */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <Label className="font-semibold text-foreground flex items-center justify-between">
                            <span>Seçenekler <span className="text-primary">*</span></span>
                            <span className="text-xs text-muted-foreground font-normal bg-input px-2 py-1 rounded-md">Doğru cevabı işaretleyin</span>
                        </Label>
                        
                        <div className="space-y-3">
                        {q.options.map((opt) => {
                            const isCorrect = q.correctOption === opt.label;
                            return (
                                <div 
                                    key={opt.label} 
                                    className={`relative flex items-center rounded-[1rem] border transition-all duration-200 overflow-hidden ${
                                        isCorrect ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border/80 bg-input/30 hover:border-border"
                                    }`}
                                >
                                    {/* Doğru Seçenek Belirleyici */}
                                    <button
                                        type="button"
                                        onClick={() => updateQuestion(q.id, "correctOption", opt.label)}
                                        className={`shrink-0 flex items-center justify-center w-12 h-12 transition-all ${
                                            isCorrect 
                                                ? "bg-primary text-primary-foreground" 
                                                : "bg-border/30 text-muted-foreground hover:bg-border/60 hover:text-foreground"
                                        }`}
                                    >
                                        {isCorrect ? <Check className="w-5 h-5 absolute" /> : <span className="font-heading font-extrabold text-lg">{opt.label}</span>}
                                        {isCorrect && <span className="font-heading font-extrabold text-lg opacity-0">{opt.label}</span>}
                                    </button>
                                    
                                    <Input
                                        value={opt.text}
                                        onChange={(e) => updateOption(q.id, opt.label, e.target.value)}
                                        placeholder={`${opt.label} şıkkı...`}
                                        className="flex-1 h-12 border-0 bg-transparent rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4 text-base"
                                    />
                                </div>
                            );
                        })}
                        </div>
                    </div>
                </div>
            </div>
            ))}
        </div>

        <div className="flex justify-center mt-10">
            <Button variant="outline" onClick={addQuestion} className="h-16 rounded-[1.5rem] border-2 border-dashed border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 w-full md:w-2/3 gap-3 font-heading font-bold text-lg transition-all group">
                <div className="bg-background rounded-full p-2 group-hover:scale-110 transition-transform">
                    <Plus className="h-5 w-5" />
                </div>
                Yeni Soru Ekle
            </Button>
        </div>
      </div>
    </div>
  );
}
