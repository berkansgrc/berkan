"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/blog/RichTextEditor";
import { ArrowLeft, Send, GalleryAdd, Trash } from "iconsax-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import React from "react";

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const postId = unwrappedParams.id;
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) throw new Error("ImgBB API anahtarı bulunamadı.");

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setCoverImage(data.data.url);
      } else {
        throw new Error(data.error?.message || "Resim yüklenemedi.");
      }
    } catch (error: any) {
      console.error("Resim yükleme hatası:", error);
      alert("Kapak fotoğrafı yüklenirken bir hata oluştu: " + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    async function loadPost() {
      const { data: post, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error || !post) {
        alert("Makale bulunamadı.");
        router.push("/admin/blog");
        return;
      }

      setTitle(post.title);
      setSlug(post.slug);
      setExcerpt(post.excerpt || "");
      setCoverImage(post.cover_image || "");
      setContent(post.content);
      setIsPublished(post.is_published);
      setLoading(false);
    }
    loadPost();
  }, [postId, router, supabase]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    const newSlug = newTitle
      .toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    
    setSlug(newSlug);
  };

  const handleSave = async (publish: boolean) => {
    if (!title || !slug || !content) {
      alert("Lütfen başlık, url adresi ve içerik alanlarını doldurun.");
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.from("blog_posts").update({
        title,
        slug,
        excerpt,
        content,
        cover_image: coverImage,
        is_published: publish,
        published_at: publish && !isPublished ? new Date().toISOString() : undefined,
        updated_at: new Date().toISOString()
      }).eq("id", postId);

      if (error) throw error;

      alert(publish ? "Makale başarıyla güncellendi ve yayınlandı!" : "Makale taslak olarak güncellendi.");
      router.push("/admin/blog");
      
    } catch (error: any) {
      console.error(error);
      alert("Kayıt sırasında bir hata oluştu: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground">Makale yükleniyor...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-black text-foreground">Makaleyi Düzenle</h1>
            <p className="text-muted-foreground text-sm">Blog yazınızı güncelliyorsunuz.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => handleSave(false)}
            disabled={saving}
            className="rounded-xl h-11 px-6 font-bold"
          >
            Taslak Olarak Kaydet
          </Button>
          <Button 
            onClick={() => handleSave(true)}
            disabled={saving}
            className="rounded-xl h-11 px-6 font-bold bg-primary hover:bg-primary/90 text-white gap-2"
          >
            Yayında Tut <Send className="w-4 h-4" variant="Bulk" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground ml-1">Makale Başlığı</label>
            <Input 
              value={title}
              onChange={handleTitleChange}
              placeholder="Örn: 2025 YKS Matematik Taktikleri"
              className="h-14 text-xl font-bold rounded-2xl bg-surface border-border/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground ml-1">İçerik (Zengin Metin)</label>
            <RichTextEditor 
              content={content} 
              onChange={setContent} 
              placeholder="Harika fikirlerinizi buraya yazmaya başlayın..."
            />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-surface border border-border/50 space-y-6">
            <h3 className="font-heading font-black text-lg border-b border-border/50 pb-4">Yayın Ayarları</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">URL Adresi (Slug)</label>
              <Input 
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="yks-matematik-taktikleri"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1 ml-1">Örn: site.com/blog/<strong>{slug || "url-adresi"}</strong></p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">Kısa Özet</label>
              <textarea 
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Blog listesinde görünecek kısa açıklama..."
                className="w-full h-24 p-3 rounded-xl bg-background border border-border/50 focus:outline-none focus:border-primary/50 resize-none text-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground ml-1">Kapak Fotoğrafı</label>
              {coverImage ? (
                <div className="relative group rounded-xl overflow-hidden border border-border/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverImage} alt="Kapak" className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => setCoverImage("")}
                      className="p-3 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                      type="button"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <Input 
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  {uploadingImage && (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
