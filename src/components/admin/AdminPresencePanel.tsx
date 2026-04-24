"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { m, AnimatePresence } from "framer-motion";
import { People, Profile, Clock, Refresh } from "iconsax-react";

interface PresenceUser {
  user_id: string;
  name: string;
  joined_at: string;
}

export default function AdminPresencePanel() {
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase.channel("live-lesson-presence");

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const presenceUsers: PresenceUser[] = [];

        Object.values(state).forEach((presences) => {
          (presences as unknown as PresenceUser[]).forEach((p) => {
            presenceUsers.push({
              user_id: p.user_id,
              name: p.name,
              joined_at: p.joined_at,
            });
          });
        });

        // Sort by joined_at desc
        presenceUsers.sort(
          (a, b) => new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime()
        );
        setUsers(presenceUsers);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <People className="w-4 h-4 text-primary" variant="Bulk" />
          <h3 className="font-heading font-black text-sm text-foreground">
            Katılımcılar
          </h3>
          <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            {users.length} çevrimiçi
          </span>
        </div>
        <div className="relative flex items-center justify-center w-2 h-2">
          <span className="absolute w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
      </div>

      {/* User List */}
      <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
        {users.length === 0 ? (
          <div className="p-8 text-center">
            <People className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" variant="Bulk" />
            <p className="text-xs font-bold text-muted-foreground">
              Henüz katılımcı yok
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
              Öğrenciler derse katıldığında burada görünecek.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/20">
            <AnimatePresence>
              {users.map((user, idx) => {
                const joinedTime = new Date(user.joined_at).toLocaleTimeString(
                  "tr-TR",
                  { hour: "2-digit", minute: "2-digit" }
                );

                return (
                  <m.div
                    key={user.user_id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{
                      delay: idx * 0.03,
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-muted/10 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Profile className="w-4 h-4 text-primary" variant="Bold" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {user.name || "Öğrenci"}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
                        <Clock className="w-2.5 h-2.5" variant="Outline" />
                        {joinedTime}
                      </div>
                    </div>

                    {/* Status dot */}
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  </m.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
