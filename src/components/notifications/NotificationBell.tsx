"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Notification, TickCircle } from "iconsax-react";
import { Trash2 } from "lucide-react";

interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const fetchNotifications = useCallback(async () => {
    const res = await fetch("/api/notifications");
    if (res.ok) {
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Realtime — yeni bildirim geldiğinde
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "in_app_notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => fetchNotifications()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, fetchNotifications, supabase]);

  // Dışarı tıklayınca kapat
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const markRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const clearRead = async () => {
    setClearing(true);
    await fetch("/api/notifications", { method: "DELETE" });
    setNotifications((prev) => prev.filter((n) => !n.is_read));
    setClearing(false);
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Az önce";
    if (mins < 60) return `${mins}dk önce`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}sa önce`;
    return `${Math.floor(hrs / 24)}g önce`;
  };

  return (
    <div ref={panelRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => {
          setOpen(!open);
          if (!open && unreadCount > 0) markAllRead();
        }}
        className="relative p-2 rounded-xl hover:bg-muted/50 transition-colors"
        aria-label="Bildirimler"
      >
        <Notification
          className="w-5 h-5 text-muted-foreground"
          variant={unreadCount > 0 ? "Bold" : "Outline"}
        />
        <AnimatePresence>
          {unreadCount > 0 && (
            <m.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[9px] font-black text-white flex items-center justify-center"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </m.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-80 max-h-[420px] rounded-[1.25rem] bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Notification className="w-4 h-4 text-primary" variant="Bulk" />
                <h3 className="font-heading font-black text-sm text-foreground">
                  Bildirimler
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {notifications.some((n) => n.is_read) && (
                  <button
                    onClick={clearRead}
                    disabled={clearing}
                    className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
                    title="Okunmuşları temizle"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                )}
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
                    title="Tümünü okundu işaretle"
                  >
                    <TickCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-[340px] scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <Notification
                    className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30"
                    variant="Bulk"
                  />
                  <p className="text-xs font-bold text-muted-foreground">
                    Bildirim yok
                  </p>
                </div>
              ) : (
                notifications.map((n) => {
                  const content = (
                    <div
                      className={`flex items-start gap-3 px-4 py-3 border-b border-border/20 last:border-0 transition-colors cursor-pointer ${
                        n.is_read
                          ? "hover:bg-muted/10"
                          : "bg-primary/5 hover:bg-primary/10"
                      }`}
                      onClick={() => !n.is_read && markRead(n.id)}
                    >
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        n.type === "lesson_reminder" || n.type === "lesson_started"
                          ? "bg-primary/10"
                          : "bg-muted/40"
                      }`}>
                        <Notification
                          className={`w-4 h-4 ${n.type === "lesson_reminder" ? "text-primary" : "text-muted-foreground"}`}
                          variant="Bulk"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold leading-tight ${n.is_read ? "text-muted-foreground" : "text-foreground"}`}>
                          {n.title}
                        </p>
                        {n.body && (
                          <p className="text-[10px] text-muted-foreground font-medium mt-0.5 line-clamp-2">
                            {n.body}
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground/50 font-medium mt-1">
                          {timeAgo(n.created_at)}
                        </p>
                      </div>

                      {!n.is_read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                    </div>
                  );

                  return n.action_url ? (
                    <Link key={n.id} href={n.action_url} onClick={() => setOpen(false)}>
                      {content}
                    </Link>
                  ) : (
                    <div key={n.id}>{content}</div>
                  );
                })
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
