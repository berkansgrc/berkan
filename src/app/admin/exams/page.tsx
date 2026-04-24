import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Add } from "iconsax-react";
import ExamListClient from "@/components/admin/ExamListClient";

export const metadata = {
  title: "Sınav Yönetimi | Berkan Matematik",
};

export const revalidate = 30;

export default async function AdminExamsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

  // Sınavları sorularıyla birlikte çek (önizleme için)
  let query = supabase
    .from("exams")
    .select("id, title, description, duration_minutes, access_mode, is_published, share_code, created_at, questions(id, body, correct_option, order_index, achievement)")
    .order("created_at", { ascending: false });

  if (profile?.role === "teacher") {
    query = query.eq("created_by", user!.id);
  }

  const { data: exams } = await query;

  // Her sınav için katılımcı sayısını çek
  const examsWithCounts = await Promise.all(
    (exams || []).map(async (exam) => {
      const { count } = await supabase
        .from("exam_results")
        .select("*", { count: "exact", head: true })
        .eq("exam_id", exam.id)
        .not("submitted_at", "is", null);

      return {
        ...exam,
        questions: exam.questions || [],
        _resultCount: count || 0,
      };
    })
  );

  return (
    <div className="p-6 lg:p-10 pb-24 lg:pb-10 relative z-10 w-full h-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-heading font-extrabold tracking-tight text-foreground">Sınav Yönetimi</h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Yeni nesil soru bankanızı oluşturun, düzenleyin ve testlerinizi yönetin.
          </p>
        </div>
        <Link href="/admin/exams/new">
          <button className="bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-bold text-sm px-6 py-3.5 rounded-[1.25rem] shadow-[0_12px_24px_rgba(0,103,98,0.25)] hover:shadow-[0_16px_32px_rgba(0,103,98,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group border-0">
             <Add className="h-4 w-4" variant="Bold" />
             <span>Yeni Sınav Oluştur</span>
          </button>
        </Link>
      </div>

      <ExamListClient exams={examsWithCounts} />
    </div>
  );
}

