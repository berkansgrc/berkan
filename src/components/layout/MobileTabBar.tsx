"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home2, Layer, DocumentText, Radio, User } from "iconsax-react";
import { MobileClassesDrawer } from "./MobileClassesDrawer";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function MobileTabBar({ user }: { user: SupabaseUser | null }) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Panel yolunu belirle
  const panelHref = user ? "/dashboard" : "/login";

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[60] md:hidden bg-background/90 backdrop-blur-2xl border-t border-border/50 pb-2 pt-1 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-14 px-2">
          {/* Ana Sayfa */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
              pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home2 size={24} variant={pathname === "/" ? "Bold" : "Outline"} />
            <span className="text-[10px] font-bold">Ana Sayfa</span>
          </Link>

          {/* Sınıflar (Opens Drawer) */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
              isDrawerOpen ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layer size={24} variant={isDrawerOpen ? "Bold" : "Outline"} />
            <span className="text-[10px] font-bold">Sınıflar</span>
          </button>

          {/* Sınavlar */}
          <Link
            href="/exams"
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
              pathname === "/exams" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <DocumentText size={24} variant={pathname === "/exams" ? "Bold" : "Outline"} />
            <span className="text-[10px] font-bold">Sınavlar</span>
          </Link>

          {/* Canlı Ders */}
          <Link
            href="/canli-ders"
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
              pathname === "/canli-ders" ? "text-red-500" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="relative">
              {pathname !== "/canli-ders" && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              )}
              <Radio size={24} variant={pathname === "/canli-ders" ? "Bold" : "Outline"} />
            </span>
            <span className="text-[10px] font-bold">Canlı</span>
          </Link>

          {/* Panel / Giriş */}
          <Link
            href={panelHref}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
              pathname.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User size={24} variant={pathname.startsWith("/dashboard") ? "Bold" : "Outline"} />
            <span className="text-[10px] font-bold">{user ? "Panel" : "Giriş"}</span>
          </Link>
        </div>
      </div>

      <MobileClassesDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
