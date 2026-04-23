"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { BarChart3, CheckCircle2, Loader2 } from "lucide-react";

interface PollOption {
  label: string;
  text: string;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  is_active: boolean;
}

interface Vote {
  selected_option: string;
}

export default function LivePollWidget({ userId }: { userId: string }) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [myVote, setMyVote] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchActivePoll = useCallback(async () => {
    const { data } = await supabase
      .from("live_polls")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    setPoll(data);

    if (data) {
      // Oyları getir
      const { data: allVotes } = await supabase
        .from("live_poll_votes")
        .select("selected_option")
        .eq("poll_id", data.id);
      setVotes(allVotes ?? []);

      // Kendi oyumu kontrol et
      const { data: myV } = await supabase
        .from("live_poll_votes")
        .select("selected_option")
        .eq("poll_id", data.id)
        .eq("user_id", userId)
        .single();
      setMyVote(myV?.selected_option ?? null);
    }

    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    fetchActivePoll();

    // Realtime: Yeni anket geldiğinde
    const pollChannel = supabase
      .channel("live_polls_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "live_polls" }, () => {
        fetchActivePoll();
      })
      .subscribe();

    // Realtime: Oylar güncellendiğinde
    const voteChannel = supabase
      .channel("live_votes_realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "live_poll_votes" }, () => {
        if (poll?.id) {
          supabase
            .from("live_poll_votes")
            .select("selected_option")
            .eq("poll_id", poll.id)
            .then(({ data }) => setVotes(data ?? []));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(pollChannel);
      supabase.removeChannel(voteChannel);
    };
  }, [fetchActivePoll, supabase, poll?.id]);

  const handleVote = async (option: string) => {
    if (voting || myVote) return;
    setVoting(true);

    try {
      const res = await fetch("/api/live/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId: poll?.id, selectedOption: option }),
      });

      if (res.ok) {
        setMyVote(option);
        setVotes((prev) => [...prev, { selected_option: option }]);
      }
    } catch (err) {
      console.error("Vote error:", err);
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-6 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/2 mb-4" />
        <div className="space-y-2">
          <div className="h-10 bg-muted rounded-xl" />
          <div className="h-10 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-6 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
          <BarChart3 className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="font-heading font-bold text-foreground text-sm">Aktif Anket Yok</p>
        <p className="text-xs text-muted-foreground mt-1">Öğretmen yeni anket açtığında burada görünecek.</p>
      </div>
    );
  }

  const totalVotes = votes.length;
  const hasVoted = !!myVote;

  return (
    <div className="rounded-[1.5rem] border border-primary/20 bg-primary-container/10 backdrop-blur-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-primary/10 flex items-center gap-2 bg-primary/5">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <h3 className="font-heading font-black text-foreground text-sm">Canlı Anket</h3>
        <span className="ml-auto text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          {totalVotes} oy
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Soru */}
        <p className="font-heading font-extrabold text-foreground text-base leading-snug">
          {poll.question}
        </p>

        {/* Şıklar */}
        <div className="space-y-2">
          {poll.options.map((opt: PollOption) => {
            const count = votes.filter((v) => v.selected_option === opt.label).length;
            const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            const isMyChoice = myVote === opt.label;

            return (
              <button
                key={opt.label}
                onClick={() => handleVote(opt.label)}
                disabled={hasVoted || voting}
                className={`w-full text-left relative overflow-hidden rounded-xl border-2 p-3 transition-all ${
                  isMyChoice
                    ? "border-primary bg-primary/5"
                    : hasVoted
                    ? "border-border/50 bg-card/60"
                    : "border-border/50 bg-card/60 hover:border-primary/30 hover:bg-primary/5 cursor-pointer"
                }`}
              >
                {/* Progress bar background */}
                {hasVoted && (
                  <div
                    className="absolute inset-0 bg-primary/10 transition-all duration-700 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                )}

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                      isMyChoice ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}>
                      {opt.label}
                    </span>
                    <span className="font-bold text-sm text-foreground">{opt.text}</span>
                  </div>
                  {hasVoted && (
                    <div className="flex items-center gap-1.5">
                      {isMyChoice && <CheckCircle2 className="w-4 h-4 text-primary" />}
                      <span className="text-sm font-black text-foreground">{pct}%</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {voting && (
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" /> Oyunuz kaydediliyor...
          </div>
        )}
      </div>
    </div>
  );
}
