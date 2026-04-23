"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signout } from "@/app/(auth)/actions";
import type { User } from "@supabase/supabase-js";
import { LogOut, ChevronDown, Shield, GraduationCap, Radio, Menu } from "lucide-react";

export function NavbarClient({ user, role }: { user: User | null; role: string | null }) {
  // Rol bazlı panel linki
  const panelHref = "/dashboard";
  const panelLabel = role === "admin" ? "Yönetici Paneli" : "Öğrenci Paneli";
  const PanelIcon = role === "admin" ? Shield : GraduationCap;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm relative">
      <div className="container flex h-[4.5rem] items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex gap-4 md:gap-8 items-center">
          {user && role === "admin" && (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('toggleAdminDrawer'))}
              className="p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Yönetici Menüsünü Aç"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-primary/10 rounded-[12px] flex items-center justify-center border border-primary/10 group-hover:bg-primary/20 transition-colors">
               <span className="font-heading font-black text-xl text-primary">B</span>
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-foreground hidden sm:inline-block">
              Berkan Matematik
            </span>
          </Link>
          <nav className="hidden md:flex gap-6 mt-1 items-center">
            {/* Sınıflar Dropdown */}
            <div className="relative group/nav py-2">
              <button className="flex items-center gap-1 text-sm font-bold font-heading text-muted-foreground transition-colors hover:text-foreground cursor-pointer outline-none">
                Sınıflar
                <ChevronDown className="w-4 h-4 opacity-70 group-hover/nav:-rotate-180 transition-transform duration-300" />
              </button>
              
              <div className="absolute top-full left-0 mt-1 w-48 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-1 translate-y-2 transition-all duration-200 z-50">
                <div className="bg-background/95 border border-border/50 rounded-xl shadow-2xl p-2 flex flex-col gap-1 backdrop-blur-xl">
                  <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-primary/70">Ortaokul</div>
                  <Link href="/sinif/5-sinif" className="text-sm font-bold font-heading text-muted-foreground hover:text-foreground hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors">5. Sınıf</Link>
                  <Link href="/sinif/6-sinif" className="text-sm font-bold font-heading text-muted-foreground hover:text-foreground hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors">6. Sınıf</Link>
                  <Link href="/sinif/7-sinif" className="text-sm font-bold font-heading text-muted-foreground hover:text-foreground hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors">7. Sınıf</Link>
                  <Link href="/sinif/lgs" className="text-sm font-black font-heading text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 px-3 py-2 rounded-lg transition-colors">LGS</Link>
                  
                  <div className="w-full h-px bg-border/50 my-1"></div>
                  
                  <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-primary/70">Lise</div>
                  <Link href="/sinif/9-sinif" className="text-sm font-bold font-heading text-muted-foreground hover:text-foreground hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors">9. Sınıf</Link>
                  <Link href="/sinif/10-sinif" className="text-sm font-bold font-heading text-muted-foreground hover:text-foreground hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors">10. Sınıf</Link>
                  <Link href="/sinif/11-sinif" className="text-sm font-bold font-heading text-muted-foreground hover:text-foreground hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors">11. Sınıf</Link>
                  <Link href="/sinif/tyt-ayt" className="text-sm font-black font-heading text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 px-3 py-2 rounded-lg transition-colors">TYT-AYT</Link>
                </div>
              </div>
            </div>


            <Link
              href="/exams"
              className="flex items-center text-sm font-bold font-heading text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              Sınavlar
            </Link>



            <Link
              href="/canli-ders"
              className="flex items-center gap-1.5 text-sm font-bold font-heading text-red-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Canlı Ders
            </Link>

            {/* Giriş yapmış kullanıcılara rol bazlı panel linki */}
            {user && (
              <Link
                href={panelHref}
                className="flex items-center gap-1.5 text-sm font-bold font-heading text-primary transition-colors hover:text-primary/80 cursor-pointer"
              >
                <PanelIcon className="w-4 h-4" />
                {panelLabel}
              </Link>
            )}
            

            

          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <span className="text-sm font-semibold font-sans text-muted-foreground hidden sm:inline-block truncate max-w-[160px] bg-input/50 px-3 py-1.5 rounded-full border border-border/50">
                {user.email}
              </span>
              <form action={signout}>
                <button type="submit" className="text-sm font-bold font-heading text-muted-foreground hover:text-destructive flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Çıkış</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <span className="text-sm font-bold font-heading text-muted-foreground hover:text-foreground transition-colors hidden sm:block px-4 cursor-pointer">
                  Giriş Yap
                </span>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-bold text-sm shadow-[0_4px_12px_rgba(0,103,98,0.2)] rounded-full px-6 h-10 border-0 hover:shadow-[0_8px_16px_rgba(0,103,98,0.3)] hover:-translate-y-px transition-all cursor-pointer">
                  Kayıt Ol
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
