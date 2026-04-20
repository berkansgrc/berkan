import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Sadece korumalı rotalarda çalıştır:
     * /dashboard ve /admin — public sayfalar middleware'den geçmez.
     * Bu sayede ana sayfa, sınavlar, sınıf sayfaları vb.
     * her yüklenişte gereksiz Supabase isteği atmaz (~200ms/istek tasarruf).
     */
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
