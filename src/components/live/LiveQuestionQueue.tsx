"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { MessageCircle, ThumbsUp, CheckCircle2, Send, Loader2 } from "lucide-react";

interface Question {
  id: string;
  user_id: string;
  user_name: string;
  question: string;
  upvotes: number;
  is_answered: boolean;
  created_at: string;
}

export default function LiveQuestionQueue({
  userId,
  isTeacher = false,
}: {
  userId: string;
  isTeacher?: boolean;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [myUpvotes, setMyUpvotes] = useState<Set<string>>(new Set());
  const [newQuestion, setNewQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchQuestions = useCallback(async () => {
    const { data } = await supabase
      .from("live_questions")
      .select("*")
      .order("is_answered", { ascending: true })
      .order("upvotes", { ascending: false })
      .order("created_at", { ascending: false });

    setQuestions(data ?? []);

    // Kendi upvote'larımı al
    const { data: myVotes } = await supabase
      .from("live_question_upvotes")
      .select("question_id")
      .eq("user_id", userId);

    setMyUpvotes(new Set((myVotes ?? []).map((v) => v.question_id)));
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    fetchQuestions();

    const channel = supabase
      .channel("live_questions_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "live_questions" }, () => {
        fetchQuestions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchQuestions, supabase]);

  const handleSubmit = async () => {
    if (!newQuestion.trim() || sending) return;
    setSending(true);

    try {
      const res = await fetch("/api/live/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newQuestion }),
      });

      if (res.ok) {
        setNewQuestion("");
        await fetchQuestions();
      }
    } catch (err) {
      console.error("Question submit error:", err);
    } finally {
      setSending(false);
    }
  };

  const handleUpvote = async (questionId: string) => {
    try {
      const res = await fetch("/api/live/questions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, action: "upvote" }),
      });

      if (res.ok) {
        const data = await res.json();
        setMyUpvotes((prev) => {
          const next = new Set(prev);
          if (data.action === "added") next.add(questionId);
          else next.delete(questionId);
          return next;
        });
        await fetchQuestions();
      }
    } catch (err) {
      console.error("Upvote error:", err);
    }
  };

  const handleMarkAnswered = async (questionId: string) => {
    try {
      await fetch("/api/live/questions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, action: "answer" }),
      });
      await fetchQuestions();
    } catch (err) {
      console.error("Answer mark error:", err);
    }
  };

  const unanswered = questions.filter((q) => !q.is_answered);
  const answered = questions.filter((q) => q.is_answered);

  return (
    <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-primary" />
        <h3 className="font-heading font-black text-foreground text-sm">Soru Kuyruğu</h3>
        <span className="ml-auto text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {unanswered.length} bekliyor
        </span>
      </div>

      {/* Soru Gönderme */}
      <div className="p-4 border-b border-border/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Sorunuzu yazın..."
            maxLength={300}
            className="flex-1 h-10 bg-input/50 border border-border/60 rounded-xl px-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
          <button
            onClick={handleSubmit}
            disabled={!newQuestion.trim() || sending}
            className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Soru Listesi */}
      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center">
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : unanswered.length === 0 && answered.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-medium">Henüz soru sorulmamış.</p>
            <p className="text-xs text-muted-foreground mt-1">İlk soruyu siz sorun!</p>
          </div>
        ) : (
          <div className="divide-y divide-border/20">
            {unanswered.map((q) => (
              <div key={q.id} className="px-4 py-3 flex gap-3 hover:bg-muted/10 transition-colors">
                {/* Upvote */}
                <button
                  onClick={() => handleUpvote(q.id)}
                  className={`flex flex-col items-center gap-0.5 shrink-0 pt-0.5 ${
                    myUpvotes.has(q.id) ? "text-primary" : "text-muted-foreground hover:text-primary"
                  } transition-colors`}
                >
                  <ThumbsUp className={`w-4 h-4 ${myUpvotes.has(q.id) ? "fill-primary" : ""}`} />
                  <span className="text-[11px] font-black">{q.upvotes}</span>
                </button>

                {/* İçerik */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-snug">{q.question}</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1">
                    {q.user_name} · {new Date(q.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                {/* Öğretmen: Cevapla */}
                {isTeacher && (
                  <button
                    onClick={() => handleMarkAnswered(q.id)}
                    className="text-xs font-bold text-primary hover:text-primary/80 shrink-0 self-center"
                    title="Cevaplandı olarak işaretle"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}

            {/* Cevaplanan Sorular */}
            {answered.length > 0 && (
              <>
                <div className="px-4 py-2 bg-muted/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Cevaplanmış ({answered.length})
                  </p>
                </div>
                {answered.map((q) => (
                  <div key={q.id} className="px-4 py-3 flex gap-3 opacity-60">
                    <div className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5 text-primary">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[11px] font-black">{q.upvotes}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-snug line-through decoration-primary/30">
                        {q.question}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium mt-1">{q.user_name}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
