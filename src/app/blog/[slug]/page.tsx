import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Calendar, Eye, ArrowLeft, User } from "iconsax-react";
import Link from "next/link";
import { Metadata, ResolvingMetadata } from "next";
import CommentForm from "@/components/blog/CommentForm";

interface Props {
  params: Promise<{ slug: string }>;
}

// Dinamik SEO Metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt, cover_image")
    .eq("slug", slug)
    .single();

  if (!post) {
    return { title: "Yazı Bulunamadı" };
  }

  return {
    title: `${post.title} | Berkan Matematik Blog`,
    description: post.excerpt,
    openGraph: {
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Makaleyi çek
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      profiles:author_id ( full_name, avatar_url )
    `)
    .eq("slug", slug)
    .single();

  if (error || !post) {
    notFound();
  }

  // Sadece yayınlananları veya yazarın kendisini göster
  if (!post.is_published && user?.id !== post.author_id) {
    notFound();
  }

  // 2. Okunma sayısını artır (RPC veya basit update ile)
  // Not: RLS nedeniyle anonim kullanıcılar doğrudan update yapamaz. 
  // Gerçek senaryoda bu işlem için güvenli bir API Route (edge function veya service_role ile) kullanılmalıdır.
  // Şimdilik sadece frontend tarafında gösterim sağlıyoruz.
  
  // 3. Yorumları Çek
  const { data: comments } = await supabase
    .from("blog_comments")
    .select(`
      id, content, created_at,
      profiles:user_id ( full_name, avatar_url )
    `)
    .eq("post_id", post.id)
    .order("created_at", { ascending: false });

  return (
    <article className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Back Button */}
      <Link 
        href="/blog" 
        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
      >
        <div className="p-2 rounded-xl bg-surface border border-border/50 group-hover:border-primary/30 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Blog'a Dön
      </Link>

      {/* Header */}
      <header className="space-y-6 text-center">
        <h1 className="font-heading font-black text-4xl md:text-5xl text-foreground leading-tight">
          {post.title}
        </h1>
        
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm font-bold text-muted-foreground">
          <div className="flex items-center gap-2">
            {post.profiles?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.profiles.avatar_url} alt="Yazar" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" variant="Bulk" />
              </div>
            )}
            <span className="text-foreground">{post.profiles?.full_name || "Admin"}</span>
          </div>
          
          <div className="w-1.5 h-1.5 rounded-full bg-border/50" />
          
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" variant="Bulk" />
            {new Date(post.published_at || post.created_at).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>

          <div className="w-1.5 h-1.5 rounded-full bg-border/50" />

          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" variant="Bulk" />
            {post.views_count} Okunma
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden border border-border/50 shadow-2xl relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={post.cover_image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div 
        className="prose prose-invert prose-lg prose-headings:font-heading prose-headings:font-black prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-3xl prose-img:border prose-img:border-border/50 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <hr className="border-border/50" />

      {/* Comments Section */}
      <section className="space-y-8">
        <h3 className="font-heading font-black text-2xl text-foreground">Yorumlar ({comments?.length || 0})</h3>
        
        {/* Comment Form */}
        <CommentForm postId={post.id} isLoggedIn={!!user} />

        {/* Comment List */}
        <div className="space-y-6">
          {comments?.map((comment) => {
            const profile = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles;
            return (
              <div key={comment.id} className="flex gap-4">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt="Kullanıcı" className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" variant="Bulk" />
                  </div>
                )}
                <div className="bg-surface border border-border/50 rounded-2xl rounded-tl-none p-5 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-foreground">
                      {profile?.full_name || "Gizli Kullanıcı"}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {new Date(comment.created_at).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })}
          
          {comments?.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              İlk yorumu siz yapın!
            </p>
          )}
        </div>
      </section>
      
    </article>
  );
}
