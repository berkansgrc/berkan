import { createClient } from "@/utils/supabase/server";
import { Edit2, Add, Eye, Trash, Refresh2 } from "iconsax-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { DeletePostForm } from "@/components/admin/DeletePostForm";

export const metadata = {
  title: "Blog Yönetimi | Admin",
};

export default async function AdminBlogPage() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, is_published, created_at, views_count")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface p-6 rounded-3xl border border-border/50">
        <div>
          <h1 className="text-2xl font-heading font-black text-foreground">Blog Yönetimi</h1>
          <p className="text-muted-foreground text-sm mt-1">Sistemdeki tüm blog yazılarını yönetin.</p>
        </div>
        
        <Link 
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
        >
          <Add className="w-5 h-5" />
          Yeni Yazı Ekle
        </Link>
      </div>

      <div className="bg-surface border border-border/50 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 text-muted-foreground font-bold">
              <tr>
                <th className="px-6 py-4">Başlık</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4">Tarih</th>
                <th className="px-6 py-4 text-center">Okunma</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {posts && posts.length > 0 ? posts.map((post) => (
                <tr key={post.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-foreground text-base">{post.title}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">/{post.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    {post.is_published ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-xs border border-emerald-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Yayında
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 font-bold text-xs border border-amber-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Taslak
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-medium">
                    {new Date(post.created_at).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 text-muted-foreground font-bold bg-muted/50 px-3 py-1 rounded-lg">
                      <Eye className="w-4 h-4" />
                      {post.views_count}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      
                      {post.is_published && (
                        <a 
                          href={`/blog/${post.slug}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 bg-muted/50 text-foreground hover:bg-primary/20 hover:text-primary rounded-xl transition-colors"
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}

                      <Link 
                        href={`/admin/blog/edit/${post.id}`}
                        className="p-2 bg-muted/50 text-foreground hover:bg-primary/20 hover:text-primary rounded-xl transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      <DeletePostForm id={post.id} />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-medium">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center border border-border/50">
                        <Edit2 className="w-6 h-6 opacity-50" />
                      </div>
                      <p>Henüz hiç yazı eklenmemiş.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
