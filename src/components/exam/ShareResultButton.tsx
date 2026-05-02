"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShareResultButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Link kopyalanamadı:", err);
    }
  };

  return (
    <Button
      onClick={handleShare}
      className={`w-full sm:w-auto gap-2 rounded-xl h-12 font-heading font-bold border-0 transition-all duration-300 ${
        copied 
          ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
          : "bg-gradient-to-br from-primary to-[#005a55]"
      }`}
    >
      {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
      {copied ? "Bağlantı Kopyalandı!" : "Sonucu Paylaş"}
    </Button>
  );
}
