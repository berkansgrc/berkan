"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, XCircle, AlertCircle, ChevronRight, Loader2, RefreshCcw } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface QuizQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
  explanation: string | null;
}

interface StudentQuizModalProps {
  contentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentQuizModal({ contentId, isOpen, onClose }: StudentQuizModalProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      fetchQuestions();
    } else {
      resetQuiz();
    }
  }, [isOpen, contentId]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("content_quizzes")
        .select("*")
        .eq("content_id", contentId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setQuestions(data || []);
    } catch (err: any) {
      console.error(err);
      setError("Sorular yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === questions[currentIndex].correct_option_index) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-3xl border border-border/50 shadow-2xl flex flex-col"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border/50 bg-card/80 backdrop-blur-md">
              <h3 className="font-heading font-extrabold text-lg flex items-center gap-2">
                🎓 Mini Test
              </h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                  <p className="font-medium">Sorular yükleniyor...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-destructive">
                  <AlertCircle className="w-8 h-8 mb-4" />
                  <p className="font-medium">{error}</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <p className="font-medium">Bu içeriğe henüz test eklenmemiş.</p>
                </div>
              ) : isFinished ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <span className="text-4xl font-black text-primary">{Math.round((score / questions.length) * 100)}</span>
                  </div>
                  <h4 className="text-2xl font-heading font-black mb-2">Test Tamamlandı!</h4>
                  <p className="text-muted-foreground mb-8">
                    {questions.length} sorudan <strong className="text-foreground">{score}</strong> tanesini doğru bildin.
                  </p>
                  <div className="flex gap-4">
                    <button onClick={resetQuiz} className="px-6 py-3 rounded-xl bg-muted text-foreground font-bold hover:bg-muted/80 transition-colors flex items-center gap-2">
                      <RefreshCcw className="w-4 h-4" /> Tekrar Çöz
                    </button>
                    <button onClick={onClose} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Bitir
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-8">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <span>Soru {currentIndex + 1} / {questions.length}</span>
                      <span>Doğru: {score}</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <div>
                    <div className="prose prose-base dark:prose-invert max-w-none text-foreground font-medium mb-6">
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {questions[currentIndex].question_text}
                      </ReactMarkdown>
                    </div>

                    <div className="space-y-3">
                      {questions[currentIndex].options.map((option, idx) => {
                        const isSelected = selectedOption === idx;
                        const isCorrect = idx === questions[currentIndex].correct_option_index;
                        
                        let optionStateClass = "bg-card border-border/50 hover:border-primary/50 hover:bg-primary/5 text-foreground";
                        if (isAnswered) {
                          if (isCorrect) {
                            optionStateClass = "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400";
                          } else if (isSelected && !isCorrect) {
                            optionStateClass = "bg-red-500/10 border-red-500/50 text-red-700 dark:text-red-400";
                          } else {
                            optionStateClass = "bg-muted/30 border-transparent text-muted-foreground opacity-50";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(idx)}
                            disabled={isAnswered}
                            className={`w-full text-left p-4 rounded-2xl border transition-all ${optionStateClass} flex items-start gap-4`}
                          >
                            <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold border ${isAnswered && isCorrect ? 'bg-green-500 border-green-600 text-white' : isAnswered && isSelected && !isCorrect ? 'bg-red-500 border-red-600 text-white' : 'border-muted-foreground/30 text-muted-foreground'}`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="flex-1 mt-0.5">{option}</span>
                            {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
                            {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explanation */}
                  <AnimatePresence>
                    {isAnswered && questions[currentIndex].explanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-300">
                          <h5 className="font-bold mb-1 text-sm flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> Açıklama</h5>
                          <div className="text-sm prose prose-sm dark:prose-invert">
                             <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                               {questions[currentIndex].explanation!}
                             </ReactMarkdown>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Next Button */}
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-4 flex justify-end"
                    >
                      <button
                        onClick={handleNext}
                        className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                      >
                        {currentIndex < questions.length - 1 ? "Sıradaki Soru" : "Sonuçları Gör"}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
