"use client";

import { useState } from "react";
import {
  Video,
  FileText,
  AppWindow,
  PlayCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  BookOpen,
  AlertTriangle,
} from "lucide-react";

interface Topic {
  id: string;
  name: string;
}

interface ContentItem {
  id: string;
  topic_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  drive_file_url: string | null;
  app_url: string | null;
}

// YouTube linkinden Video ID çıkar
function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
}

// Google Drive linkini preview embed'e dönüştür
function getDriveEmbedUrl(url: string): string {
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  }
  return url;
}

export default function LessonViewer({
  topics,
  contents,
  courseName,
}: {
  topics: Topic[];
  contents: ContentItem[];
  courseName: string;
}) {
  // Aktif tabi akıllıca belirle
  const determineTab = (content: ContentItem) => {
    const yId = content.video_url ? extractYoutubeId(content.video_url) : null;
    if (yId) return "video";
    const dUrl = content.drive_file_url ? getDriveEmbedUrl(content.drive_file_url) : null;
    if (dUrl) return "pdf";
    if (content.app_url) return "app";
    return "video";
  };

  const [selectedContent, setSelectedContent] = useState<ContentItem | undefined>(contents[0]);
  const [activeTab, setActiveTab] = useState<"video" | "pdf" | "app">(() => 
    contents[0] ? determineTab(contents[0]) : "video"
  );
  const [iframeError, setIframeError] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set(topics.map(t => t.id))); // Tüm konular başlangıçta açık


  const selectContent = (content: ContentItem) => {
    setSelectedContent(content);
    setActiveTab(determineTab(content));
    setIframeError(false);
  };

  const toggleTopic = (id: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const youtubeId = selectedContent?.video_url
    ? extractYoutubeId(selectedContent.video_url)
    : null;

  const driveEmbedUrl = selectedContent?.drive_file_url
    ? getDriveEmbedUrl(selectedContent.drive_file_url)
    : null;

  const tabs = selectedContent ? [
    { key: "video" as const, label: "Video", icon: Video, available: !!youtubeId },
    { key: "pdf" as const, label: "Doküman", icon: FileText, available: !!driveEmbedUrl },
    { key: "app" as const, label: "Uygulama", icon: AppWindow, available: !!selectedContent.app_url },
  ].filter((t) => t.available) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sol: Ders İçerik Alanı */}
      <div className="lg:col-span-8 space-y-5">
        {selectedContent ? (
          <>
            {/* Tab Bar */}
            {tabs.length > 1 && (
              <div className="flex items-center gap-1.5 bg-muted/30 border border-border/50 rounded-2xl p-1.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setIframeError(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-bold text-sm transition-all ${
                      activeTab === tab.key
                        ? "bg-card shadow-sm text-foreground border border-border/50"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* İçerik Embed Alanı */}
            <div className="rounded-[1.75rem] border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-xl">
              {/* Video Tab */}
              {activeTab === "video" && youtubeId && (
                <div className="aspect-video w-full bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title={selectedContent.title}
                  />
                </div>
              )}

              {/* PDF Tab */}
              {activeTab === "pdf" && driveEmbedUrl && (
                <div className="aspect-[4/3] w-full bg-white">
                  <iframe
                    src={driveEmbedUrl}
                    className="w-full h-full"
                    allow="autoplay"
                    loading="lazy"
                    title={`${selectedContent.title} - PDF`}
                  />
                </div>
              )}

              {/* Uygulama Tab */}
              {activeTab === "app" && selectedContent.app_url && (
                <div className="relative">
                  {!iframeError ? (
                    <div className="aspect-[4/3] w-full">
                      <iframe
                        src={selectedContent.app_url}
                        className="w-full h-full"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                        loading="lazy"
                        title={`${selectedContent.title} - Uygulama`}
                        onError={() => setIframeError(true)}
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] w-full bg-muted/20 flex flex-col items-center justify-center gap-4 p-8">
                      <AlertTriangle className="w-10 h-10 text-yellow-500" />
                      <p className="font-heading font-bold text-foreground text-center">
                        Bu uygulama site içinde görüntülenemiyor.
                      </p>
                      <a
                        href={`/uygulama/${selectedContent.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm hover:opacity-90 transition-opacity"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Yeni Sekmede Aç
                      </a>
                    </div>
                  )}
                  {/* Her zaman göster: Yeni sekmede aç linki */}
                  {!iframeError && (
                    <div className="px-5 py-3 border-t border-border/30 bg-muted/10 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">
                        Tam ekran için yeni sekmede açın
                      </span>
                      <a
                        href={`/uygulama/${selectedContent.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Yeni Sekmede Aç
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* İçerik yoksa */}
              {tabs.length === 0 && (
                <div className="aspect-video w-full bg-muted/20 flex items-center justify-center">
                  <p className="text-muted-foreground font-medium">
                    Bu materyale henüz içerik eklenmemiş.
                  </p>
                </div>
              )}
            </div>

            {/* İçerik Bilgisi */}
            <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-6">
              <h2 className="font-heading font-extrabold text-xl text-foreground mb-2">
                {selectedContent.title}
              </h2>
              {selectedContent.description && (
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  {selectedContent.description}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="aspect-video w-full rounded-[1.75rem] border border-border/50 bg-card/60 backdrop-blur-xl flex flex-col items-center justify-center text-muted-foreground shadow-sm">
             <BookOpen className="w-12 h-12 mb-4 opacity-50 text-primary" />
             <p className="font-heading font-bold text-lg">Sağ taraftan bir içerik seçin</p>
          </div>
        )}
      </div>

      {/* Sağ: Ders Listesi (Konular + İçerikler Akordeonu) */}
      <div className="lg:col-span-4 space-y-4">
        <h3 className="font-heading font-black text-foreground text-sm flex items-center gap-2 px-1">
          <span className="w-2 h-5 rounded-full bg-secondary inline-block" />
          {courseName} Müfredatı
        </h3>

        <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm divide-y divide-border/30">
          {topics.map((topic, topicIdx) => {
            const topicContents = contents.filter(c => c.topic_id === topic.id);
            const isExpanded = expandedTopics.has(topic.id);

            return (
               <div key={topic.id} className="flex flex-col">
                  {/* Topic Header */}
                  <button 
                    onClick={() => toggleTopic(topic.id)}
                    className="w-full text-left flex items-center justify-between px-5 py-4 bg-muted/10 hover:bg-muted/30 transition-colors"
                  >
                     <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs font-black">
                            {topicIdx + 1}
                         </div>
                         <div>
                            <p className="font-heading font-black text-sm text-foreground">
                               {topic.name}
                            </p>
                            <p className="text-[10px] font-bold text-muted-foreground">
                               {topicContents.length} materyal
                            </p>
                         </div>
                     </div>
                     {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                     ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                     )}
                  </button>

                  {/* Contents inside Topic */}
                  {isExpanded && (
                     <div className="flex flex-col divide-y divide-border/20 border-t border-border/20 bg-background/50">
                        {topicContents.map((content, idx) => {
                          const isSelected = selectedContent?.id === content.id;
                          return (
                            <button
                              key={content.id}
                              onClick={() => selectContent(content)}
                              className={`w-full text-left flex items-center gap-3 px-5 py-3 transition-colors ${
                                isSelected
                                  ? "bg-primary/5 border-l-2 border-primary"
                                  : "hover:bg-muted/20 border-l-2 border-transparent"
                              }`}
                            >
                              <div className="flex flex-col flex-1 min-w-0 pl-2">
                                <p className={`font-heading font-extrabold text-[13px] truncate ${
                                  isSelected ? "text-primary" : "text-foreground/80"
                                }`}>
                                  {content.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {content.video_url && <Video className={`w-3 h-3 ${isSelected ? "text-red-500" : "text-muted-foreground"}`} />}
                                  {content.drive_file_url && <FileText className={`w-3 h-3 ${isSelected ? "text-blue-500" : "text-muted-foreground"}`} />}
                                  {content.app_url && <AppWindow className={`w-3 h-3 ${isSelected ? "text-violet-500" : "text-muted-foreground"}`} />}
                                </div>
                              </div>
                              {isSelected && <PlayCircle className="w-4 h-4 text-primary flex-shrink-0" />}
                            </button>
                          );
                        })}
                        {topicContents.length === 0 && (
                           <div className="px-5 py-3 text-xs text-muted-foreground italic">
                              Bu konuya henüz içerik eklenmemiş.
                           </div>
                        )}
                     </div>
                  )}
               </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
