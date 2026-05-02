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

  const panelHref = user ? "/dashboard" : "/login";

  // Admin sayfalarında global tabbar'ı gizle
  if (pathname.startsWith("/admin")) return null;

  const tabs = [
    {
      id: "home",
      href: "/",
      label: "Ana Sayfa",
      icon: Home2,
      active: pathname === "/",
    },
    {
      id: "siniflar",
      href: null,
      label: "Sınıflar",
      icon: Layer,
      active: isDrawerOpen,
    },
    {
      id: "exams",
      href: "/exams",
      label: "Sınavlar",
      icon: DocumentText,
      active: pathname === "/exams",
    },
    {
      id: "canli",
      href: "/canli-ders",
      label: "Canlı",
      icon: Radio,
      active: pathname === "/canli-ders",
      isLive: true,
    },
    {
      id: "user",
      href: panelHref,
      label: user ? "Panel" : "Giriş",
      icon: User,
      active: pathname.startsWith("/dashboard"),
    },
  ];

  return (
    <>
      {/* Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] md:hidden">
        {/* Glassmorphism arka plan */}
        <div className="bg-background/85 backdrop-blur-2xl border-t border-border/40 shadow-[0_-8px_32px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const content = (
                <span className="relative flex flex-col items-center justify-center w-full gap-0.5 py-2">
                  {/* Aktif ikon — micro lift */}
                  <span
                    className={`relative transition-all duration-200 ${
                      tab.active ? "-translate-y-0.5 scale-110" : "scale-100"
                    }`}
                  >
                    {/* Canlı ders badge */}
                    {tab.isLive && !tab.active && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 z-10">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                      </span>
                    )}
                    <Icon
                      size={24}
                      variant={tab.active ? "Bold" : "Outline"}
                      color={
                        tab.isLive
                          ? tab.active
                            ? "#ef4444"
                            : "currentColor"
                          : "currentColor"
                      }
                    />
                  </span>

                  {/* Label */}
                  <span
                    className={`text-[10px] font-bold tracking-tight transition-all duration-200 ${
                      tab.active
                        ? tab.isLive
                          ? "text-red-500"
                          : "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {tab.label}
                  </span>

                  {/* Aktif dot indicator */}
                  {tab.active && (
                    <span
                      className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
                        tab.isLive ? "bg-red-500" : "bg-primary"
                      }`}
                    />
                  )}
                </span>
              );

              // Drawer trigger (Sınıflar)
              if (!tab.href) {
                return (
                  <button
                    key={tab.id}
                    onClick={() => setIsDrawerOpen(true)}
                    className={`flex-1 transition-colors ${
                      tab.active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`flex-1 transition-colors ${
                    tab.isLive
                      ? tab.active
                        ? "text-red-500"
                        : "text-muted-foreground hover:text-red-400"
                      : tab.active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <MobileClassesDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
