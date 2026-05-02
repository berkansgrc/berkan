"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { CloseCircle, Send, TickCircle } from "iconsax-react";

// ─── Premium Geri Bildirim İkonu ────────────────────────────────────────────────
function FeedbackIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Konuşma balonu gövdesi */}
      <path
        d="M12 2C6.477 2 2 6.145 2 11.25c0 2.278.87 4.36 2.307 5.972L3.5 21l4.565-1.424A10.26 10.26 0 0 0 12 20.5c5.523 0 10-4.145 10-9.25S17.523 2 12 2Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Üç nokta — düşünce/fikir */}
      <circle cx="8.5" cy="11.25" r="1.1" fill="currentColor" />
      <circle cx="12"  cy="11.25" r="1.1" fill="currentColor" />
      <circle cx="15.5" cy="11.25" r="1.1" fill="currentColor" />
      {/* Küçük yıldız / fikir işareti */}
      <path
        d="M19 5.5l.4 1 1 .4-1 .4-.4 1-.4-1-1-.4 1-.4.4-1Z"
        fill="currentColor"
        fillOpacity="0.8"
      />
    </svg>
  );
}

export function FeedbackButton() {
  const [isOpen, setIsOpen]   = useState(false);
  const [status, setStatus]   = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("suggestion");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setStatus("submitting");
    try {
      const response = await fetch(
        `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID || "mldgpdre"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            feedback,
            category,
            page: window.location.href,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        setStatus("success");
        setFeedback("");
        setTimeout(() => {
          setIsOpen(false);
          setStatus("idle");
        }, 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    /*
     * Konum:
     *   Mobil  → bottom-[calc(3.5rem+1.5rem)] = tab bar (56px) + boşluk (24px) = 80px
     *   Desktop → bottom-6 (tab bar yok)
     */
    <div className="fixed bottom-[5.5rem] md:bottom-6 right-4 md:right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">

      {/* ─ Feedback Paneli ─ */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 16, scale: 0.92, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0,  scale: 1,    filter: "blur(0px)" }}
            exit={{   opacity: 0, y: 16, scale: 0.92, filter: "blur(8px)" }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="w-[300px] sm:w-[320px] bg-background/85 backdrop-blur-2xl border border-border/50 rounded-3xl shadow-2xl shadow-black/[0.1] p-5 pointer-events-auto overflow-hidden relative"
          >
            {/* Dekoratif arka plan blob */}
            <div className="absolute -top-8 -right-8 w-28 h-28 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            {/* Başlık */}
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <FeedbackIcon />
                </div>
                <h3 className="font-heading font-black text-base text-foreground">Geri Bildirim</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-lg"
              >
                <CloseCircle size={22} variant="Outline" />
              </button>
            </div>

            {/* İçerik */}
            {status === "success" ? (
              <m.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3 border border-emerald-500/20">
                  <TickCircle size={28} className="text-emerald-500" variant="Bold" />
                </div>
                <p className="font-heading font-bold text-foreground">Teşekkürler!</p>
                <p className="text-sm text-muted-foreground mt-1.5">Mesajınız başarıyla iletildi.</p>
              </m.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                {/* Kategori */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 px-0.5">
                    Kategori
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "suggestion", label: "💡 Öneri" },
                      { id: "bug",        label: "🐛 Hata"  },
                      { id: "praise",     label: "🌟 Beğeni" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all ${
                          category === cat.id
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-input/50 border-border/50 text-muted-foreground hover:border-border"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 px-0.5">
                    Mesajınız
                  </label>
                  <textarea
                    required
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Görüşlerinizi buraya yazın..."
                    className="w-full h-28 bg-input/50 border border-border/50 rounded-2xl p-3 text-sm outline-none focus:border-primary/50 transition-colors resize-none placeholder:text-muted-foreground/50"
                  />
                </div>

                {/* Gönder */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full h-11 bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-black rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {status === "submitting" ? (
                    "Gönderiliyor..."
                  ) : (
                    <>
                      <span>Gönder</span>
                      <Send size={16} variant="Outline" className="rotate-45" />
                    </>
                  )}
                </button>

                {status === "error" && (
                  <p className="text-[10px] text-center text-destructive font-bold">
                    Bir hata oluştu, lütfen tekrar deneyin.
                  </p>
                )}
              </form>
            )}
          </m.div>
        )}
      </AnimatePresence>

      {/* ─ FAB Butonu ─ */}
      <m.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-13 h-13 w-[52px] h-[52px] rounded-2xl flex items-center justify-center shadow-2xl border transition-all duration-300 pointer-events-auto ${
          isOpen
            ? "bg-background border-border/50 text-foreground backdrop-blur-xl"
            : "bg-gradient-to-br from-primary to-[#005a55] border-primary/20 text-white shadow-primary/25"
        }`}
        aria-label="Geri bildirim gönder"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <m.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{    rotate: 90,  opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <CloseCircle size={24} variant="Outline" />
            </m.span>
          ) : (
            <m.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0,  opacity: 1 }}
              exit={{    rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <FeedbackIcon />
            </m.span>
          )}
        </AnimatePresence>
      </m.button>
    </div>
  );
}
