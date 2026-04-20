/**
 * Sentry Client-Side Config
 *
 * Kullanıcının tarayıcısında oluşan hataları yakalar.
 * DSN ayarlanmamışsa sessizce devre dışı kalır.
 */

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,

    // Performans izleme: %10 oranında sample al (ücretsiz planda yeterli)
    tracesSampleRate: 0.1,

    // Session Replay (opsiyonel — hata anında ne olduğunu video gibi izle)
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,

    // Production dışında debug modunu aç
    debug: process.env.NODE_ENV === "development",

    // Geliştirme ortamında hata gönderme
    enabled: process.env.NODE_ENV === "production",
  });
}
