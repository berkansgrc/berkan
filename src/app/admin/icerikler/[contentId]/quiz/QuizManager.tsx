"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  createQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  reorderQuizQuestions,
} from "./actions";
import {
  Plus,
  Trash2,
  Pencil,
  X,
  Save,
  Loader2,
  ArrowLeft,
  GripVertical
} from "lucide-react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface QuizQuestion {
  id: string;
  content_id: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
  explanation: string | null;
  sort_order: number;
}

function SubmitButton({ children, className, loadingText = "İşleniyor..." }: { children: React.ReactNode, className?: string, loadingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${className} ${pending ? "opacity-70 cursor-not-allowed" : ""}`}>
      {pending ? (
        <span className="flex items-center gap-1.5"><Loader2 className="w-4 h-4 animate-spin" /> {loadingText}</span>
      ) : children}
    </button>
  );
}

export default function QuizManager({ contentId, contentTitle, questions }: { contentId: string, contentTitle: string, questions: QuizQuestion[] }) {
  const [optimisticQuestions, setOptimisticQuestions] = useState(questions);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOptimisticQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        const payload = newItems.map((item, index) => ({
           id: item.id,
           sort_order: index + 1
        }));
        
        reorderQuizQuestions(contentId, payload).catch(console.error);
        return newItems;
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/icerikler"
          className="w-10 h-10 rounded-full bg-input/50 border border-border/50 flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-foreground">Mini Test Soruları</h2>
          <p className="text-sm text-muted-foreground font-medium">{contentTitle}</p>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm px-6 py-6 space-y-4">
        {optimisticQuestions.length === 0 && !isAdding && (
          <div className="text-center py-10 text-muted-foreground">
            <p className="font-heading font-bold text-lg mb-2">Bu içeriğe henüz soru eklenmemiş.</p>
            <p className="text-sm">Mini test oluşturmak için yeni soru ekleyin.</p>
          </div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={optimisticQuestions.map(q => q.id)} strategy={verticalListSortingStrategy}>
            {optimisticQuestions
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((question, index) => (
              <SortableQuestionCard
                key={question.id}
                index={index}
                question={question}
                contentId={contentId}
                isEditing={editingQuestion === question.id}
                onEdit={() => setEditingQuestion(question.id)}
                onCancel={() => setEditingQuestion(null)}
              />
            ))}
          </SortableContext>
        </DndContext>

        {isAdding ? (
          <QuestionForm contentId={contentId} onCancel={() => setIsAdding(false)} onSuccess={() => setIsAdding(false)} />
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full h-11 rounded-xl border border-dashed border-primary/40 bg-primary/5 text-primary font-bold text-sm hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <Plus className="w-4 h-4" /> Yeni Soru Ekle
          </button>
        )}
      </div>
    </div>
  );
}

function SortableQuestionCard(props: { question: QuizQuestion, contentId: string, index: number, isEditing: boolean, onEdit: () => void, onCancel: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: isDragging ? "relative" : "static",
    zIndex: isDragging ? 50 : "auto",
  } as React.CSSProperties;

  return (
    <div ref={setNodeRef} style={style}>
      <QuestionCard {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}

function QuestionCard({ question, contentId, index, isEditing, onEdit, onCancel, dragHandleProps }: any) {
  if (isEditing) {
    return <QuestionForm contentId={contentId} question={question} onCancel={onCancel} onSuccess={onCancel} />;
  }

  return (
    <div className="rounded-xl border border-border/30 bg-card/40 p-4 flex gap-4 group hover:bg-muted/20 transition-colors mb-3">
      <div {...dragHandleProps} className="mt-1 cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity">
         <GripVertical className="w-5 h-5 text-muted-foreground" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-heading font-bold text-base text-foreground mb-3 flex items-start gap-2">
           <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">Soru {index + 1}</span>
           {question.question_text}
        </h4>
        
        <div className="space-y-1.5 mb-3">
          {question.options.map((opt: string, i: number) => (
             <div key={i} className={`text-sm py-1.5 px-3 rounded-lg border ${i === question.correct_option_index ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400 font-medium' : 'bg-background border-border/50 text-muted-foreground'}`}>
               <span className="font-bold mr-2 opacity-50">{String.fromCharCode(65 + i)})</span> {opt}
             </div>
          ))}
        </div>

        {question.explanation && (
          <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/50 mt-2">
            <span className="font-bold text-foreground">Açıklama:</span> {question.explanation}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
          <Pencil className="w-4 h-4" />
        </button>
        <form action={async () => { await deleteQuizQuestion(contentId, question.id); }}>
          <SubmitButton className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center" loadingText="">
            <Trash2 className="w-4 h-4" />
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}

function QuestionForm({ contentId, question, onCancel, onSuccess }: any) {
  const isEdit = !!question;

  const handleAction = async (formData: FormData) => {
    if (isEdit) {
      await updateQuizQuestion(contentId, question.id, formData);
    } else {
      await createQuizQuestion(contentId, formData);
    }
    onSuccess();
  };

  return (
    <form action={handleAction} className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-4 mt-2 mb-4">
      <div className="flex items-center justify-between">
        <p className="font-heading font-black text-sm text-foreground">{isEdit ? "Soruyu Düzenle" : "Yeni Soru"}</p>
        <button type="button" onClick={onCancel} className="p-1 rounded hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Soru Metni * (Markdown destekler)</label>
        <textarea
          name="question_text"
          required
          defaultValue={question?.question_text}
          className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-border bg-input/50 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Seçenekler * (Her satıra bir tane)</label>
          <textarea
            name="options"
            required
            defaultValue={question ? question.options.join("\n") : ""}
            placeholder="Seçenek A&#10;Seçenek B&#10;Seçenek C&#10;Seçenek D"
            className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-border bg-input/50 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Doğru Seçenek Sırası * (0 = İlk Satır)</label>
          <select
            name="correct_option_index"
            required
            defaultValue={question?.correct_option_index ?? 0}
            className="w-full h-10 px-3 rounded-lg border border-border bg-input/50 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {[0, 1, 2, 3, 4].map(num => (
               <option key={num} value={num}>{num} ({String.fromCharCode(65 + num)})</option>
            ))}
          </select>

          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 mt-4 block">Açıklama / Çözüm (Opsiyonel)</label>
          <textarea
            name="explanation"
            defaultValue={question?.explanation ?? ""}
            className="w-full min-h-[60px] px-3 py-2 rounded-lg border border-border bg-input/50 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="h-9 px-4 text-sm font-bold text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">İptal</button>
        <SubmitButton className="h-9 px-5 bg-primary text-primary-foreground rounded-lg font-bold text-sm shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1.5" loadingText="Kaydediliyor...">
          <Save className="w-3.5 h-3.5" /> {isEdit ? "Güncelle" : "Kaydet"}
        </SubmitButton>
      </div>
    </form>
  );
}
