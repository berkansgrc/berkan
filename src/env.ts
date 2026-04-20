/**
 * Çevre Değişkenleri Doğrulama — Zod
 *
 * Bu dosya uygulama başlangıcında import edilir.
 * Eğer herhangi bir çevre değişkeni eksik veya hatalıysa,
 * sayfa render edilmeden önce net bir hata mesajı verir.
 *
 * Yeni bir çevre değişkeni eklediğinizde buraya da ekleyin.
 */

import { z } from "zod";

// ─── Server-Side Değişkenler ───
const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(10, "SUPABASE_SERVICE_ROLE_KEY çok kısa veya eksik"),

  // Sentry DSN (opsiyonel — kurulmamışsa uygulamayı durdurma)
  SENTRY_DSN: z.string().url().optional(),
});

// ─── Public (Client + Server) Değişkenler ───
const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL geçerli bir URL olmalı"),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(10, "NEXT_PUBLIC_SUPABASE_ANON_KEY çok kısa veya eksik"),

  NEXT_PUBLIC_IMGBB_API_KEY: z
    .string()
    .min(5, "NEXT_PUBLIC_IMGBB_API_KEY eksik")
    .optional(),
});

// ─── Doğrulama ───
function validateEnv() {
  // Public değişkenler her yerde erişilebilir
  const publicResult = publicSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_IMGBB_API_KEY: process.env.NEXT_PUBLIC_IMGBB_API_KEY,
  });

  if (!publicResult.success) {
    console.error(
      "❌ Public çevre değişkenleri hatalı:",
      publicResult.error.flatten().fieldErrors
    );
    throw new Error("Eksik veya hatalı public çevre değişkenleri. Logları kontrol edin.");
  }

  // Server değişkenler sadece sunucu tarafında kontrol edilir
  if (typeof window === "undefined") {
    const serverResult = serverSchema.safeParse({
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      SENTRY_DSN: process.env.SENTRY_DSN,
    });

    if (!serverResult.success) {
      console.error(
        "❌ Server çevre değişkenleri hatalı:",
        serverResult.error.flatten().fieldErrors
      );
      throw new Error("Eksik veya hatalı server çevre değişkenleri. Logları kontrol edin.");
    }

    return { ...publicResult.data, ...serverResult.data };
  }

  return publicResult.data;
}

export const env = validateEnv();
