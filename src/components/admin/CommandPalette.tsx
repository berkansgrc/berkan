"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { m, AnimatePresence } from "framer-motion";
import {
  Category,
  Teacher,
  Book,
  Radio,
  VideoPlay,
  Profile2User,
  Chart,
  AddCircle,
  SearchNormal1,
  CloseCircle,
  ArrowRight2,
  Clock,
  Command as CommandIcon,
} from "iconsax-react";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
  group: string;
  keywords?: string[];
}

const NAVIGATION_ITEMS: CommandItem[] = [
  {
    id: "dashboard",
    label: "Genel Bakış",
    description: "Ana yönetim paneli",
    icon: Category,
    href: "/admin",
    group: "Sayfalar",
    keywords: ["anasayfa", "panel", "dashboard"],
  },
  {
    id: "icerikler",
    label: "İçerik Yönetimi",
    description: "Dersler ve materyaller",
    icon: Teacher,
    href: "/admin/icerikler",
    group: "Sayfalar",
    keywords: ["ders", "konu", "materyal", "video"],
  },
  {
    id: "exams",
    label: "Sınav Yönetimi",
    description: "Sınavlar ve soru bankaları",
    icon: Book,
    href: "/admin/exams",
    group: "Sayfalar",
    keywords: ["sınav", "test", "deneme", "soru"],
  },
  {
    id: "canli-ders",
    label: "Canlı Ders",
    description: "YouTube yayın yönetimi",
    icon: Radio,
    href: "/admin/canli-ders",
    group: "Sayfalar",
    keywords: ["canlı", "yayın", "stream", "youtube"],
  },
  {
    id: "lessons",
    label: "Özel Dersler",
    description: "Birebir ders programı",
    icon: VideoPlay,
    href: "/admin/lessons",
    group: "Sayfalar",
    keywords: ["özel", "birebir", "program"],
  },
  {
    id: "kullanici",
    label: "Kullanıcılar",
    description: "Öğrenci ve yönetici listesi",
    icon: Profile2User,
    href: "/admin/kullanici",
    group: "Sayfalar",
    keywords: ["öğrenci", "admin", "kullanıcı", "kayıt"],
  },
  {
    id: "analitik",
    label: "Analitik",
    description: "Sınav başarı analizleri ve raporlar",
    icon: Chart,
    href: "/admin/analitik",
    group: "Sayfalar",
    keywords: ["analiz", "rapor", "istatistik", "grafik", "başarı"],
  },
];

const ACTION_ITEMS: CommandItem[] = [
  {
    id: "new-exam",
    label: "Yeni Sınav Oluştur",
    description: "Soru bankasına yeni sınav ekle",
    icon: AddCircle,
    href: "/admin/exams/new",
    group: "Hızlı Aksiyonlar",
    keywords: ["oluştur", "yeni", "sınav", "ekle"],
  },
  {
    id: "go-canli",
    label: "Canlı Dersi Yönet",
    description: "Yayını başlat veya güncelle",
    icon: Radio,
    href: "/admin/canli-ders",
    group: "Hızlı Aksiyonlar",
    keywords: ["başlat", "yayın", "canlı"],
  },
];

const MAX_RECENT = 5;
const STORAGE_KEY = "admin-cmd-recent";

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function addRecentSearch(label: string) {
  const recent = getRecentSearches().filter((r) => r !== label);
  recent.unshift(label);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Load recent searches when opening
  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
      setSearch("");
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      addRecentSearch(item.label);
      setOpen(false);
      if (item.action) {
        item.action();
      } else if (item.href) {
        router.push(item.href);
      }
    },
    [router]
  );

  const allItems = [...NAVIGATION_ITEMS, ...ACTION_ITEMS];

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
            className="fixed inset-0 bg-background/60 backdrop-blur-md z-[100]"
            onClick={() => setOpen(false)}
          />

          {/* Command Dialog */}
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-[560px] z-[101] px-4"
          >
            <Command
              className="rounded-[1.5rem] border border-border/50 bg-card/90 backdrop-blur-3xl shadow-2xl shadow-black/10 overflow-hidden"
              filter={(value, search) => {
                const item = allItems.find((i) => i.id === value);
                if (!item) return 0;
                const haystack = [item.label, item.description || "", ...(item.keywords || [])].join(" ").toLowerCase();
                const needle = search.toLowerCase();
                return haystack.includes(needle) ? 1 : 0;
              }}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50">
                <SearchNormal1
                  className="w-5 h-5 text-muted-foreground flex-shrink-0"
                  variant="Outline"
                />
                <Command.Input
                  ref={inputRef}
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Sayfa ara veya komut çalıştır..."
                  className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground/60 outline-none font-medium"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/50 border border-border/50 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  ESC
                </button>
              </div>

              {/* Results */}
              <Command.List className="max-h-[360px] overflow-y-auto p-2 scrollbar-hide">
                <Command.Empty className="py-12 text-center text-muted-foreground">
                  <SearchNormal1
                    className="w-8 h-8 mx-auto mb-3 opacity-30"
                    variant="Outline"
                  />
                  <p className="font-heading font-bold text-foreground text-sm">
                    Sonuç bulunamadı
                  </p>
                  <p className="text-xs mt-1">
                    Farklı bir arama terimi deneyin.
                  </p>
                </Command.Empty>

                {/* Recent Searches */}
                {!search && recentSearches.length > 0 && (
                  <Command.Group
                    heading={
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-3 py-2">
                        <Clock className="w-3 h-3" variant="Outline" />
                        Son Aramalar
                      </span>
                    }
                  >
                    {recentSearches.map((term) => {
                      const matchedItem = allItems.find((i) => i.label === term);
                      if (!matchedItem) return null;
                      return (
                        <Command.Item
                          key={`recent-${matchedItem.id}`}
                          value={matchedItem.id}
                          onSelect={() => handleSelect(matchedItem)}
                          className="flex items-center gap-3 px-3 py-3 rounded-[12px] cursor-pointer transition-colors data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary text-muted-foreground hover:text-foreground group"
                        >
                          <matchedItem.icon
                            className="w-4 h-4 flex-shrink-0 group-data-[selected=true]:text-primary"
                            variant="Outline"
                          />
                          <span className="font-heading font-bold text-sm text-foreground flex-1">
                            {matchedItem.label}
                          </span>
                          <ArrowRight2
                            className="w-3.5 h-3.5 opacity-0 group-data-[selected=true]:opacity-100 transition-opacity"
                            variant="Outline"
                          />
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                )}

                {/* Pages */}
                <Command.Group
                  heading={
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-3 py-2">
                      Sayfalar
                    </span>
                  }
                >
                  {NAVIGATION_ITEMS.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={item.id}
                      onSelect={() => handleSelect(item)}
                      className="flex items-center gap-3 px-3 py-3 rounded-[12px] cursor-pointer transition-colors data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary text-muted-foreground hover:text-foreground group"
                    >
                      <div className="w-8 h-8 rounded-[10px] bg-muted/50 border border-border/50 flex items-center justify-center flex-shrink-0 group-data-[selected=true]:bg-primary/10 group-data-[selected=true]:border-primary/20 transition-colors">
                        <item.icon
                          className="w-4 h-4 group-data-[selected=true]:text-primary transition-colors"
                          variant="Outline"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-sm text-foreground truncate">
                          {item.label}
                        </p>
                        {item.description && (
                          <p className="text-[11px] text-muted-foreground truncate">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <ArrowRight2
                        className="w-3.5 h-3.5 opacity-0 group-data-[selected=true]:opacity-100 transition-opacity flex-shrink-0"
                        variant="Outline"
                      />
                    </Command.Item>
                  ))}
                </Command.Group>

                {/* Quick Actions */}
                <Command.Group
                  heading={
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-3 py-2">
                      Hızlı Aksiyonlar
                    </span>
                  }
                >
                  {ACTION_ITEMS.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={item.id}
                      onSelect={() => handleSelect(item)}
                      className="flex items-center gap-3 px-3 py-3 rounded-[12px] cursor-pointer transition-colors data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary text-muted-foreground hover:text-foreground group"
                    >
                      <div className="w-8 h-8 rounded-[10px] bg-primary/5 border border-primary/10 flex items-center justify-center flex-shrink-0 group-data-[selected=true]:bg-primary/10 group-data-[selected=true]:border-primary/20 transition-colors">
                        <item.icon
                          className="w-4 h-4 text-primary"
                          variant="Bold"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-sm text-foreground truncate">
                          {item.label}
                        </p>
                        {item.description && (
                          <p className="text-[11px] text-muted-foreground truncate">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <ArrowRight2
                        className="w-3.5 h-3.5 opacity-0 group-data-[selected=true]:opacity-100 transition-opacity flex-shrink-0"
                        variant="Outline"
                      />
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-border/50 bg-muted/10">
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[9px] font-mono">↑↓</kbd>
                    gezin
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[9px] font-mono">↵</kbd>
                    seç
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[9px] font-mono">esc</kbd>
                    kapat
                  </span>
                </div>
                <span className="text-[9px] font-bold text-primary/60 uppercase tracking-widest">
                  Berkan Matematik
                </span>
              </div>
            </Command>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
