/**
 * Paylaşımlı Supabase Sorguları — React.cache() ile tekil istekler
 *
 * Next.js App Router'da aynı render döngüsü içinde bu fonksiyonlar
 * kaç kez çağrılırsa çağrılsın sadece 1 kez ağ isteği yapar.
 * Navbar + Dashboard + Layout aynı veriyi paylaşır, her biri ayrıca fetch yapmaz.
 */

import { cache } from "react";
import { createClient } from "./server";

/** Giriş yapmış kullanıcıyı döner. Aynı request içinde tekrar çağrılırsa cache'den gelir. */
export const getCachedUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/** Kullanıcı profilini döner (role, full_name). Aynı request içinde cache'lenir. */
export const getCachedProfile = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", userId)
    .single();
  return data;
});
