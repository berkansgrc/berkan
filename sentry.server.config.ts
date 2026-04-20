/**
 * Sentry Server-Side Config
 *
 * Sunucu tarafında (API routes, Server Components) oluşan hataları yakalar.
 * DSN ayarlanmamışsa sessizce devre dışı kalır.
 */

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,

    // Performans izleme
    tracesSampleRate: 0.1,

    // Production dışında debug modunu aç
    debug: process.env.NODE_ENV === "development",

    // Geliştirme ortamında hata gönderme
    enabled: process.env.NODE_ENV === "production",
  });
}
