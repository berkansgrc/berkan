import Fuse from "fuse.js";

export type ExamSearchItem = {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  share_code: string | null;
  access_mode: "public" | "private";
};

export function createExamFuse(exams: ExamSearchItem[]) {
  return new Fuse(exams, {
    keys: ["title", "description"],
    threshold: 0.35,
    minMatchCharLength: 2,
    includeScore: true,
  });
}
