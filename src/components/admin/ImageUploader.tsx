"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  currentUrl?: string;
  onClear?: () => void;
}

export default function ImageUploader({ onUploadSuccess, currentUrl, onClear }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Lütfen sadece resim dosyası yükleyin.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Dosya boyutu 5MB'dan küçük olmalıdır.");
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      setError("ImgBB API anahtarı eksik (.env.local dosyasını kontrol edin).");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error?.message || "Resim yüklenirken hata oluştu.");
      }

      const data = await res.json();
      onUploadSuccess(data.data.url);
    } catch (err: any) {
      setError(err.message || "Yükleme sırasında bir hata oluştu.");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (currentUrl) {
    return (
      <div className="relative group overflow-hidden rounded-[1.25rem] border border-primary/20 bg-background/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md max-w-full">
        <div className="aspect-video w-full relative flex items-center justify-center bg-muted/20">
          <img 
            src={currentUrl} 
            alt="Uploaded content" 
            className="max-h-full max-w-full object-contain"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
             <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-full shadow-2xl">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
             </div>
             {onClear && (
               <Button 
                variant="destructive" 
                size="sm" 
                onClick={onClear} 
                className="rounded-full h-10 px-4 bg-red-500/80 hover:bg-red-600 backdrop-blur-md border border-white/10 shadow-lg pointer-events-auto"
               >
                 <X className="h-4 w-4 mr-2" /> Kaldır
               </Button>
             )}
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
            <div className="bg-primary/90 backdrop-blur-md text-primary-foreground text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
               BAĞLI
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative group cursor-pointer overflow-hidden rounded-[1.5rem] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center py-10 px-6",
          isDragging 
            ? "border-primary bg-primary/10 scale-[0.99] shadow-inner" 
            : "border-border/60 bg-muted/20 hover:border-primary/40 hover:bg-muted/30",
          isUploading && "pointer-events-none opacity-60"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {isUploading ? (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
              <Loader2 className="h-12 w-12 text-primary animate-spin relative z-10" />
            </div>
            <p className="mt-4 font-heading font-bold text-foreground">Yükleniyor...</p>
            <p className="text-xs text-muted-foreground mt-1">Görsel buluta aktarılıyor</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 rounded-[1.25rem] bg-background border border-border flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <UploadCloud className="h-8 w-8 text-primary group-hover:text-primary/80" />
            </div>
            <p className="font-heading font-black text-foreground">Görsel Seç veya Sürükle</p>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-[200px]">
              JPG, PNG veya WebP dosyalarını buraya bırakabilirsin.
            </p>
            <div className="mt-6">
                <Button variant="outline" className="rounded-xl font-heading font-bold px-6 h-10 border-primary/20 text-primary bg-background hover:bg-primary/5">
                    Göz At
                </Button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-destructive font-bold text-[11px] animate-in slide-in-from-top-2">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}
    </div>
  );
}
