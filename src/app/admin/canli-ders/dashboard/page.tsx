import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LiveDashboardClient from "@/components/admin/LiveDashboardClient";

export const metadata = {
  title: "Canlı Kontrol Paneli | Admin",
};

export default async function LiveDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: config } = await supabase
    .from("live_stream_config")
    .select("*")
    .single();

  return <LiveDashboardClient initialConfig={config} />;
}
