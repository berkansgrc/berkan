"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
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
  Search,
  X,
  MessageCircleQuestion,
  GraduationCap
} from "lucide-react";
import StudentQuizModal from "./StudentQuizModal";

interface Topic {
  id: string;
  name: string;
}

interface ContentItem {
  id: string;
  topic_id: string;
  title: string;
  description: string | null;
  description_rich?: string | null;
  thumbnail_url?: string | null;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

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
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + (selectedContent?.id || "empty")}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-[1.75rem] border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-xl"
              >
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
              </motion.div>
            </AnimatePresence>

            {/* İçerik Bilgisi */}
            <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="font-heading font-extrabold text-xl text-foreground mb-4">
                {selectedContent.title}
              </h2>
              
              {/* Rich Text / Markdown Description */}
              {(selectedContent.description_rich || selectedContent.description) && (
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground marker:text-primary prose-headings:font-heading prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm, remarkMath]} 
                    rehypePlugins={[rehypeKatex]}
                  >
                    {selectedContent.description_rich || selectedContent.description || ""}
                  </ReactMarkdown>
                </div>
              )}
              
              {/* Yeni Eklenen Etkileşimli Araçlar (Placeholder) */}
              <div className="mt-8 pt-6 border-t border-border/40 grid grid-cols-1 gap-4">
                <button 
                  onClick={() => setIsQuizModalOpen(true)}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold hover:bg-orange-500/20 transition-colors shadow-sm"
                >
                   <GraduationCap className="w-5 h-5" />
                   Mini Teste Başla
                </button>
              </div>
            </div>

            {/* Önceki / Sonraki Ders Navigasyonu */}
            {(() => {
              const currentIndex = contents.findIndex(c => c.id === selectedContent.id);
              const prevContent = currentIndex > 0 ? contents[currentIndex - 1] : null;
              const nextContent = currentIndex < contents.length - 1 ? contents[currentIndex + 1] : null;
              const getTopicName = (topicId: string) => topics.find(t => t.id === topicId)?.name ?? "";

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Önceki */}
                  {prevContent ? (
                    <button
                      onClick={() => selectContent(prevContent)}
                      className="group flex items-center gap-3 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-4 text-left hover:bg-primary/5 hover:border-primary/30 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-muted/40 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                        <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Önceki Ders</p>
                        <p className="text-sm font-heading font-extrabold text-foreground truncate group-hover:text-primary transition-colors">
                          {prevContent.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">{getTopicName(prevContent.topic_id)}</p>
                      </div>
                    </button>
                  ) : (
                    <div />
                  )}

                  {/* Sonraki */}
                  {nextContent ? (
                    <button
                      onClick={() => selectContent(nextContent)}
                      className="group flex items-center gap-3 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-4 text-left hover:bg-primary/5 hover:border-primary/30 transition-all"
                    >
                      <div className="min-w-0 flex-1 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Sonraki Ders</p>
                        <p className="text-sm font-heading font-extrabold text-foreground truncate group-hover:text-primary transition-colors">
                          {nextContent.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">{getTopicName(nextContent.topic_id)}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-muted/40 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              );
            })()}
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

        {/* Arama Çubuğu */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Konu veya materyal ara…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm divide-y divide-border/30">
          {(() => {
            const q = searchQuery.toLowerCase().trim();
            const filteredTopics = q
              ? topics.filter(topic => {
                  const topicMatch = topic.name.toLowerCase().includes(q);
                  const contentMatch = contents.some(c => c.topic_id === topic.id && c.title.toLowerCase().includes(q));
                  return topicMatch || contentMatch;
                })
              : topics;

            if (q && filteredTopics.length === 0) {
              return (
                <div className="px-5 py-8 text-center">
                  <Search className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm font-heading font-bold text-muted-foreground">
                    &ldquo;{searchQuery}&rdquo; ile eşleşen sonuç bulunamadı.
                  </p>
                </div>
              );
            }

            return filteredTopics.map((topic, topicIdx) => {
            const allTopicContents = contents.filter(c => c.topic_id === topic.id);
            const topicContents = q
              ? allTopicContents.filter(c => c.title.toLowerCase().includes(q) || topic.name.toLowerCase().includes(q))
              : allTopicContents;
            const isExpanded = q ? true : expandedTopics.has(topic.id);

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
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: "auto", opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         transition={{ duration: 0.3, ease: "easeInOut" }}
                         className="flex flex-col divide-y divide-border/20 border-t border-border/20 bg-background/50 overflow-hidden"
                       >
                          {topicContents.map((content, idx) => {
                            const isSelected = selectedContent?.id === content.id;
                            return (
                              <button
                                key={content.id}
                                onClick={() => selectContent(content)}
                                className={`w-full text-left flex items-start gap-3 px-5 py-3 transition-colors ${
                                  isSelected
                                    ? "bg-primary/5 border-l-2 border-primary"
                                    : "hover:bg-muted/20 border-l-2 border-transparent"
                                }`}
                              >
                                {content.thumbnail_url ? (
                                   <div className="w-16 h-10 rounded-md overflow-hidden bg-muted shrink-0 flex items-center justify-center border border-border/50">
                                      <img src={content.thumbnail_url} alt={content.title} className="w-full h-full object-cover" />
                                   </div>
                                ) : (
                                   <div className="w-8 h-8 rounded-md bg-muted/50 flex items-center justify-center shrink-0">
                                      {content.video_url ? <Video className="w-4 h-4 text-muted-foreground" /> : <FileText className="w-4 h-4 text-muted-foreground" />}
                                   </div>
                                )}
                                
                                <div className="flex flex-col flex-1 min-w-0">
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
                                {isSelected && <PlayCircle className="w-4 h-4 text-primary flex-shrink-0 mt-1" />}
                              </button>
                            );
                          })}
                          {topicContents.length === 0 && (
                             <div className="px-5 py-3 text-xs text-muted-foreground italic">
                                Bu konuya henüz içerik eklenmemiş.
                             </div>
                          )}
                       </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            );
          });
          })()}
        </div>
      </div>
      
      {/* Quiz Modal */}
      {selectedContent && (
        <StudentQuizModal 
          contentId={selectedContent.id} 
          isOpen={isQuizModalOpen} 
          onClose={() => setIsQuizModalOpen(false)} 
        />
      )}
    </div>
  );
}
