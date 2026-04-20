import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular | Berkan Matematik",
  description: "Berkan Matematik hakkında en çok sorulan sorular ve yanıtları.",
};

export default function SSSLayout({ children }: { children: React.ReactNode }) {
  return children;
}
