"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, Edit2, Loader2, CheckCircle2, Save, X } from "lucide-react";

interface ScheduleItem {
  id: string;
  day_name: string;
  lesson_time: string;
  topic: string;
  level: string;
  display_order: number;
}

export default function AdminLiveScheduleManager() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    day_name: "",
    lesson_time: "",
    topic: "",
    level: "TYT",
    display_order: 0
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/live-schedule");
      const data = await res.json();
      if (res.ok) {
        setItems(data);
      } else {
        setError("Veriler yüklenemedi.");
      }
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.day_name || !form.lesson_time || !form.topic) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...form, id: editingId } : form;

      const res = await fetch("/api/admin/live-schedule", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSuccess(editingId ? "Güncellendi!" : "Eklendi!");
        setForm({ day_name: "", lesson_time: "", topic: "", level: "TYT", display_order: items.length + 1 });
        setEditingId(null);
        fetchItems();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Bir hata oluştu.");
      }
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu dersi silmek istediğinize emin misiniz?")) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/live-schedule?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccess("Silindi!");
        fetchItems();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch {
      setError("Silme hatası.");
    } finally {
      setActionLoading(false);
    }
  };

  const startEdit = (item: ScheduleItem) => {
    setEditingId(item.id);
    setForm({
      day_name: item.day_name,
      lesson_time: item.lesson_time,
      topic: item.topic,
      level: item.level,
      display_order: item.display_order
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputClass = "w-full h-11 bg-input/50 border border-border/60 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 text-sm transition-all outline-none font-medium text-foreground placeholder:text-muted-foreground/60";

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-7 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary shrink-0" />
            <h2 className="font-heading font-black text-xl text-foreground">
              {editingId ? "Dersi Düzenle" : "Yeni Ders Ekle"}
            </h2>
          </div>
          {editingId && (
            <button 
              onClick={() => { setEditingId(null); setForm({ day_name: "", lesson_time: "", topic: "", level: "TYT", display_order: items.length }); }}
              className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 self-start sm:self-auto"
            >
              <X className="w-3 h-3" /> İptal
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-foreground">Gün</label>
            <input
              className={inputClass}
              value={form.day_name}
              onChange={(e) => setForm({ ...form, day_name: e.target.value })}
              placeholder="Örn: Pazartesi"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-foreground">Saat</label>
            <input
              className={inputClass}
              value={form.lesson_time}
              onChange={(e) => setForm({ ...form, lesson_time: e.target.value })}
              placeholder="Örn: 19:30"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-foreground">Konu</label>
            <input
              className={inputClass}
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              placeholder="Örn: Logaritma Giriş"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-foreground">Seviye / Etiket</label>
            <select
              className={inputClass}
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
            >
              <option value="5. Sınıf">5. Sınıf</option>
              <option value="6. Sınıf">6. Sınıf</option>
              <option value="7. Sınıf">7. Sınıf</option>
              <option value="8. Sınıf">8. Sınıf</option>
              <option value="LGS">LGS</option>
              <option value="9. Sınıf">9. Sınıf</option>
              <option value="10. Sınıf">10. Sınıf</option>
              <option value="11. Sınıf">11. Sınıf</option>
              <option value="12. Sınıf">12. Sınıf</option>
              <option value="TYT">TYT</option>
              <option value="AYT">AYT</option>
              <option value="Mezun">Mezun</option>
              <option value="Geometri">Geometri</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={actionLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-heading font-bold text-sm py-3.5 rounded-xl shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all disabled:opacity-60"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingId ? "Güncelle" : "Programa Ekle"}
            </button>
        </div>

        {error && <p className="text-xs font-bold text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}
        {success && <p className="text-xs font-bold text-primary bg-primary/10 p-3 rounded-lg flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {success}</p>}
      </div>

      {/* List Section */}
      <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-7 shadow-sm">
        <h3 className="font-heading font-black text-lg text-foreground mb-6">Mevcut Takvim</h3>
        
        {loading ? (
          <div className="py-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary/40" /></div>
        ) : items.length === 0 ? (
          <p className="text-center py-10 text-muted-foreground font-medium italic">Henüz ders eklenmemiş.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border/40 hover:border-primary/30 transition-all group gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-tighter bg-primary/10 text-primary px-2 py-0.5 rounded-full whitespace-nowrap">
                      {item.level}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">{item.day_name} • {item.lesson_time}</span>
                  </div>
                  <p className="font-bold text-foreground break-words">{item.topic}</p>
                </div>
                <div className="flex items-center gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity self-end sm:self-auto shrink-0">
                  <button 
                    onClick={() => startEdit(item)}
                    className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="w-9 h-9 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
