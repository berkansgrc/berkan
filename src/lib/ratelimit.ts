/**
 * Rate Limiter — Supabase Tabanlı İstek Sınırlama
 *
 * Serverless ortamda (Netlify) Redis olmadan çalışan,
 * Supabase tabanlı sliding window rate limiter.
 *
 * Kullanım:
 *   const result = await checkRateLimit("user-123", "exam_submit", { maxRequests: 2, windowMs: 60_000 });
 *   if (!result.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 */

import { createClient } from "@/utils/supabase/server";

type RateLimitOptions = {
  /** Bu penceredeki maksimum istek sayısı */
  maxRequests: number;
  /** Pencere süresi (milisaniye) — varsayılan: 60 saniye */
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
};

const DEFAULTS: RateLimitOptions = {
  maxRequests: 5,
  windowMs: 60_000, // 1 dakika
};

export async function checkRateLimit(
  identifier: string,
  action: string,
  options?: Partial<RateLimitOptions>
): Promise<RateLimitResult> {
  const { maxRequests, windowMs } = { ...DEFAULTS, ...options };
  const supabase = await createClient();
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMs);

  // 1. Mevcut kaydı bul
  const { data: existing } = await supabase
    .from("rate_limits")
    .select("id, token_count, window_start")
    .eq("identifier", identifier)
    .eq("action", action)
    .single();

  // 2. Kayıt yok veya pencere süresi dolmuş → sıfırla
  if (!existing || new Date(existing.window_start) < windowStart) {
    await supabase
      .from("rate_limits")
      .upsert(
        {
          identifier,
          action,
          token_count: 1,
          window_start: now.toISOString(),
        },
        { onConflict: "identifier,action" }
      );

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: new Date(now.getTime() + windowMs),
    };
  }

  // 3. Pencere içindeyiz — limit kontrolü
  const newCount = existing.token_count + 1;

  if (newCount > maxRequests) {
    const resetAt = new Date(
      new Date(existing.window_start).getTime() + windowMs
    );
    return {
      allowed: false,
      remaining: 0,
      resetAt,
    };
  }

  // 4. Sayacı artır
  await supabase
    .from("rate_limits")
    .update({ token_count: newCount })
    .eq("id", existing.id);

  return {
    allowed: true,
    remaining: maxRequests - newCount,
    resetAt: new Date(
      new Date(existing.window_start).getTime() + windowMs
    ),
  };
}

/**
 * NextRequest'ten IP adresi çıkarır.
 * Netlify/Vercel/Cloudflare proxy header'larını destekler.
 */
export function getClientIP(request: Request): string {
  const forwarded =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown";

  // x-forwarded-for birden fazla IP içerebilir, ilkini al
  return forwarded.split(",")[0].trim();
}
