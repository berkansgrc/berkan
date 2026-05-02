"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signout } from "@/app/(auth)/actions";
import type { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Logout, ArrowDown2, ShieldTick, Teacher, Radio, HambergerMenu } from "iconsax-react";
import NotificationBell from "@/components/notifications/NotificationBell";

// ─── Sınıf verileri ───────────────────────────────────────────────────────────
const ORTAOKUL = [
  { href: "/sinif/5-sinif",  label: "5. Sınıf",  badge: "5",   special: false },
  { href: "/sinif/6-sinif",  label: "6. Sınıf",  badge: "6",   special: false },
  { href: "/sinif/7-sinif",  label: "7. Sınıf",  badge: "7",   special: false },
  { href: "/sinif/lgs",      label: "LGS",        badge: "🎯",  special: true  },
];
const LISE = [
  { href: "/sinif/9-sinif",  label: "9. Sınıf",  badge: "9",   special: false },
  { href: "/sinif/10-sinif", label: "10. Sınıf", badge: "10",  special: false },
  { href: "/sinif/11-sinif", label: "11. Sınıf", badge: "11",  special: false },
  { href: "/sinif/tyt-ayt",  label: "TYT-AYT",   badge: "🏆",  special: true  },
];

// ─── Floating Navbar ───────────────────────────────────────────────────────────
export function NavbarClient({ user, role }: { user: User | null; role: string | null }) {
  const pathname   = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const panelHref  = "/dashboard";
  const panelLabel = role === "admin" ? "Yönetici Paneli" : "Öğrenci Paneli";
  const PanelIcon  = role === "admin" ? ShieldTick : Teacher;

  // Scroll morph
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Aktif link helper
  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  // Admin sayfalarında global navbar'ı gizle
  if (pathname.startsWith("/admin")) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-500 ease-out ${
        scrolled
          ? "top-3 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl"
          : "top-0 left-0 w-full"
      }`}
    >
      <header
        className={`w-full transition-all duration-500 ease-out ${
          scrolled
            ? "rounded-2xl border border-border/30 bg-background/90 backdrop-blur-2xl shadow-xl shadow-black/[0.06]"
            : "border-b border-border/40 bg-background/80 backdrop-blur-xl shadow-sm"
        }`}
      >
        <div className="container flex h-[4rem] items-center justify-between px-5 lg:px-8 max-w-7xl mx-auto">

          {/* ─ Sol: Hamburger + Logo + Nav ─ */}
          <div className="flex gap-3 md:gap-7 items-center">

            {/* Admin Hamburger */}
            {user && role === "admin" && (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("toggleAdminDrawer"))}
                className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Yönetici Menüsünü Aç"
              >
                <HambergerMenu color="currentColor" size={22} variant="Outline" />
              </button>
            )}

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-9 h-9 bg-primary/10 rounded-[10px] flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
                <span className="font-heading font-black text-lg text-primary leading-none">B</span>
              </div>
              <span className="font-heading font-extrabold text-lg tracking-tight text-foreground hidden sm:inline-block">
                Berkan Matematik
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-1 mt-0.5 items-center">

              {/* Sınıflar Mega-Menu */}
              <div className="relative group/nav">
                <button className="flex items-center gap-1 text-sm font-bold font-heading text-muted-foreground hover:text-foreground transition-all duration-200 hover:-translate-y-px px-3 py-2 rounded-xl hover:bg-muted/60 outline-none cursor-pointer">
                  Sınıflar
                  <ArrowDown2
                    color="currentColor"
                    size={14}
                    className="opacity-60 group-hover/nav:-rotate-180 transition-transform duration-300"
                    variant="Outline"
                  />
                </button>

                {/* Mega-Menu Panel */}
                <div className="absolute top-full left-0 mt-2 w-[400px] opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible translate-y-1 group-hover/nav:translate-y-0 scale-95 group-hover/nav:scale-100 transition-all duration-200 origin-top-left z-50">
                  <div className="bg-background/98 border border-border/50 rounded-2xl shadow-2xl shadow-black/[0.08] p-4 backdrop-blur-xl">

                    {/* Grid: 2 sütun */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Ortaokul */}
                      <div>
                        <div className="px-2 pb-2 text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-1.5">
                          <span className="w-3 h-[2px] bg-primary/40 rounded-full inline-block" />
                          Ortaokul
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {ORTAOKUL.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-bold font-heading transition-all duration-150 group/item ${
                                item.special
                                  ? "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                              }`}
                            >
                              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 transition-all duration-150 group-hover/item:scale-110 ${
                                item.special
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-muted text-muted-foreground"
                              }`}>
                                {item.badge}
                              </span>
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Lise */}
                      <div>
                        <div className="px-2 pb-2 text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-1.5">
                          <span className="w-3 h-[2px] bg-primary/40 rounded-full inline-block" />
                          Lise
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {LISE.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-bold font-heading transition-all duration-150 group/item ${
                                item.special
                                  ? "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                              }`}
                            >
                              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 transition-all duration-150 group-hover/item:scale-110 ${
                                item.special
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-muted text-muted-foreground"
                              }`}>
                                {item.badge}
                              </span>
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Ayırıcı + Footer link */}
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <Link
                        href="/sinif"
                        className="flex items-center justify-center gap-1.5 text-xs font-bold font-heading text-primary/70 hover:text-primary transition-colors"
                      >
                        Tüm Sınıfları Gör
                        <span className="text-base leading-none">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sınavlar */}
              <NavLink href="/exams" active={isActive("/exams")}>
                Sınavlar
              </NavLink>

              {/* Canlı Ders */}
              <Link
                href="/canli-ders"
                className={`flex items-center gap-1.5 text-sm font-bold font-heading px-3 py-2 rounded-xl transition-all duration-200 hover:-translate-y-px cursor-pointer ${
                  isActive("/canli-ders")
                    ? "text-red-500 bg-red-50"
                    : "text-red-500 hover:text-red-600 hover:bg-red-50/70"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                Canlı Ders
              </Link>

              {/* Panel (giriş yapmışsa) */}
              {user && (
                <NavLink href={panelHref} active={isActive(panelHref)}>
                  <PanelIcon className="w-3.5 h-3.5" variant="Bold" />
                  {panelLabel}
                </NavLink>
              )}
            </nav>
          </div>

          {/* ─ Sağ: Auth ─ */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <NotificationBell userId={user.id} />
                <span className="text-sm font-semibold font-sans text-muted-foreground hidden sm:inline-block truncate max-w-[150px] bg-muted/60 px-3 py-1.5 rounded-full border border-border/50">
                  {user.email}
                </span>
                <form action={signout}>
                  <button
                    type="submit"
                    className="text-sm font-bold font-heading text-muted-foreground hover:text-destructive flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-destructive/10 transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-95"
                  >
                    <Logout color="currentColor" size={16} variant="Outline" />
                    <span className="hidden sm:inline">Çıkış</span>
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">
                  <span className="text-sm font-bold font-heading text-muted-foreground hover:text-foreground transition-all duration-200 hidden sm:block px-3 py-2 rounded-xl hover:bg-muted/60 cursor-pointer">
                    Giriş Yap
                  </span>
                </Link>
                <Link href="/register">
                  {/* Shimmer CTA */}
                  <Button className="relative overflow-hidden bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-bold text-sm rounded-full px-5 h-9 border-0 shadow-[0_4px_14px_rgba(0,103,98,0.25)] hover:shadow-[0_6px_20px_rgba(0,103,98,0.4)] hover:-translate-y-px transition-all duration-200 cursor-pointer group/cta">
                    <span className="relative z-10">Kayıt Ol</span>
                    {/* Shimmer overlay */}
                    <span className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 ease-in-out" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

// ─── Animated Nav Link ──────────────────────────────────────────────────────────
function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-1.5 text-sm font-bold font-heading px-3 py-2 rounded-xl transition-all duration-200 hover:-translate-y-px cursor-pointer ${
        active
          ? "text-primary bg-primary/10"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
      }`}
    >
      {children}
      {/* Aktif sayfa pill indicator */}
      <AnimatePresence>
        {active && (
          <m.span
            layoutId="nav-active-pill"
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </AnimatePresence>
    </Link>
  );
}
