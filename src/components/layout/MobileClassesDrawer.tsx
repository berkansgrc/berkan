"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CloseSquare } from "iconsax-react";

interface MobileClassesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileClassesDrawer({ isOpen, onClose }: MobileClassesDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Kapatmak için dışarı tıklama
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[70] bg-card border-t border-border/50 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-out flex flex-col max-h-[85vh] md:hidden ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
          <div>
            <h3 className="font-heading font-extrabold text-xl text-foreground">Sınıflar</h3>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">Seviyeni seç ve öğrenmeye başla</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-input/50 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <CloseSquare size={24} variant="TwoTone" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 pb-10">
          <div>
            <div className="text-[11px] font-black uppercase tracking-widest text-primary/70 mb-3 px-1">Ortaokul</div>
            <div className="grid grid-cols-2 gap-3">
              <Link onClick={onClose} href="/sinif/5-sinif" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-input/40 border border-border/40 hover:bg-primary/10 hover:border-primary/30 transition-colors">
                <span className="font-heading font-bold text-foreground">5. Sınıf</span>
              </Link>
              <Link onClick={onClose} href="/sinif/6-sinif" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-input/40 border border-border/40 hover:bg-primary/10 hover:border-primary/30 transition-colors">
                <span className="font-heading font-bold text-foreground">6. Sınıf</span>
              </Link>
              <Link onClick={onClose} href="/sinif/7-sinif" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-input/40 border border-border/40 hover:bg-primary/10 hover:border-primary/30 transition-colors">
                <span className="font-heading font-bold text-foreground">7. Sınıf</span>
              </Link>
              <Link onClick={onClose} href="/sinif/lgs" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                <span className="font-heading font-black text-blue-600 dark:text-blue-400">LGS</span>
              </Link>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-black uppercase tracking-widest text-primary/70 mb-3 px-1">Lise</div>
            <div className="grid grid-cols-2 gap-3">
              <Link onClick={onClose} href="/sinif/9-sinif" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-input/40 border border-border/40 hover:bg-primary/10 hover:border-primary/30 transition-colors">
                <span className="font-heading font-bold text-foreground">9. Sınıf</span>
              </Link>
              <Link onClick={onClose} href="/sinif/10-sinif" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-input/40 border border-border/40 hover:bg-primary/10 hover:border-primary/30 transition-colors">
                <span className="font-heading font-bold text-foreground">10. Sınıf</span>
              </Link>
              <Link onClick={onClose} href="/sinif/11-sinif" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-input/40 border border-border/40 hover:bg-primary/10 hover:border-primary/30 transition-colors">
                <span className="font-heading font-bold text-foreground">11. Sınıf</span>
              </Link>
              <Link onClick={onClose} href="/sinif/tyt-ayt" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                <span className="font-heading font-black text-blue-600 dark:text-blue-400">TYT-AYT</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
