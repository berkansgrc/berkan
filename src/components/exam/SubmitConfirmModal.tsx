"use client";

import { m, AnimatePresence } from "framer-motion";
import { CheckCircle2, Flag, MinusCircle, AlertTriangle, X } from "lucide-react";

type Props = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  totalQuestions: number;
  answeredCount: number;
  flaggedCount: number;
};

export default function SubmitConfirmModal({
  open,
  onConfirm,
  onCancel,
  totalQuestions,
  answeredCount,
  flaggedCount,
}: Props) {
  const blankCount = totalQuestions - answeredCount;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <m.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md rounded-[2rem] border border-border/50 bg-card/95 backdrop-blur-2xl shadow-[0_32px_64px_rgba(0,0,0,0.2)] p-8 relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />

              {/* Close button */}
              <button
                onClick={onCancel}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-input/50 border border-border/50 flex items-center justify-center hover:bg-input transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full" />
                  <div className="relative w-16 h-16 rounded-[1.25rem] bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-7 relative z-10">
                <h2 className="text-2xl font-heading font-extrabold text-foreground mb-2">
                  Sınavı Bitirmek Üzeresin!
                </h2>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  Gönderdikten sonra cevaplarını değiştiremezsin.
                  Emin misin?
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-7 relative z-10">
                <div className="rounded-[1.25rem] bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
                  <p className="text-xl font-heading font-black text-emerald-600">{answeredCount}</p>
                  <p className="text-[10px] font-bold text-emerald-700/70 uppercase tracking-wider mt-0.5">Cevaplandı</p>
                </div>
                <div className="rounded-[1.25rem] bg-amber-400/10 border border-amber-400/20 p-4 text-center">
                  <MinusCircle className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
                  <p className="text-xl font-heading font-black text-amber-600">{blankCount}</p>
                  <p className="text-[10px] font-bold text-amber-700/70 uppercase tracking-wider mt-0.5">Boş</p>
                </div>
                <div className="rounded-[1.25rem] bg-blue-500/10 border border-blue-500/20 p-4 text-center">
                  <Flag className="w-5 h-5 text-blue-500 mx-auto mb-1.5" />
                  <p className="text-xl font-heading font-black text-blue-600">{flaggedCount}</p>
                  <p className="text-[10px] font-bold text-blue-700/70 uppercase tracking-wider mt-0.5">İşaretli</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 relative z-10">
                <button
                  onClick={onConfirm}
                  className="w-full h-13 rounded-[1.25rem] bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-extrabold text-base shadow-[0_8px_20px_rgba(0,103,98,0.3)] hover:shadow-[0_12px_28px_rgba(0,103,98,0.4)] hover:-translate-y-0.5 transition-all py-3.5"
                >
                  Evet, Sınavı Gönder
                </button>
                <button
                  onClick={onCancel}
                  className="w-full h-13 rounded-[1.25rem] bg-input/50 border border-border/60 text-foreground font-heading font-bold text-base hover:bg-input transition-colors py-3.5"
                >
                  Geri Dön, Kontrol Edeyim
                </button>
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
