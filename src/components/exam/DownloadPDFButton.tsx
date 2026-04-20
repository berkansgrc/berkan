"use client";

import { generateResultPDF } from "@/lib/pdf";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type Props = {
  studentName: string;
  examTitle: string;
  date: string;
  durationMinutes: number;
  correct: number;
  wrong: number;
  blank: number;
  score: number;
  questions: {
    orderIndex: number;
    body: string;
    selectedOption: string | null;
    correctOption: string;
    isCorrect: boolean;
  }[];
};

export default function DownloadPDFButton(props: Props) {
  const handleDownload = async () => {
    await generateResultPDF(props);
  };

  return (
    <Button onClick={handleDownload} variant="outline" className="gap-2">
      <Download className="h-4 w-4" />
      Raporu PDF İndir
    </Button>
  );
}
