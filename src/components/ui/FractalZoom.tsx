"use client";

import { useState, useCallback } from "react";
import { ArrowLeft2, Math as MathIcon } from "iconsax-react";

interface FractalNode {
  id: string;
  label: string;
  color: string;
  children?: FractalNode[];
}

const TREE: FractalNode = {
  id: "root", label: "MATEMATİK", color: "var(--primary)",
  children: [
    { id: "cebir", label: "Cebir", color: "#006762",
      children: [
        { id: "denklem", label: "Denklemler", color: "#008c85" },
        { id: "esitsizlik", label: "Eşitsizlikler", color: "#00a99d" },
        { id: "polinom", label: "Polinomlar", color: "#00c4b6" },
        { id: "matris", label: "Matrisler", color: "#33d4c9" },
      ],
    },
    { id: "geometri", label: "Geometri", color: "#10b981",
      children: [
        { id: "ucgen", label: "Üçgenler", color: "#34d399" },
        { id: "cember", label: "Çember", color: "#6ee7b7" },
        { id: "katicisin", label: "Katı Cisimler", color: "#a7f3d0" },
        { id: "analitik", label: "Analitik Geo.", color: "#059669" },
      ],
    },
    { id: "analiz", label: "Analiz", color: "#3b82f6",
      children: [
        { id: "fonksiyon", label: "Fonksiyonlar", color: "#60a5fa" },
        { id: "limit", label: "Limit", color: "#93c5fd" },
        { id: "turev", label: "Türev", color: "#2563eb" },
        { id: "integral", label: "İntegral", color: "#1d4ed8" },
      ],
    },
    { id: "olasilik", label: "Olasılık", color: "#f59e0b",
      children: [
        { id: "kombinatorik", label: "Kombinatorik", color: "#fbbf24" },
        { id: "permutasyon", label: "Permütasyon", color: "#f59e0b" },
        { id: "istatistik", label: "İstatistik", color: "#d97706" },
        { id: "dagilim", label: "Dağılımlar", color: "#b45309" },
      ],
    },
  ],
};

function getPositions(count: number, radius: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });
}

export default function FractalZoom() {
  const [path, setPath] = useState<string[]>(["root"]);

  const getCurrentNode = useCallback((): FractalNode => {
    let node = TREE;
    for (let i = 1; i < path.length; i++) {
      const child = node.children?.find((c) => c.id === path[i]);
      if (child) node = child;
    }
    return node;
  }, [path]);

  const currentNode = getCurrentNode();
  const hasChildren = !!currentNode.children?.length;
  const depth = path.length - 1;

  const findLabel = (node: FractalNode, targetId: string): string => {
    if (node.id === targetId) return node.label;
    for (const child of node.children || []) {
      const found = findLabel(child, targetId);
      if (found) return found;
    }
    return "";
  };

  const handleClick = (childId: string) => {
    const child = currentNode.children?.find((c) => c.id === childId);
    if (child?.children) setPath((prev) => [...prev, childId]);
  };

  const goBack = () => { if (path.length > 1) setPath((prev) => prev.slice(0, -1)); };

  const childPositions = hasChildren ? getPositions(currentNode.children!.length, 140) : [];

  return (
    <section className="py-20 mb-32 relative w-full">
      <div className="text-center mb-16 space-y-6 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black tracking-widest uppercase">
          <MathIcon size={16} variant="TwoTone" />
          Kavram Çözünürlüğü
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight text-foreground">
          Her Kavramın İçinde <span className="italic text-primary">Bir Evren</span> Gizli.
        </h2>
        <p className="text-foreground/60 text-lg md:text-xl max-w-3xl mx-auto font-medium">
          Matematiği sıkıcı bir liste olarak değil, keşfedilebilir bir fraktal olarak gör. Tıkla, yakınlaş, derinleş.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-15%] w-72 h-72 bg-primary/5 organic-blob animate-spin-slow blur-3xl pointer-events-none" />

          {depth > 0 && (
            <button onClick={goBack} className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-all text-sm font-bold">
              <ArrowLeft2 size={16} variant="TwoTone" /> Geri
            </button>
          )}

          <div className="flex items-center justify-center gap-2 mb-8 text-xs font-bold text-foreground/40 flex-wrap">
            {path.map((id, i) => {
              const label = id === "root" ? "Matematik" : findLabel(TREE, id);
              return (
                <span key={id} className="flex items-center gap-2">
                  {i > 0 && <span className="text-foreground/20">›</span>}
                  <span className={i === path.length - 1 ? "text-primary font-black" : ""}>{label}</span>
                </span>
              );
            })}
          </div>

          <div className="relative flex items-center justify-center" style={{ minHeight: "380px" }}>
            <div className="absolute z-10 flex items-center justify-center rounded-full transition-all duration-700 shadow-xl"
              style={{ width: hasChildren ? 100 : 140, height: hasChildren ? 100 : 140, backgroundColor: currentNode.color, boxShadow: `0 0 40px ${currentNode.color}30` }}>
              <span className="text-white font-black text-sm md:text-base text-center px-2 leading-tight">{currentNode.label}</span>
            </div>

            {hasChildren && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-200 -200 400 400">
                {childPositions.map((pos, i) => (
                  <line key={i} x1={0} y1={0} x2={pos.x} y2={pos.y} stroke={currentNode.children![i].color} strokeWidth={2} strokeOpacity={0.25} strokeDasharray="4 4" />
                ))}
              </svg>
            )}

            {hasChildren && currentNode.children!.map((child, i) => {
              const pos = childPositions[i];
              const hasGC = !!child.children?.length;
              return (
                <button key={child.id} onClick={() => handleClick(child.id)}
                  className="absolute z-10 flex items-center justify-center rounded-full transition-all duration-700 hover:scale-110 group"
                  style={{ width: 90, height: 90, transform: `translate(${pos.x}px, ${pos.y}px)`, backgroundColor: "white", border: `3px solid ${child.color}`, boxShadow: `0 8px 30px ${child.color}20`, cursor: hasGC ? "pointer" : "default" }}>
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-black text-xs text-center leading-tight px-1" style={{ color: child.color }}>{child.label}</span>
                    {hasGC && <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: child.color }}>Keşfet →</span>}
                  </div>
                  {hasGC && <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ border: `2px solid ${child.color}` }} />}
                </button>
              );
            })}
          </div>

          <p className="text-center text-foreground/40 text-sm mt-8 font-medium">
            {hasChildren ? "Bir kavrama tıkla ve içindeki evreni keşfet" : "Bu dalın en derin noktasına ulaştın!"}
          </p>
        </div>
      </div>
    </section>
  );
}
