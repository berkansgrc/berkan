"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signout } from "@/app/(auth)/actions";
import {
  ShieldTick,
  Category,
  Book,
  Radio,
  Profile2User,
  Logout,
  ArrowRight2,
  Setting2,
  Teacher,
  VideoPlay,
  CloseCircle,
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
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-card border-r border-border/50 shadow-2xl lg:shadow-none z-[70] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-md rounded-xl" />
              <div className="relative w-10 h-10 rounded-[10px] bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-lg">
                <ShieldTick color="currentColor" size={24} className="w-5 h-5" variant="Bold" />
              </div>
            </div>
            <div>
              <p className="font-heading font-black text-foreground text-sm">Admin Paneli</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                Berkan Matematik
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
            aria-label="Kapat"
          >
            <CloseCircle color="currentColor" size={24} className="w-5 h-5 lg:hidden" variant="Bold" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-3 py-2">
            Menü
          </p>
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all duration-200 relative ${
                  active
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
                )}
                <item.icon
                  className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    active ? "text-primary" : ""
                  }`}
                  variant={active ? "Bold" : "Outline"}
                />
                <span className="font-heading font-bold text-sm flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-black uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-500 animate-ping" />
                    {item.badge}
                  </span>
                )}
                {active && <ArrowRight2 color="currentColor" size={24} className="w-3 h-3 text-primary/50" variant="Bold" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Info */}
        <div className="p-4 border-t border-border/50">
          <div className="rounded-[12px] bg-muted/40 border border-border/50 p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-[#005a55] flex items-center justify-center text-primary-foreground font-heading font-black text-sm flex-shrink-0 shadow-sm">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-foreground text-[13px] truncate">
                {fullName || "Admin"}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">{email}</p>
            </div>
            <form action={signout}>
              <button
                type="submit"
                className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
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
