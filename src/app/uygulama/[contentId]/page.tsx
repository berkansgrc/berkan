import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ contentId: string }> }) {
  const { contentId } = await params;
  const supabase = await createClient();
  const { data: content } = await supabase.from("contents").select("title").eq("id", contentId).single();
  
  return {
    title: content ? `${content.title} | Uygulama` : "Uygulama | Berkan Matematik",
  };
}

export default async function AppViewerPage({ params }: { params: Promise<{ contentId: string }> }) {
  const { contentId } = await params;
  const supabase = await createClient();

  const { data: content } = await supabase
    .from("contents")
    .select("*, topics(course_id, courses(grade_slug))")
    .eq("id", contentId)
    .single();

  if (!content || !content.app_url) {
    notFound();
  }

  // Find back link
  // The structure of the query is highly nested.
  // topics -> courses -> grade_slug
  let backHref = "/";
  if (content.topics && typeof content.topics === "object") {
    const topic = content.topics as any;
    if (topic.courses && topic.courses.grade_slug) {
      backHref = `/sinif/${topic.courses.grade_slug}`;
    }
  }

  return (
    <div className="relative flex flex-col w-full min-h-[calc(100vh-4.5rem)] bg-background">
      {/* Sub Header for Navigation */}
      <div className="border-b border-border/50 bg-card/60 backdrop-blur-xl px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Sınıfa Dön</span>
          </Link>
          <div className="h-4 w-px bg-border/50" />
          <h1 className="font-heading font-bold text-foreground truncate max-w-md">
            {content.title}
          </h1>
        </div>
        <a
          href={content.app_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1.5 transition-colors bg-primary/10 px-3 py-1.5 rounded-full"
        >
          <span>Pencerede Aç</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Main Iframe Viewer */}
      <div className="flex-1 w-full bg-muted/10 relative">
        <iframe
          src={content.app_url}
          className="absolute inset-0 w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
          loading="lazy"
          allowFullScreen
          title={`${content.title} - Uygulama`}
        />
      </div>
    </div>
  );
}
