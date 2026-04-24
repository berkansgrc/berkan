"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { MessageQuestion, CloseCircle, Send, TickCircle } from "iconsax-react";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("suggestion");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setStatus("submitting");
    try {
      const response = await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID || "mldgpdre"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedback,
          category,
          page: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });

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
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" }}
            className="w-[320px] bg-background/80 backdrop-blur-2xl border border-border/50 rounded-3xl shadow-2xl p-6 pointer-events-auto overflow-hidden relative"
          >
            {/* Background Blob */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="font-heading font-black text-xl text-foreground">Geri Bildirim</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <CloseCircle size={24} variant="Outline" />
              </button>
            </div>

            {status === "success" ? (
              <m.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
                   <TickCircle size={32} className="text-emerald-500" variant="Bold" />
                </div>
                <p className="font-heading font-bold text-foreground">Teşekkürler!</p>
                <p className="text-sm text-muted-foreground mt-2">Mesajınız başarıyla iletildi.</p>
              </m.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/70 px-1">Kategori</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "suggestion", label: "Öneri" },
                      { id: "bug", label: "Hata" },
                      { id: "praise", label: "Beğeni" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-all ${
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

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/70 px-1">Mesajınız</label>
                  <textarea
                    required
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Görüşlerinizi buraya yazın..."
                    className="w-full h-32 bg-input/50 border border-border/50 rounded-2xl p-4 text-sm outline-none focus:border-primary/50 transition-colors resize-none placeholder:text-muted-foreground/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full h-12 bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-black rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {status === "submitting" ? (
                    "Gönderiliyor..."
                  ) : (
                    <>
                      <span>Gönder</span>
                      <Send size={18} variant="Outline" className="rotate-45" />
                    </>
                  )}
                </button>
                
                {status === "error" && (
                  <p className="text-[10px] text-center text-destructive font-bold">Bir hata oluştu, lütfen tekrar deneyin.</p>
                )}
              </form>
            )}
          </m.div>
        )}
      </AnimatePresence>

      <m.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl border border-border/50 backdrop-blur-xl transition-all pointer-events-auto ${
          isOpen 
            ? "bg-background text-foreground rotate-90" 
            : "bg-gradient-to-br from-primary to-[#005a55] text-white"
        }`}
      >
        {isOpen ? (
          <CloseCircle size={32} variant="Outline" />
        ) : (
          <MessageQuestion size={32} variant="Outline" />
        )}
      </m.button>
    </div>
  );
}
