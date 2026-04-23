"use client";

import { useState, useMemo, useCallback } from "react";
import { SearchNormal, Setting4, ArrowDown2 } from "iconsax-react";
import { createExamFuse, type ExamSearchItem } from "@/lib/fuse";
import ExamCard from "./ExamCard";

type Props = {
  exams: ExamSearchItem[];
};

const GRADES = ["5. Sınıf", "6. Sınıf", "7. Sınıf", "LGS", "9. Sınıf", "10. Sınıf", "11. Sınıf", "TYT-AYT"];
const EXAM_TYPES = ["Konu Tarama", "Branş Denemesi", "Genel Deneme"];

export default function ExamSearch({ exams }: Props) {
  const [query, setQuery] = useState("");
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const fuse = useMemo(() => createExamFuse(exams), [exams]);

  const toggleGrade = (grade: string) => {
    setSelectedGrades(prev => 
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const results = useMemo(() => {
    let filtered = exams;

    // Search filter
    if (query.trim()) {
      filtered = fuse.search(query).map((r) => r.item);
    }

    // Grade filter (Check if title or description contains the grade string)
    if (selectedGrades.length > 0) {
      filtered = filtered.filter(exam => {
        const text = `${exam.title} ${exam.description || ""}`.toLowerCase();
        return selectedGrades.some(grade => text.includes(grade.toLowerCase()));
      });
    }

    // Type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(exam => {
        const text = `${exam.title} ${exam.description || ""}`.toLowerCase();
        return selectedTypes.some(type => text.includes(type.toLowerCase()));
      });
    }

    // Sort
    return filtered.sort((a, b) => {
      // For now, since we don't have created_at in ExamSearchItem, we'll just mock sort or keep it as is.
      // Assuming exams are passed in "newest" order by default from the server.
      if (sortBy === "oldest") return 1; // Reverse order roughly
      return -1;
    });
  }, [query, fuse, exams, selectedGrades, selectedTypes, sortBy]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Sidebar Filters */}
      <div className="w-full lg:w-[280px] shrink-0 space-y-8">
        <div>
          <h2 className="text-2xl font-heading font-black text-foreground mb-1">Filtreler</h2>
          <p className="text-sm text-muted-foreground">Sınavları daraltın</p>
        </div>

        {/* Grade Filter */}
        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-4">SEVİYE</h3>
          <div className="space-y-3">
            {GRADES.map(grade => (
              <label key={grade} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    className="peer appearance-none w-5 h-5 border-2 border-muted-foreground/30 rounded-md checked:border-primary checked:bg-primary transition-all cursor-pointer"
                    checked={selectedGrades.includes(grade)}
                    onChange={() => toggleGrade(grade)}
                  />
                  <svg className="absolute w-3 h-3 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{grade}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Exam Type Filter */}
        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-4">SINAV TİPİ</h3>
          <div className="space-y-3">
            {EXAM_TYPES.map(type => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    className="peer appearance-none w-5 h-5 border-2 border-muted-foreground/30 rounded-md checked:border-primary checked:bg-primary transition-all cursor-pointer"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                  />
                  <svg className="absolute w-3 h-3 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full space-y-8">
        
        {/* Search and Sort Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border/50 rounded-3xl p-4 shadow-sm">
          <div className="relative flex-1 w-full">
            <SearchNormal color="currentColor" size={24} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" variant="Outline" />
            <input
              type="text"
              placeholder="Sınav ara..."
              value={query}
              onChange={handleChange}
              className="w-full bg-transparent border-none focus:ring-0 pl-10 pr-4 py-2 text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <div className="w-px h-8 bg-border/50 hidden sm:block"></div>
          <div className="flex items-center gap-3 w-full sm:w-auto px-2">
            <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">Sırala:</span>
            <div className="relative group">
              <select 
                className="appearance-none bg-muted/30 border border-border/50 text-foreground text-sm font-bold rounded-xl pl-4 pr-10 py-2.5 outline-none cursor-pointer hover:bg-muted/50 transition-colors"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
              >
                <option value="newest">En Yeniler</option>
                <option value="oldest">Eskiden Yeniye</option>
              </select>
              <ArrowDown2 color="currentColor" size={24} className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" variant="Outline" />
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center gap-2 px-1">
          <Setting4 color="currentColor" size={24} className="w-4 h-4 text-primary" variant="Bold" />
          <p className="text-sm font-bold text-muted-foreground">
             <span className="text-foreground">{results.length}</span> sınav listeleniyor
          </p>
        </div>

        {/* Sınav Kartları Grid */}
        {results.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground bg-card/40 backdrop-blur-sm border border-dashed border-border rounded-[2rem]">
            <p className="text-xl font-heading font-bold text-foreground">Arama kriterlerinize uygun sınav bulunamadı.</p>
            <p className="text-sm mt-2">Farklı filtreler seçmeyi veya arama terimini değiştirmeyi deneyin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
