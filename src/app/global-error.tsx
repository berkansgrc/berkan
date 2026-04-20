"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="tr">
      <body className="font-sans min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-2xl flex items-center justify-center border border-destructive/20">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Beklenmeyen bir hata oluştu
          </h2>
          <p className="text-muted-foreground text-sm">
            Hata ekibimize bildirildi. Lütfen tekrar deneyin.
          </p>
          <button
            onClick={() => reset()}
            className="bg-primary text-primary-foreground font-heading font-bold px-6 py-3 rounded-xl hover:-translate-y-0.5 transition-all text-sm cursor-pointer"
          >
            Tekrar Dene
          </button>
        </div>
      </body>
    </html>
  );
}
