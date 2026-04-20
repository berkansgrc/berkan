import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import LessonViewer from "@/components/lesson/LessonViewer";
import { ArrowLeft, BookOpen } from "lucide-react";

export const revalidate = 120;

const GRADES = [
  { label: "5. Sınıf", value: "5-sinif" },
  { label: "6. Sınıf", value: "6-sinif" },
  { label: "7. Sınıf", value: "7-sinif" },
  { label: "LGS", value: "lgs" },
  { label: "9. Sınıf", value: "9-sinif" },
  { label: "10. Sınıf", value: "10-sinif" },
  { label: "11. Sınıf", value: "11-sinif" },
  { label: "TYT-AYT", value: "tyt-ayt" },
];

export async function generateMetadata({ params }: { params: Promise<{ gradeSlug: string }> }) {
  const { gradeSlug } = await params;
  const gradeLabel = GRADES.find((g) => g.value === gradeSlug)?.label || "Sınıf";
  return {
    title: `${gradeLabel} Matematik | Berkan Matematik`,
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
    const { data: fetchedTopics } = await supabase
      .from("topics")
      .select("*")
      .eq("course_id", course.id)
      .order("sort_order");

    topics = fetchedTopics ?? [];
    const topicIds = topics.map((t) => t.id);

    if (topicIds.length > 0) {
      const { data } = await supabase
        .from("contents")
        .select("*")
        .in("topic_id", topicIds)
        .eq("is_published", true)
        .order("sort_order");
      contents = data ?? [];
    }
  }


  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] w-full pb-20 bg-background overflow-x-hidden">
      {/* Decorative */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] z-0 pointer-events-none translate-x-1/3 -translate-y-1/3" />

      {/* Header */}
      <div className="relative border-b border-border/50 bg-card/60 backdrop-blur-xl z-10">
        <div className="container max-w-7xl px-6 lg:px-12 py-8 mx-auto relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-secondary" />
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
            <BookOpen className="w-12 h-12 mb-4 opacity-30" />
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
