"use client";

import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  Notification as NotificationIcon,
  Profile2User,
  Book,
  Radio,
  CloseCircle,
  Clock,
} from "iconsax-react";

interface NotificationItem {
  id: string;
  type: "new_user" | "exam_entry" | "live_status";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const ICON_MAP = {
  new_user: Profile2User,
  exam_entry: Book,
  live_status: Radio,
};

const COLOR_MAP = {
  new_user: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-500",
  },
  exam_entry: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-500",
  },
  live_status: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-500",
  },
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return "Az önce";
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
  return `${Math.floor(diff / 86400)} gün önce`;
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Fetch on first open
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch on mount for badge count
    fetchNotifications();
  }, []);

  const handleToggle = () => {
    setOpen((prev) => {
      if (!prev) fetchNotifications();
      return !prev;
    });
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all active:scale-95"
        aria-label="Bildirimler"
      >
        <NotificationIcon className="w-5 h-5" variant="Outline" />
        {unreadCount > 0 && (
          <m.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-card shadow-sm"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </m.span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-80 rounded-[1.25rem] border border-border/50 bg-card/95 backdrop-blur-3xl shadow-2xl shadow-black/10 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50">
              <h3 className="font-heading font-black text-sm text-foreground">
                Bildirimler
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors"
                  >
                    Tümünü Oku
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors lg:hidden"
                >
                  <CloseCircle className="w-4 h-4" variant="Outline" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[340px] overflow-y-auto scrollbar-hide">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <NotificationIcon
                    className="w-8 h-8 mb-3 opacity-20"
                    variant="Outline"
                  />
                  <p className="text-xs font-bold">
                    Henüz bildirim yok
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/30 p-1.5">
                  {notifications.map((notif, idx) => {
                    const IconComp = ICON_MAP[notif.type];
                    const colors = COLOR_MAP[notif.type];
                    return (
                      <m.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className={`flex items-start gap-3 px-3.5 py-3 rounded-xl transition-colors cursor-default ${
                          notif.read
                            ? "opacity-60"
                            : "hover:bg-muted/30"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-[10px] ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0 mt-0.5`}
                        >
                          <IconComp
                            className={`w-4 h-4 ${colors.text}`}
                            variant="Bulk"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-bold text-[13px] text-foreground truncate">
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                            {notif.description}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock
                              className="w-2.5 h-2.5 text-muted-foreground/50"
                              variant="Outline"
                            />
                            <span className="text-[9px] font-medium text-muted-foreground/60">
                              {timeAgo(notif.timestamp)}
                            </span>
                          </div>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 shadow-[0_0_6px_rgba(var(--primary),0.5)]" />
                        )}
                      </m.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border/50 bg-muted/5">
              <p className="text-[9px] font-bold text-muted-foreground/50 text-center uppercase tracking-widest">
                Son 48 saatteki olaylar
              </p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
