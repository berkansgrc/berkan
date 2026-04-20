import { createClient } from "@/utils/supabase/server";
import ContentManager from "@/components/admin/ContentManager";
import { GraduationCap } from "lucide-react";

export const metadata = {
  title: "İçerik Yönetimi | Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const supabase = await createClient();

  // Tüm veriyi paralel çek
  const [{ data: courses }, { data: topics }, { data: contents }] = await Promise.all([
    supabase.from("courses").select("*").order("sort_order"),
    supabase.from("topics").select("*").order("sort_order"),
    supabase.from("contents").select("*").order("sort_order"),
  ]);

  return (
    <div className="p-6 lg:p-10 pb-24 lg:pb-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-heading font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-primary" />
          İçerik Yönetimi
        </h1>
        <p className="text-muted-foreground text-base mt-1 font-medium">
          Dersler, konular ve ders içeriklerini (video, pdf, uygulama) yönetin.
        </p>
      </div>

      {/* Client Component */}
      <ContentManager
        courses={courses ?? []}
        topics={topics ?? []}
        contents={contents ?? []}
      />
    </div>
  );
}
