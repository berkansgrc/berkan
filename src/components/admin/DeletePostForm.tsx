"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "iconsax-react";

export function DeletePostForm({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Yazı silinemedi: ${data.error}`);
      }
    } catch {
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 bg-muted/50 text-foreground hover:bg-destructive/20 hover:text-destructive rounded-xl transition-colors disabled:opacity-50"
      title="Sil"
    >
      <Trash className="w-4 h-4" />
    </button>
  );
}
