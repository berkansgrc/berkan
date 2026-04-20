"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  createTopicForGrade,
  deleteTopic,
  createContent,
  updateContent,
  deleteContent,
  moveTopic,
} from "@/app/admin/icerikler/actions";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  Pencil,
  X,
  BookOpen,
  Video,
  FileText,
  AppWindow,
  Save,
  Eye,
  MenuSquare,
  Loader2,
  ArrowLeft,
  ArrowUp,
  ArrowDown
} from "lucide-react";

interface Course {
  id: string;
  grade_slug: string;
  name: string;
  sort_order: number;
}

interface Topic {
  id: string;
  course_id: string;
  name: string;
  sort_order: number;
}

interface Content {
  id: string;
  topic_id: string;
  title: string;
  video_url: string | null;
  drive_file_url: string | null;
  app_url: string | null;
  is_published: boolean;
  sort_order: number;
}

function SubmitButton({ 
  children, 
  className,
  loadingText = "İşleniyor..." 
}: { 
  children: React.ReactNode; 
  className?: string;
  loadingText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${className} ${pending ? "opacity-70 cursor-not-allowed" : ""}`}>
      {pending ? (
        <span className="flex items-center gap-1.5"><Loader2 className="w-4 h-4 animate-spin" /> {loadingText}</span>
      ) : (
        children
      )}
    </button>
  );
}

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

export default function ContentManager({
  courses,
  topics,
  contents,
}: {
  courses: Course[];
  topics: Topic[];
  contents: Content[];
}) {
  const [activeGrade, setActiveGrade] = useState<string | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [addingContentTo, setAddingContentTo] = useState<string | null>(null);

  const toggleTopic = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedTopics((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ----- VIEW 1: GRADE CARDS GRID -----
  if (!activeGrade) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {GRADES.map((grade) => {
          // Bu sınıfa ait Topics sayısını bul
          const gradeCourse = courses.find((c) => c.grade_slug === grade.value);
          const gradeTopics = gradeCourse ? topics.filter((t) => t.course_id === gradeCourse.id) : [];
          const topicCount = gradeTopics.length;

          return (
            <button
              key={grade.value}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setActiveGrade(grade.value);
              }}
              className="text-left w-full relative z-10 group cursor-pointer rounded-[1.75rem] border border-border/50 bg-card/60 backdrop-blur-xl p-8 hover:bg-card/80 hover:shadow-xl hover:shadow-primary/5 transition-all outline-none"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <MenuSquare className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-foreground mb-2">
                {grade.label}
              </h3>
              <p className="text-muted-foreground font-medium text-sm flex items-center gap-1.5">
                 <BookOpen className="w-4 h-4 opacity-50" />
                 {topicCount} Konu
              </p>
            </button>
          );
        })}
      </div>
    );
  }

  // ----- VIEW 2: GRADE DETAILS (TOPICS LIST) -----
  const gradeLabel = GRADES.find((g) => g.value === activeGrade)?.label ?? "Bilinmeyen Sınıf";
  const gradeCourse = courses?.find((c) => c.grade_slug === activeGrade);
  const gradeTopics = gradeCourse && topics ? topics.filter((t) => t.course_id === gradeCourse.id) : [];

  return (
    <div className="space-y-6">
      {/* Geri Butonu & Başlık */}
      <div className="flex items-center gap-4">
        <button
          title="Sınıflara Dön"
          onClick={() => setActiveGrade(null)}
          className="w-10 h-10 rounded-full bg-input/50 border border-border/50 flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-foreground">{gradeLabel} İçerikleri</h2>
          <p className="text-sm text-muted-foreground font-medium">{gradeTopics.length} Konu</p>
        </div>
      </div>

      {/* Konu Ekleme Formu */}
      <form
        action={async (formData) => { await createTopicForGrade(formData); }}
        className="rounded-[1.25rem] border border-primary/20 bg-primary/5 p-5 flex flex-col sm:flex-row items-end gap-4 shadow-sm"
      >
        <input type="hidden" name="grade_slug" value={activeGrade} />
        <div className="flex-1 w-full">
          <label className="text-xs font-black uppercase tracking-widest text-primary/70 mb-2 block">
            Yeni Konu Ekle
          </label>
          <input
            name="name"
            required
            placeholder="Örn: Limit ve Süreklilik, Kümeler..."
            className="w-full h-11 px-4 rounded-xl border border-primary/20 bg-background text-foreground text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <SubmitButton
          className="h-11 px-6 bg-primary text-primary-foreground rounded-xl font-heading font-bold text-sm shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Konu Ekle
        </SubmitButton>
      </form>

      {/* Konu Listesi */}
      {gradeTopics.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-border bg-card/30 p-16 text-center text-muted-foreground flex flex-col items-center">
          <BookOpen className="w-12 h-12 mb-4 opacity-30" />
          <p className="font-heading font-bold text-foreground text-lg">Bu sınıfa henüz konu eklenmemiş.</p>
          <p className="text-sm mt-1">Sisteme hemen bir konu oluşturarak ders materyalleri kurgulamaya başlayın.</p>
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm px-6 pb-6 pt-6 space-y-4">
          {gradeTopics.map((topic, index) => {
            const topicContents = contents.filter((c) => c.topic_id === topic.id);
            const isTopicExpanded = expandedTopics.includes(topic.id);
            const isFirst = index === 0;
            const isLast = index === gradeTopics.length - 1;

            return (
              <div
                key={topic.id}
                className="rounded-[1rem] border border-border/50 bg-background/80 overflow-hidden shadow-sm transition-all hover:border-primary/20"
              >
                {/* Konu Header */}
                <div 
                  className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={(e) => toggleTopic(topic.id, e)}
                >
                  <button
                    type="button"
                    className="p-0.5 rounded transition-colors pointer-events-none text-muted-foreground"
                  >
                    {isTopicExpanded ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center font-heading font-black text-secondary text-xs shrink-0">
                    {index + 1}
                  </div>
                  <span className="font-heading font-bold text-[15px] text-foreground flex-1">
                    {topic.name}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground bg-muted rounded-full px-2.5 py-0.5 mr-3">
                    {topicContents.length} materyal
                  </span>

                  {/* Ordering Buttons */}
                  <div className="flex items-center gap-1 border-r border-border/50 pr-3 mr-1" onClick={e => e.stopPropagation()}>
                    <form action={moveTopic}>
                       <input type="hidden" name="id" value={topic.id} />
                       <input type="hidden" name="direction" value="up" />
                       <SubmitButton 
                         loadingText="" 
                         className={`p-1.5 rounded transition-colors ${
                           isFirst ? 'opacity-30 cursor-not-allowed text-muted-foreground' : 'text-foreground hover:bg-primary/20 hover:text-primary cursor-pointer'
                         }`}
                       >
                         <ArrowUp className="w-4 h-4" />
                       </SubmitButton>
                    </form>
                    <form action={moveTopic}>
                       <input type="hidden" name="id" value={topic.id} />
                       <input type="hidden" name="direction" value="down" />
                       <SubmitButton 
                         loadingText="" 
                         className={`p-1.5 rounded transition-colors ${
                           isLast ? 'opacity-30 cursor-not-allowed text-muted-foreground' : 'text-foreground hover:bg-primary/20 hover:text-primary cursor-pointer'
                         }`}
                       >
                         <ArrowDown className="w-4 h-4" />
                       </SubmitButton>
                    </form>
                  </div>

                  {/* Konu Sil Butonu */}
                  <form 
                    action={deleteTopic}
                    onClick={(e) => e.stopPropagation()}
                    className="pl-1"
                  >
                    <input type="hidden" name="id" value={topic.id} />
                    <SubmitButton
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors relative z-10"
                      loadingText=""
                    >
                      <Trash2 className="w-4 h-4" />
                    </SubmitButton>
                  </form>
                </div>

                {/* Materyaller Listesi */}
                {isTopicExpanded && (
                  <div className="px-5 pb-5 pt-2 space-y-3 bg-muted/10 border-t border-border/30 cursor-default">
                    {topicContents.map((content) => (
                      <ContentCard
                        key={content.id}
                        item={content}
                        isEditing={editingContent === content.id}
                        onEdit={() => setEditingContent(content.id)}
                        onCancel={() => setEditingContent(null)}
                      />
                    ))}

                    {/* İçerik Ekle Formu Göster/Gizle */}
                    {addingContentTo === topic.id ? (
                      <ContentForm
                        topicId={topic.id}
                        onCancel={() => setAddingContentTo(null)}
                        onSuccess={() => setAddingContentTo(null)}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAddingContentTo(topic.id)}
                        className="w-full h-11 rounded-xl border border-dashed border-secondary/40 bg-secondary/5 text-secondary font-bold text-sm hover:bg-secondary/10 transition-colors flex items-center justify-center gap-2 mt-2"
                      >
                        <Plus className="w-4 h-4" />
                        Ders Materyali Ekle (Video / Doküman / Uygulama)
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===================== İçerik Kartı =====================
function ContentCard({
  item,
  isEditing,
  onEdit,
  onCancel,
}: {
  item: Content;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
}) {
  if (isEditing) {
    return (
      <ContentForm
        topicId={item.topic_id}
        content={item}
        onCancel={onCancel}
        onSuccess={onCancel}
      />
    );
  }

  return (
    <div className="rounded-xl border border-border/30 bg-card/40 p-3.5 flex items-start gap-3 group hover:bg-muted/20 transition-colors">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.is_published ? "bg-primary/10" : "bg-muted"}`}>
        <Video className={`w-4 h-4 ${item.is_published ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-heading font-bold text-sm text-foreground truncate">
            {item.title}
          </p>
          {!item.is_published && (
            <span className="text-[8px] font-black uppercase tracking-wider bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 px-1.5 py-0.5 rounded-full flex-shrink-0">
              Taslak
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium mt-1">
          {item.video_url && (
            <span className="flex items-center gap-1">
              <Video className="w-3 h-3 text-red-500" /> Video
            </span>
          )}
          {item.drive_file_url && (
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3 text-blue-500" /> PDF
            </span>
          )}
          {item.app_url && (
            <span className="flex items-center gap-1">
              <AppWindow className="w-3 h-3 text-violet-500" /> Uygulama
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onEdit}
          className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <form action={deleteContent}>
          <input type="hidden" name="id" value={item.id} />
          <SubmitButton
            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center"
            loadingText=""
          >
            <Trash2 className="w-3.5 h-3.5" />
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}

// ===================== İçerik Ekleme / Düzenleme Formu =====================
function ContentForm({
  topicId,
  content,
  onCancel,
  onSuccess,
}: {
  topicId: string;
  content?: Content;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!content;

  // We wrap the server action so we can close the form on success
  const handleAction = async (formData: FormData) => {
    if (isEdit) {
      await updateContent(formData);
    } else {
      await createContent(formData);
    }
    // Form is submitted, UI resets via revalidatePath, but client needs explicit close call
    onSuccess();
  };

  return (
    <form
      action={handleAction}
      className="rounded-xl border border-secondary/20 bg-secondary/5 p-4 space-y-3 mt-2"
    >
      {isEdit && <input type="hidden" name="id" value={content.id} />}
      <input type="hidden" name="topic_id" value={topicId} />

      <div className="flex items-center justify-between">
        <p className="font-heading font-black text-sm text-foreground">
          {isEdit ? "İçeriği Düzenle" : "Yeni İçerik Ekle"}
        </p>
        <button type="button" onClick={onCancel} className="p-1 rounded hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Başlık */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">
          Başlık *
        </label>
        <input
          name="title"
          required
          defaultValue={content?.title}
          placeholder="Örn: 1. Ders: Küme Nedir?"
          className="w-full h-10 px-3 rounded-lg border border-border bg-input/50 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Video URL */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
          <Video className="w-3 h-3" /> YouTube Video Linki
        </label>
        <input
          name="video_url"
          defaultValue={content?.video_url ?? ""}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full h-10 px-3 rounded-lg border border-border bg-input/50 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Drive PDF */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
          <FileText className="w-3 h-3" /> Google Drive Dosya Linki
        </label>
        <input
          name="drive_file_url"
          defaultValue={content?.drive_file_url ?? ""}
          placeholder="https://drive.google.com/file/d/..."
          className="w-full h-10 px-3 rounded-lg border border-border bg-input/50 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Uygulama URL */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
          <AppWindow className="w-3 h-3" /> Uygulama Linki (GeoGebra vb.)
        </label>
        <input
          name="app_url"
          defaultValue={content?.app_url ?? ""}
          placeholder="https://www.geogebra.org/m/..."
          className="w-full h-10 px-3 rounded-lg border border-border bg-input/50 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Yayın Durumu + Kaydet */}
      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={content?.is_published ?? true}
            className="w-4 h-4 rounded accent-primary"
          />
          <span className="text-xs font-bold text-foreground flex items-center gap-1">
            <Eye className="w-3 h-3" /> Yayında
          </span>
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-9 px-4 text-sm font-bold text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            İptal
          </button>
          <SubmitButton
            className="h-9 px-5 bg-primary text-primary-foreground rounded-lg font-bold text-sm shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1.5"
            loadingText="Kaydediliyor..."
          >
            <Save className="w-3.5 h-3.5" />
            {isEdit ? "Güncelle" : "Kaydet"}
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
