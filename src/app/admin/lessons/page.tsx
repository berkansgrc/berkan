"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Plus, Trash2, Video, Users, Calendar, Clock, Search, School } from "lucide-react";

export default function AdminLessonsPage() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetUrl, setMeetUrl] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [targetGroup, setTargetGroup] = useState("");

  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ['adminLessons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("private_lessons")
        .select(`*, profiles(full_name)`)
        .order("start_time", { ascending: true });
      if (error) throw error;
      return data || [];
    }
  });

  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("role", "student")
        .order("full_name");
      if (error) throw error;
      return data || [];
    }
  });

  const loading = lessonsLoading || studentsLoading;

  const createLessonMutation = useMutation({
    mutationFn: async (newLesson: any) => {
      const res = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLesson),
      });
      if (!res.ok) throw new Error("Ders oluşturulamadı");
      return res.json();
    },
    onSuccess: () => {
      alert("Ders başarıyla planlandı!");
      queryClient.invalidateQueries({ queryKey: ['adminLessons'] });
      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      setMeetUrl("");
      setIsPrivate(false);
      setStudentIds([]);
      setTargetGroup("");
    },
    onError: (error: Error) => {
      alert(error.message);
    }
  });

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    createLessonMutation.mutate({
      title,
      description,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      meet_url: meetUrl,
      is_private: isPrivate,
      student_ids: studentIds,
      target_group: targetGroup || null,
    });
  };

  const deleteLessonMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/lessons?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silinirken hata oluştu");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminLessons'] });
    },
    onError: (error: Error) => {
      alert(error.message);
    }
  });

  const handleDelete = (id: string) => {
    if (!confirm("Dersi silmek istediğinize emin misiniz?")) return;
    deleteLessonMutation.mutate(id);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-heading font-black text-foreground flex items-center gap-2">
          <Video className="w-8 h-8 text-primary" />
          Özel Dersler & Google Meet
        </h1>
        <p className="text-muted-foreground mt-2">
          Birebir dersleri ve genel katılımlı grup derslerini buradan planlayabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Form Alanı */}
        <div className="xl:col-span-1">
          <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold font-heading flex items-center gap-2 border-b border-border/50 pb-4 mb-4">
              <Plus className="w-5 h-5 text-primary" />
              Yeni Ders Planla
            </h2>

            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold">Ders Başlığı</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: Limit ve Süreklilik Etüdü"
                  className="w-full bg-input/50 rounded-xl px-4 py-2 text-sm border border-border focus:border-primary outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold">Açıklama (Opsiyonel)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ders hakkında kısa bilgi..."
                  className="w-full bg-input/50 rounded-xl px-4 py-2 text-sm border border-border focus:border-primary outline-none transition-colors max-h-32"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold">Başlangıç</label>
                  <input
                    required
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-input/50 rounded-xl px-3 py-2 text-sm border border-border focus:border-primary outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold">Bitiş</label>
                  <input
                    required
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-input/50 rounded-xl px-3 py-2 text-sm border border-border focus:border-primary outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold">Google Meet Linki</label>
                <input
                  required
                  type="url"
                  value={meetUrl}
                  onChange={(e) => setMeetUrl(e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full bg-input/50 rounded-xl px-4 py-2 text-sm border border-border focus:border-primary outline-none transition-colors"
                />
              </div>

              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
                <p className="text-[11px] uppercase tracking-wider font-bold text-primary mb-2">
                  Ders Türü & Katılımcılar
                </p>
                
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                  />
                  <label htmlFor="isPrivate" className="text-sm font-bold">Özel Ders (Sadece seçili öğrenciler katılabilir)</label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Öğrenci Seçimi {isPrivate ? '(Zorunlu)' : '(İsteğe Bağlı)'}</label>
                  <div className="max-h-40 overflow-y-auto bg-background rounded-lg border border-border p-2 space-y-1">
                    {students.map((s) => (
                      <label key={s.id} className="flex items-center gap-2 text-sm p-1 hover:bg-muted/50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          value={s.id}
                          checked={studentIds.includes(s.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setStudentIds([...studentIds, s.id]);
                            } else {
                              setStudentIds(studentIds.filter(id => id !== s.id));
                            }
                          }}
                        />
                        {s.full_name}
                      </label>
                    ))}
                    {students.length === 0 && <div className="text-xs text-muted-foreground p-2">Öğrenci bulunamadı.</div>}
                  </div>
                </div>

                {(!isPrivate && studentIds.length === 0) && (
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-bold text-muted-foreground">Hedef Kitle (Opsiyonel)</label>
                    <input
                      value={targetGroup}
                      onChange={(e) => setTargetGroup(e.target.value)}
                      placeholder="Örn: YKS 25, 12. Sınıflar"
                      className="w-full bg-background rounded-lg px-3 py-2 text-sm border border-border focus:border-primary outline-none"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={createLessonMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 mt-4 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                {createLessonMutation.isPending ? "Planlanıyor..." : "Dersi Oluştur"}
              </button>
            </form>
          </div>
        </div>

        {/* Liste Alanı */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-xl font-bold font-heading mb-4 px-2">Planlanmış Dersler</h2>
          
          {loading ? (
            <div className="text-center p-10 text-muted-foreground animate-pulse">Yükleniyor...</div>
          ) : lessons.length === 0 ? (
            <div className="bg-muted/30 border border-dashed border-border rounded-2xl p-10 text-center flex flex-col items-center">
              <Calendar className="w-10 h-10 text-muted-foreground mb-4 opacity-50" />
              <p className="text-foreground font-bold text-lg">Hiç ders bulunmuyor</p>
              <p className="text-muted-foreground text-sm">Sol taraftaki formdan ilk dersi planlayın.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col sm:flex-row gap-5">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-primary/40 rounded-l-[1.5rem]" />
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-heading font-extrabold text-lg text-foreground">
                          {lesson.title}
                        </h3>
                        {lesson.student_id ? (
                          <span className="bg-blue-500/10 text-blue-500 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                            <Users className="w-3 h-3" /> Birebir
                          </span>
                        ) : (
                          <span className="bg-orange-500/10 text-orange-500 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                            <School className="w-3 h-3" /> Grup Dersi ({lesson.target_group || "Herkes"})
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                        {lesson.description || "Açıklama yok."}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-foreground/70 bg-input/40 inline-flex p-2 rounded-xl">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary" />
                        {new Date(lesson.start_time).toLocaleDateString("tr-TR", { weekday: 'long', day: 'numeric', month: 'long' })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-secondary" />
                        {new Date(lesson.start_time).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                        {" - "}
                        {new Date(lesson.end_time).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      {lesson.student_id && lesson.profiles && (
                        <div className="flex items-center gap-1.5 text-blue-500">
                          <Users className="w-4 h-4" />
                          {lesson.profiles.full_name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 sm:border-l border-border/50 pt-4 sm:pt-0 sm:pl-5">
                    <Link
                      href={`/dashboard/ozel-ders/${lesson.id}`}
                      className="bg-primary/10 hover:bg-primary/20 text-primary font-bold px-4 py-2 rounded-xl transition-colors text-sm flex items-center gap-2"
                    >
                      <Video className="w-4 h-4" /> Derse Gir
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sm:hidden">Sil</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
