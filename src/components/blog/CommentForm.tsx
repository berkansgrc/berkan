"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Send2 } from "iconsax-react";

interface CommentFormProps {
  postId: string;
  isLoggedIn: boolean;
}

export default function CommentForm({ postId, isLoggedIn }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !isLoggedIn) return;

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Oturum bulunamadı.");

      const { error } = await supabase.from("blog_comments").insert({
        post_id: postId,
        user_id: user.id,
        content: content.trim(),
        is_approved: true // Şimdilik onaylı olarak ekliyoruz
      });

      if (error) throw error;

      setContent("");
      router.refresh();
      alert("Yorumunuz başarıyla eklendi.");
    } catch (error: any) {
      console.error("Yorum eklenirken hata oluştu:", error);
      alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-border/50 rounded-3xl p-6 shadow-sm">
      {!isLoggedIn ? (
        <div className="text-center py-4">
          <p className="text-muted-foreground text-sm font-medium mb-4">
            Yorum yapabilmek için öğrenci olarak giriş yapmış olmanız gerekmektedir.
          </p>
          <a href="/login" className="inline-block px-6 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors">
            Giriş Yap
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Makale hakkında ne düşünüyorsunuz?"
            className="w-full h-24 p-4 rounded-2xl bg-background border border-border/50 focus:outline-none focus:border-primary/50 resize-none transition-colors"
            disabled={loading}
          />
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={loading || !content.trim()} 
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? "Gönderiliyor..." : "Yorum Gönder"}
              <Send2 className="w-4 h-4" variant="Bulk" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
