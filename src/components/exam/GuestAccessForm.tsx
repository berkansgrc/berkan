"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GuestAccessForm({ examId, expectedCode }: { examId: string, expectedCode: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Lütfen sınav giriş kodunu girin.");
      return;
    }

    if (code.trim().toUpperCase() !== expectedCode.toUpperCase()) {
      setError("Girdiğiniz kod hatalı. Lütfen kontrol edip tekrar deneyin.");
      return;
    }

    // Kod doğruysa take sayfasına yönlendir, doğrulama için query param ekle
    router.push(`/exams/${examId}/take?access_code=${code.trim().toUpperCase()}`);
  };

  return (
    <div className="w-full pt-4">
      <form onSubmit={handleSubmit} className="p-6 bg-input/30 rounded-2xl border border-border/50 flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
             <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
             <h3 className="font-heading font-bold text-foreground">Öğretmen Anahtarı</h3>
             <p className="text-xs font-medium text-muted-foreground">Bu sınava girmek için öğretmeninizden aldığınız giriş koduna ihtiyacınız var.</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs font-bold text-destructive bg-destructive/10 p-3 rounded-xl border border-destructive/20">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Input 
            value={code} 
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Örn: A1B2C3D4" 
            className="h-12 bg-background/50 text-center font-mono font-bold tracking-widest text-lg uppercase"
            maxLength={10}
          />
        </div>

        <Button type="submit" className="w-full h-12 rounded-xl font-heading font-extrabold text-base bg-gradient-to-br from-primary to-[#005a55] border-0 shadow-[0_8px_16px_rgba(0,103,98,0.2)] hover:shadow-[0_12px_24px_rgba(0,103,98,0.3)] hover:-translate-y-0.5 transition-all">
          Kodu Doğrula ve Başla <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>
    </div>
  );
}
