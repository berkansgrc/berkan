"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { People } from "iconsax-react";

interface LivePresenceTrackerProps {
  userId: string;
  userName: string;
}

export default function LivePresenceTracker({ userId, userName }: LivePresenceTrackerProps) {
  const [count, setCount] = useState(0);
  const supabase = createClient();

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
