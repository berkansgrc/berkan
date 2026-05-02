import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import LessonViewer from "@/components/lesson/LessonViewer";
import { ArrowLeft2, Book } from "iconsax-react";

export const revalidate = 300; // 5 dakikada bir yenile

const GRADES = [
  { label: "5. Sınıf", value: "5-sinif", color: "bg-blue-500/10" },
  { label: "6. Sınıf", value: "6-sinif", color: "bg-green-500/10" },
  { label: "7. Sınıf", value: "7-sinif", color: "bg-purple-500/10" },
  { label: "LGS", value: "lgs", color: "bg-orange-500/10" },
  { label: "9. Sınıf", value: "9-sinif", color: "bg-teal-500/10" },
  { label: "10. Sınıf", value: "10-sinif", color: "bg-indigo-500/10" },
  { label: "11. Sınıf", value: "11-sinif", color: "bg-pink-500/10" },
  { label: "TYT-AYT", value: "tyt-ayt", color: "bg-red-500/10" },
];

/** Build anında tüm sınıf sayfalarını statik üret — CDN'den sıfır TTFB */
export async function generateStaticParams() {
  return GRADES.map((g) => ({ gradeSlug: g.value }));
}


export async function generateMetadata({ params }: { params: Promise<{ gradeSlug: string }> }) {
  const { gradeSlug } = await params;
  const gradeLabel = GRADES.find((g) => g.value === gradeSlug)?.label || "Sınıf";
  const title = `${gradeLabel} Matematik Dersleri | Berkan Matematik`;
  const description = `${gradeLabel} seviyesi için özel olarak hazırlanmış, MEB müfredatına uygun interaktif matematik dersleri, testler ve eğitim materyalleri.`;
  
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: "website",
    },
  };
}

export default async function GradePage({ params }: { params: Promise<{ gradeSlug: string }> }) {
  const { gradeSlug } = await params;
  const supabase = await createClient();

  const gradeName = GRADES.find((g) => g.value === gradeSlug)?.label;
  if (!gradeName) {
    notFound(); // Only 404 if the grade slug is completely invalid
  }

  // Find the course associated with this grade
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("grade_slug", gradeSlug)
    .single();

  let topics: any[] = [];
  let contents: any[] = [];

  if (course) {
    // Topics'i çek
    const { data: fetchedTopics } = await supabase
      .from("topics")
      .select("*")
      .eq("course_id", course.id)
      .order("sort_order");

    topics = fetchedTopics ?? [];
    const topicIds = topics.map((t) => t.id);

    if (topicIds.length > 0) {
      const { data: fetchedContents } = await supabase
        .from("contents")
        .select("*")
        .in("topic_id", topicIds)
        .eq("is_published", true)
        .order("sort_order");

      // Konuların sort_order'ına hızlı erişim için bir map (sözlük) oluşturalım
      const topicSortMap = new Map(topics.map(t => [t.id, t.sort_order ?? 0]));

      contents = (fetchedContents ?? []).sort((a, b) => {
        const orderA = topicSortMap.get(a.topic_id) ?? 0;
        const orderB = topicSortMap.get(b.topic_id) ?? 0;
        
        // Önce konuların sırasına göre sırala
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        
        // Aynı konunun içeriklerini kendi aralarında sırala
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      });
    }
  }


  const gradeColor = GRADES.find((g) => g.value === gradeSlug)?.color || "bg-secondary/10";

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] w-full pb-20 bg-background overflow-x-hidden">
      {/* Decorative */}
      <div className={`fixed top-0 right-0 w-[500px] h-[500px] ${gradeColor} rounded-full blur-[100px] z-0 pointer-events-none translate-x-1/3 -translate-y-1/3`} />

      {/* Header */}
      <div className="relative border-b border-border/50 bg-card/60 backdrop-blur-xl z-10">
        <div className="container max-w-7xl px-6 lg:px-12 py-8 mx-auto relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 text-sm font-medium"
          >
            <ArrowLeft2 color="currentColor" size={24} className="w-4 h-4" variant="Outline" />
            <span>Ana Sayfaya Dön</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
              <Book color="currentColor" size={24} className="w-6 h-6 text-secondary" variant="Bold" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-foreground">
                {gradeName}
              </h1>
              <p className="text-muted-foreground font-medium mt-0.5">
                {topics.length} konu, {contents.length} materyal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-7xl px-6 lg:px-12 py-10 mx-auto relative z-10">
        {topics.length === 0 || contents.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-border bg-card/50 p-16 text-center text-muted-foreground flex flex-col items-center">
            <Book color="currentColor" size={24} className="w-12 h-12 mb-4 opacity-30" variant="Bold" />
            <p className="text-xl font-heading font-bold text-foreground">
              Bu sınıfa henüz konu veya içerik eklenmemiş.
            </p>
            <p className="mt-2 text-sm">
              Çok yakında yeni içeriklerle karşınızda olacağız!
            </p>
          </div>
        ) : (
          <LessonViewer topics={topics} contents={contents} courseName={gradeName} />
        )}
      </div>
    </div>
  );
}
