import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Add, Global, Lock1, Clock, Edit2, Category } from "iconsax-react";
import DeleteExamButton from "@/components/admin/DeleteExamButton";

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

  // Admin tüm sınavları görür, öğretmen sadece kendininkileri
  let query = supabase
    .from("exams")
    .select("id, title, description, duration_minutes, access_mode, is_published, share_code, created_at")
    .order("created_at", { ascending: false });

  if (profile?.role === "teacher") {
    query = query.eq("created_by", user!.id);
  }

  const { data: exams } = await query;

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
             <Add color="currentColor" size={24} className="h-4 w-4" variant="Bold" />
             <span>Yeni Sınav Oluştur</span>
          </button>
        </Link>
      </div>

      {!exams || exams.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-primary/20 bg-primary/5 p-16 text-center text-muted-foreground flex flex-col items-center justify-center md:min-h-[400px]">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20 shadow-sm">
             <Category color="currentColor" size={24} className="w-8 h-8 text-primary opacity-80" variant="Bold" />
          </div>
          <p className="text-2xl font-heading font-bold text-foreground">Henüz sınav oluşturmadınız.</p>
          <p className="text-base mt-2 max-w-sm">Sağ üstteki "Yeni Sınav Oluştur" butonuna tıklayarak ilk interaktif sınavını hazırla.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="group flex flex-col justify-between rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-6 hover:shadow-[0_20px_40px_rgba(44,47,48,0.06)] hover:-translate-y-1 hover:border-border transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors pointer-events-none"></div>
              
              <div>
                  <div className="flex justify-between items-start mb-4">
                      {/* Yayın durumu */}
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                          exam.is_published
                            ? "bg-primary-container/30 text-primary-fixed-variant border border-primary/20"
                            : "bg-surface-variant text-on-surface-variant border border-border"
                        }`}
                      >
                        {exam.is_published ? "Yayında" : "Taslak"}
                      </span>

                      {/* Erişim */}
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-input/40 px-2.5 py-1 rounded-full border border-border/50">
                        {exam.access_mode === "public" ? (
                          <><Global color="currentColor" size={24} className="h-3 w-3 text-secondary" variant="Outline" /> Açık Sınav</>
                        ) : (
                          <><Lock1 color="currentColor" size={24} className="h-3 w-3 text-tertiary-foreground" variant="Outline" /> Gizli Sınav</>
                        )}
                      </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-foreground line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">{exam.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-6">
                      {exam.description || "Açıklama bulunmuyor."}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6 font-medium">
                    <span className="flex items-center gap-1.5 bg-input/50 px-3 py-1.5 rounded-lg border border-border/50">
                      <Clock color="currentColor" size={24} className="h-4 w-4 text-primary" variant="Outline" /> {exam.duration_minutes} Dk
                    </span>
                    {exam.share_code && (
                      <span className="flex items-center justify-between gap-2 font-mono text-xs bg-primary/5 text-primary px-3 py-1.5 rounded-lg border border-primary/20 font-bold tracking-widest">
                         {exam.share_code}
                      </span>
                    )}
                  </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                <Link href={`/admin/exams/${exam.id}/edit`} className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 bg-input/40 hover:bg-primary-container/20 border border-border hover:border-primary/30 text-foreground font-heading font-bold text-sm h-11 rounded-xl shadow-sm transition-all group/edit">
                    <Edit2 color="currentColor" size={24} className="h-4 w-4 text-primary group-hover/edit:rotate-12 transition-transform" variant="Bold" /> Düzenle
                  </button>
                </Link>
                <div className="ml-3 pl-3 border-l border-border/50 flex items-center">
                    <DeleteExamButton examId={exam.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
