"use client";

import { HambergerMenu } from "iconsax-react";

export default function AdminMobileHeader() {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border/50 z-40 flex items-center px-4 justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary/10 rounded-[10px] flex items-center justify-center border border-primary/20">
          <span className="font-heading font-black text-sm text-primary leading-none">B</span>
        </div>
        <span className="font-heading font-extrabold text-sm tracking-tight text-foreground">
          Berkan Matematik
        </span>
      </div>
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("toggleAdminDrawer"))}
        className="p-2 -mr-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
        aria-label="Yönetici Menüsünü Aç"
      >
        <HambergerMenu color="currentColor" size={24} variant="Outline" />
      </button>
    </div>
  );
}
