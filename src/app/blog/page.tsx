import { createClient } from "@/utils/supabase/server";
import { Book, Calendar, Eye, ArrowRight } from "iconsax-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Blog | Berkan Matematik",
  description: "Matematik, sınav taktikleri ve eğitim üzerine güncel yazılar.",
};

export default async function BlogPage() {
  const supabase = await createClient();

  // Sadece yayınlanmış makaleleri çek
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select(`
      id, title, slug, excerpt, cover_image, published_at, views_count,
      profiles:author_id ( full_name )
    `)
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching published blog posts:", error);
  }

  // En son yazıyı "Öne Çıkan" olarak belirle
  const featuredPost = posts && posts.length > 0 ? posts[0] : null;
  const regularPosts = posts && posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Blog Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Book className="w-8 h-8 text-primary" variant="Bulk" />
        </div>
        <h1 className="font-heading font-black text-4xl md:text-5xl text-foreground">
          Berkan Matematik <span className="text-primary">Blog</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Sınav taktikleri, çalışma programları ve matematiğe dair ufuk açıcı yazılar.
        </p>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <Link 
          href={`/blog/${featuredPost.slug}`}
          className="group block relative rounded-3xl overflow-hidden border border-border/50 bg-card hover:border-primary/50 transition-colors shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
            <div className="relative aspect-video md:aspect-auto md:h-full w-full overflow-hidden">
              {featuredPost.cover_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={featuredPost.cover_image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-muted/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                  <Book className="w-16 h-16 text-muted-foreground/30" variant="Bulk" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent md:hidden" />
            </div>
            
            <div className="p-8 md:p-12 flex flex-col justify-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold w-max">
                ÖNE ÇIKAN
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-black text-foreground group-hover:text-primary transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-muted-foreground line-clamp-3 md:line-clamp-4 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              
              <div className="pt-6 mt-auto flex items-center justify-between border-t border-border/40">
                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredPost.published_at).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {featuredPost.views_count} Okunma
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Grid Posts */}
      {regularPosts.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-heading font-black text-2xl border-b border-border/50 pb-4">Tüm Yazılar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Link 
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-card border border-border/50 rounded-3xl overflow-hidden hover:border-primary/30 transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  {post.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={post.cover_image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                      <Book className="w-10 h-10 text-muted-foreground/30" variant="Bulk" />
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4 text-xs font-bold text-muted-foreground">
                    <span>{new Date(post.published_at).toLocaleDateString("tr-TR", { day: 'numeric', month: 'short' })}</span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <ArrowRight className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {posts?.length === 0 && (
        <div className="py-20 text-center border border-dashed border-border/50 rounded-3xl bg-surface/50">
          <Book className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" variant="Bulk" />
          <p className="text-muted-foreground font-medium text-lg">Henüz hiç blog yazısı yayınlanmamış.</p>
        </div>
      )}

    </div>
  );
}
