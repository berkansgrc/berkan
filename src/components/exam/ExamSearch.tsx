"use client";

import { useState, useMemo, useCallback } from "react";
import { Search } from "lucide-react";
import { createExamFuse, type ExamSearchItem } from "@/lib/fuse";
import ExamCard from "./ExamCard";

type Props = {
  exams: ExamSearchItem[];
};

export default function ExamSearch({ exams }: Props) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => createExamFuse(exams), [exams]);

  const results = useMemo(() => {
    if (!query.trim()) return exams;
    return fuse.search(query).map((r) => r.item);
  }, [query, fuse, exams]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  return (
    <div className="space-y-8">
      {/* Enhanced Search Input */}
      <div className="relative group max-w-2xl">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <div className="relative flex items-center w-full">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              placeholder="Sınav ara... (örn: türev, integral, LGS)"
              className="w-full pl-14 pr-6 py-4 bg-card/80 backdrop-blur-md border border-border/60 hover:border-border rounded-[1.25rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all text-foreground font-medium placeholder:text-muted-foreground/60 text-[15px]"
              value={query}
              onChange={handleChange}
            />
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-muted-foreground bg-input/40 px-4 py-1.5 rounded-full border border-border/50">
            {query.trim() ? (
                <>
                  <span className="font-bold text-primary">{results.length}</span> eşleşme bulundu
                </>
            ) : (
                <>
                  Toplam <span className="font-bold text-foreground">{results.length}</span> sınav listeleniyor
                </>
            )}
          </p>
      </div>

      {/* Sınav Kartları Grid */}
      {results.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground bg-card/40 backdrop-blur-sm border border-dashed border-border rounded-[2rem]">
          <p className="text-xl font-heading font-bold text-foreground">&ldquo;{query}&rdquo; için sonuç bulamadık.</p>
          <p className="text-base mt-2">Daha genel bir terim aramayı deneyebilirsin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
}
