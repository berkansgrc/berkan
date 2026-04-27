"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { Notification, TickCircle } from "iconsax-react";
import { Loader2 } from "lucide-react";

const REMIND_OPTIONS = [
  { value: 15, label: "15 dk önce" },
  { value: 30, label: "30 dk önce" },
  { value: 60, label: "1 saat önce" },
];

export default function ReminderOptIn() {
  const [enabled, setEnabled] = useState(false);
  const [minutes, setMinutes] = useState(30);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Mevcut tercihi çek
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await window.fetch("/api/live/reminders");
        if (res.ok) {
          const data = await res.json();
          setEnabled(data.reminder_enabled ?? false);
          setMinutes(data.remind_before_minutes ?? 30);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const save = async (newEnabled: boolean, newMinutes: number) => {
    setSaving(true);
    setSaved(false);
    try {
      await window.fetch("/api/live/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reminder_enabled: newEnabled,
          remind_before_minutes: newMinutes,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    const newVal = !enabled;
    setEnabled(newVal);
    await save(newVal, minutes);
  };

  const handleMinutes = async (val: number) => {
    setMinutes(val);
    if (enabled) await save(enabled, val);
  };

  if (loading) {
    return (
      <div className="rounded-[1.25rem] border border-border/40 bg-card/60 p-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Yükleniyor...
      </div>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-[1.25rem] border p-4 space-y-3 transition-colors ${
        enabled
          ? "border-primary/30 bg-primary/5"
          : "border-border/40 bg-card/60"
      }`}
    >
      {/* Toggle row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Notification
            className={`w-4 h-4 ${enabled ? "text-primary" : "text-muted-foreground"}`}
            variant={enabled ? "Bold" : "Outline"}
          />
          <div>
            <p className="text-xs font-black text-foreground">Ders Hatırlatıcısı</p>
            <p className="text-[10px] text-muted-foreground font-medium">
              Ders başlamadan önce bildirim al
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saving && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
          {saved && !saving && <TickCircle className="w-3 h-3 text-emerald-500" variant="Bold" />}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={enabled}
              onChange={handleToggle}
            />
            <div className="w-11 h-6 bg-input border border-border/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-primary peer-checked:border-primary shadow-inner" />
          </label>
        </div>
      </div>

      {/* Minutes selector */}
      {enabled && (
        <m.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex gap-2"
        >
          {REMIND_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleMinutes(opt.value)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${
                minutes === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card/60 text-muted-foreground border-border/50 hover:border-primary/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </m.div>
      )}
    </m.div>
  );
}
