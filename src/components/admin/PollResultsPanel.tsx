"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Chart, TickCircle, Clock, Refresh } from "iconsax-react";

interface PollResult {
  id: string;
  body: string;
  createdAt: string;
  options: string[];
  totalVotes: number;
  distribution: Record<string, number>;
}

const COLORS = [
  { bar: "bg-primary", text: "text-primary" },
  { bar: "bg-blue-500", text: "text-blue-500" },
  { bar: "bg-amber-500", text: "text-amber-500" },
  { bar: "bg-violet-500", text: "text-violet-500" },
  { bar: "bg-pink-500", text: "text-pink-500" },
];

export default function PollResultsPanel() {
  const [polls, setPolls] = useState<PollResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPolls = () => {
    setLoading(true);
    fetch("/api/admin/live-polls/results")
      .then((res) => res.json())
      .then((data) => setPolls(data.polls || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  return (
    <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Chart className="w-5 h-5 text-primary" variant="Bulk" />
          <h3 className="font-heading font-black text-sm text-foreground">
            Anket Sonuçları
          </h3>
          <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
            Son 7 gün
          </span>
        </div>
        <button
          onClick={fetchPolls}
          className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all active:scale-95"
          title="Yenile"
        >
          <Refresh
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            variant="Outline"
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5 max-h-[600px] overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : polls.length === 0 ? (
          <div className="text-center py-12">
            <Chart
              className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30"
              variant="Bulk"
            />
            <p className="font-heading font-bold text-foreground text-sm">
              Son 7 günde anket yok
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Canlı ders sırasında anket oluşturduğunuzda burada görünecek.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {polls.map((poll, idx) => {
              const winnerOpt =
                poll.options.length > 0
                  ? poll.options.reduce((a, b) =>
                      (poll.distribution[a] || 0) >=
                      (poll.distribution[b] || 0)
                        ? a
                        : b
                    )
                  : null;

              const timeStr = new Date(poll.createdAt).toLocaleString("tr-TR", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <m.div
                  key={poll.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: idx * 0.05,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="rounded-xl bg-muted/15 border border-border/40 p-4"
                >
                  {/* Question */}
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-heading font-bold text-sm text-foreground flex-1">
                      {poll.body}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground shrink-0 ml-3">
                      <Clock className="w-3 h-3" variant="Outline" />
                      {timeStr}
                    </div>
                  </div>

                  {/* Vote bars */}
                  <div className="space-y-2">
                    {poll.options.map((opt, optIdx) => {
                      const count = poll.distribution[opt] || 0;
                      const pct =
                        poll.totalVotes > 0
                          ? Math.round((count / poll.totalVotes) * 100)
                          : 0;
                      const isWinner = opt === winnerOpt && count > 0;
                      const color = COLORS[optIdx % COLORS.length];

                      return (
                        <div key={opt} className="flex items-center gap-3">
                          <span
                            className={`text-xs font-bold min-w-[80px] truncate ${
                              isWinner
                                ? color.text
                                : "text-muted-foreground"
                            }`}
                          >
                            {opt}
                          </span>
                          <div className="flex-1 h-4 bg-muted/30 rounded-full overflow-hidden">
                            <m.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                delay: idx * 0.05 + optIdx * 0.1 + 0.2,
                                duration: 0.8,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className={`h-full rounded-full ${
                                isWinner ? color.bar : "bg-muted-foreground/20"
                              }`}
                            />
                          </div>
                          <div className="flex items-center gap-1 min-w-[60px] justify-end">
                            <span
                              className={`text-xs font-black ${
                                isWinner
                                  ? color.text
                                  : "text-muted-foreground"
                              }`}
                            >
                              %{pct}
                            </span>
                            <span className="text-[10px] text-muted-foreground/50 font-bold">
                              ({count})
                            </span>
                          </div>
                          {isWinner && (
                            <TickCircle
                              className="w-4 h-4 text-emerald-500 shrink-0"
                              variant="Bold"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Total footer */}
                  <p className="text-[10px] font-bold text-muted-foreground/50 text-right mt-2">
                    Toplam: {poll.totalVotes} oy
                  </p>
                </m.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
