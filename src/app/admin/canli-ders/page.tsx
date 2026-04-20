import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminLiveStreamForm from "@/components/admin/AdminLiveStreamForm";
import { ArrowLeft, Radio } from "lucide-react";

export const metadata = {
  title: "Canlı Ders Yönetimi | Admin",
};

export default async function AdminCanliDersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: config } = await supabase.from("live_stream_config").select("*").single();

  return (
    <div className="p-6 lg:p-10 pb-24 lg:pb-10 relative z-10 max-w-3xl">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/admin/exams" className="w-10 h-10 rounded-full bg-input/50 border border-border/50 flex items-center justify-center hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-5 h-5 text-primary" />
            <h1 className="text-3xl font-heading font-extrabold text-foreground">Canlı Ders Yönetimi</h1>
          </div>
          <p className="text-muted-foreground text-sm font-medium">YouTube canlı yayınını buradan yönet ve aktif et.</p>
        </div>
      </div>
      <AdminLiveStreamForm initialConfig={config} />
    </div>
  );
}
