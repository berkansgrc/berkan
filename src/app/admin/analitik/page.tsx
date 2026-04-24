import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AnalitikPageClient from "@/components/admin/AnalitikPageClient";

export const metadata = {
  title: "Analitik | Berkan Matematik",
  description: "Sınav başarı analizleri, kazanım takibi ve performans raporları.",
};

export default async function AdminAnalitikPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  return <AnalitikPageClient />;
}
