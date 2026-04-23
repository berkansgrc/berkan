import { createClient } from "@/utils/supabase/server";
import ExamSearch from "@/components/exam/ExamSearch";
import type { ExamSearchItem } from "@/lib/fuse";
import { Book } from "iconsax-react";

export const metadata = {
  title: "Sınavlar | Berkan Matematik",
  description: "Tüm matematik sınavlarına göz atın, hemen girmeye başlayın.",
};

// ISR: 2 dakikada bir yenile — her ziyarette fresh fetch gerekmez
export const revalidate = 120;

export default async function ExamsPage() {
  const supabase = await createClient();

  const { data: exams, error } = await supabase
    .from("exams")
    .select("id, title, description, duration_minutes, share_code, access_mode")
    .eq("is_published", true)
    .eq("access_mode", "public")
    .order("created_at", { ascending: false });

  const examList: ExamSearchItem[] = exams ?? [];

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] w-full pb-20 bg-background overflow-x-hidden">
      {/* Decorative Ethereal Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\\\'0 0 200 200\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\'%3E%3Cfilter id=\\\'noiseFilter\\\'%3E%3CfeTurbulence type=\\\'fractalNoise\\\' baseFrequency=\\\'0.65\\\' numOctaves=\\\'3\\\' stitchTiles=\\\'stitch\\\'/%3E%3C/filter%3E%3Crect width=\\\'100%25\\\' height=\\\'100%25\\\' filter=\\\'url(%23noiseFilter)\\\'/%3E%3C/svg%3E")' }}></div>
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none -translate-x-1/3 -translate-y-1/3"></div>

      {/* Header section with abstract visuals */}
      <div className="relative border-b border-border/50 bg-card/60 backdrop-blur-xl z-10">
        <div className="absolute top-0 right-0 w-[400px] h-full bg-secondary/10 rounded-full blur-[80px] z-0 pointer-events-none translate-x-1/2"></div>
        <div className="container max-w-7xl px-6 lg:px-12 py-12 mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-md rounded-full"></div>
              <div className="relative z-10 h-14 w-14 rounded-2xl bg-primary-container border border-primary/20 flex items-center justify-center shadow-xl shadow-primary/10">
                <Book color="currentColor" size={24} className="h-7 w-7 text-primary" variant="Bold" />
              </div>
            </div>
            <div>
               <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">Sınavlar</h1>
            </div>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium mt-2">
            {error
              ? "Sınavlar yüklenirken bir hata oluştu."
              : "Açık uçlu deneme sınavlarını çözerek analitik zekanı bir üst seviyeye taşı."}
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="container max-w-7xl px-6 lg:px-12 py-12 mx-auto relative z-10">
        {error ? (
          <div className="rounded-[1.5rem] bg-destructive/10 p-8 text-destructive text-center font-bold border border-destructive/20 shadow-sm">
            Sınavlar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
          </div>
        ) : examList.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-primary/20 bg-primary/5 p-16 text-center text-muted-foreground flex flex-col items-center justify-center md:min-h-[400px]">
            <div className="w-16 h-16 bg-primary/10 rounded-[1.25rem] flex items-center justify-center mb-6 border border-primary/20 shadow-sm">
              <Book color="currentColor" size={24} className="w-8 h-8 text-primary opacity-80" variant="Bold" />
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">Henüz sınav bulunmuyor.</p>
            <p className="text-base mt-2 max-w-md mx-auto">Yakında yepyeni kinetik deneme sınavları buraya eklenecek. Beklemede kal!</p>
          </div>
        ) : (
          <ExamSearch exams={examList} />
        )}
      </div>
    </div>
  );
}
