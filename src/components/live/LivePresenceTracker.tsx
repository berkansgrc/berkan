"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { People } from "iconsax-react";

interface LivePresenceTrackerProps {
  userId: string;
  userName: string;
  lessonId: string; // Ders tanımlayıcı (lesson_title)
}

export default function LivePresenceTracker({
  userId,
  userName,
  lessonId,
}: LivePresenceTrackerProps) {
  const [count, setCount] = useState(0);
  const attendanceIdRef = useRef<string | null>(null);
  const supabase = createClient();

  // Kalıcı katılım kaydı — mount'ta POST, unmount'ta PATCH
  useEffect(() => {
    let isMounted = true;

    const registerAttendance = async () => {
      try {
        const res = await fetch("/api/live/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId }),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) attendanceIdRef.current = data.attendanceId;
        }
      } catch {
        // Sessizce geç — presence tracker çalışmaya devam eder
      }
    };

    registerAttendance();

    return () => {
      isMounted = false;
      // Ayrılış kaydı — best effort (sayfa kapansa da çalışır)
      if (attendanceIdRef.current) {
        navigator.sendBeacon(
          "/api/live/attendance",
          JSON.stringify({ attendanceId: attendanceIdRef.current, _method: "PATCH" })
        );
        // Fallback: fetch
        fetch("/api/live/attendance", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attendanceId: attendanceIdRef.current }),
          keepalive: true,
        }).catch(() => {});
      }
    };
  }, [lessonId]);

  // Realtime presence — anlık izleyici sayısı
  useEffect(() => {
    const channel = supabase.channel("live-lesson-presence", {
      config: { presence: { key: userId } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user_id: userId,
            name: userName,
            joined_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, userName, supabase]);

  if (count <= 0) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
      <div className="relative flex items-center justify-center">
        <People className="w-3.5 h-3.5" variant="Bold" />
        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>
      <span>{count} izleyici</span>
    </div>
  );
}
