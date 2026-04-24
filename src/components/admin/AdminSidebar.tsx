"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signout } from "@/app/(auth)/actions";
import NotificationCenter from "@/components/admin/NotificationCenter";
import {
  ShieldTick,
  Category,
  Book,
  Radio,
  Profile2User,
  Logout,
  ArrowRight2,
  Teacher,
  VideoPlay,
  CloseCircle,
  Chart,
} from "iconsax-react";

const navItems = [
  {
    label: "Genel Bakış",
    href: "/admin",
    icon: Category,
    exact: true,
  },
  {
    label: "İçerik Yönetimi",
    href: "/admin/icerikler",
    icon: Teacher,
  },
  {
    label: "Sınav Yönetimi",
    href: "/admin/exams",
    icon: Book,
  },
  {
    label: "Canlı Ders",
    href: "/admin/canli-ders",
    icon: Radio,
    badge: "CANLI",
  },
  {
    label: "Özel Dersler",
    href: "/admin/lessons",
    icon: VideoPlay,
  },
  {
    label: "Kullanıcılar",
    href: "/admin/kullanici",
    icon: Profile2User,
  },
  {
    label: "Analitik",
    href: "/admin/analitik",
    icon: Chart,
  },
];

export default function AdminSidebar({
  fullName,
  email,
}: {
  fullName: string | null;
  email: string;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggleAdminDrawer", handleToggle);
    return () => window.removeEventListener("toggleAdminDrawer", handleToggle);
  }, []);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-background/80 backdrop-blur-md z-[60] transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-card/60 backdrop-blur-3xl border-r border-border/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] lg:shadow-none z-[70] flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-64 bg-primary/5 blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-border/50 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-default">
              <div className="absolute inset-0 bg-primary/40 blur-xl rounded-xl group-hover:bg-primary/60 transition-colors duration-500" />
              <div className="relative w-12 h-12 rounded-[14px] bg-gradient-to-br from-primary to-[#005a55] border border-white/10 flex items-center justify-center text-white shadow-xl shadow-primary/20">
                <ShieldTick color="currentColor" size={24} className="w-6 h-6" variant="Bulk" />
              </div>
            </div>
            <div>
              <p className="font-heading font-black text-foreground text-base tracking-tight">Yönetim Paneli</p>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5">
                Berkan Matematik
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <NotificationCenter />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/50 transition-all active:scale-95 lg:hidden"
              aria-label="Kapat"
            >
              <CloseCircle color="currentColor" size={24} className="w-6 h-6" variant="Outline" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto relative z-10 scrollbar-hide">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-3 py-3">
            Ana Menü
          </p>
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-3 px-4 py-3.5 rounded-[14px] transition-all duration-300 relative overflow-hidden ${
                  active
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                )}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_12px_rgba(var(--primary),0.5)]" />
                )}
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                    active ? "text-primary scale-110" : "group-hover:scale-110"
                  }`}
                  variant={active ? "Bulk" : "Outline"}
                />
                <span className={`font-heading text-sm flex-1 ${active ? 'font-black' : 'font-bold'}`}>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-black uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-[0_0_12px_rgba(239,68,68,0.2)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    {item.badge}
                  </span>
                )}
                {active && <ArrowRight2 color="currentColor" size={24} className="w-4 h-4 text-primary/50 translate-x-1" variant="Outline" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Info */}
        <div className="p-4 border-t border-border/50 relative z-10 bg-background/50">
          <div className="rounded-[16px] bg-muted/40 border border-border/50 p-3 flex items-center gap-3 backdrop-blur-md group hover:bg-muted/60 transition-colors">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-md rounded-full group-hover:bg-primary/50 transition-colors" />
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[#005a55] flex items-center justify-center text-primary-foreground font-heading font-black text-sm flex-shrink-0 shadow-sm border border-white/10">
                {initials}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-black text-foreground text-[13px] truncate">
                {fullName || "Admin"}
              </p>
              <p className="text-[11px] font-medium text-muted-foreground truncate">{email}</p>
            </div>
            <form action={signout}>
              <button
                type="submit"
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all text-muted-foreground active:scale-95"
                title="Çıkış Yap"
              >
                <Logout color="currentColor" size={24} className="w-4 h-4" variant="Outline" />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
