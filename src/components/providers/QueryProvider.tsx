"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // SSR ile uyumluluk ve performans için varsayılan ayarlar
            staleTime: 60 * 1000, // 1 dakika
            gcTime: 5 * 60 * 1000, // 5 dakika
            refetchOnWindowFocus: false, // Odak değiştiğinde otomatik yenileme kapalı
            retry: 1, // Hata durumunda 1 kez tekrarla
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
