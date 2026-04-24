"use client";

import { useState, useCallback, useMemo } from "react";
import { HierarchySquare, Math as MathIcon } from "iconsax-react";

/* ── Konu Verileri ── */
interface TopicNode {
  id: string;
  label: string;
  shortLabel: string;
  x: number; // % cinsinden
  y: number; // % cinsinden
  color: string;
  glowColor: string;
  category: "temel" | "analiz" | "geometri" | "ileri";
}

interface TopicEdge {
  from: string;
  to: string;
}

const NODES: TopicNode[] = [
  { id: "sayi",      label: "Sayılar ve İşlemler",   shortLabel: "Sayılar",      x: 15, y: 30, color: "var(--primary)",   glowColor: "rgba(0,103,98,0.4)",   category: "temel" },
  { id: "cebir",     label: "Cebirsel İfadeler",      shortLabel: "Cebir",        x: 35, y: 15, color: "var(--primary)",   glowColor: "rgba(0,103,98,0.4)",   category: "temel" },
  { id: "denklem",   label: "Denklemler",              shortLabel: "Denklem",      x: 55, y: 22, color: "#3b82f6",          glowColor: "rgba(59,130,246,0.4)", category: "analiz" },
  { id: "esitsizlik",label: "Eşitsizlikler",           shortLabel: "Eşitsizlik",   x: 75, y: 12, color: "#3b82f6",          glowColor: "rgba(59,130,246,0.4)", category: "analiz" },
  { id: "fonksiyon", label: "Fonksiyonlar",             shortLabel: "Fonksiyon",    x: 50, y: 50, color: "#8b5cf6",          glowColor: "rgba(139,92,246,0.4)", category: "ileri" },
  { id: "logaritma", label: "Logaritma",                shortLabel: "Log",          x: 30, y: 60, color: "#8b5cf6",          glowColor: "rgba(139,92,246,0.4)", category: "ileri" },
  { id: "uslu",      label: "Üslü Sayılar",            shortLabel: "Üslü",         x: 15, y: 55, color: "var(--primary)",   glowColor: "rgba(0,103,98,0.4)",   category: "temel" },
  { id: "turev",     label: "Türev",                    shortLabel: "Türev",        x: 70, y: 48, color: "#f59e0b",          glowColor: "rgba(245,158,11,0.4)", category: "ileri" },
  { id: "integral",  label: "İntegral",                 shortLabel: "İntegral",     x: 85, y: 60, color: "#f59e0b",          glowColor: "rgba(245,158,11,0.4)", category: "ileri" },
  { id: "ucgen",     label: "Üçgenler",                 shortLabel: "Üçgen",        x: 20, y: 82, color: "#10b981",          glowColor: "rgba(16,185,129,0.4)", category: "geometri" },
  { id: "cember",    label: "Çember ve Daire",          shortLabel: "Çember",       x: 45, y: 80, color: "#10b981",          glowColor: "rgba(16,185,129,0.4)", category: "geometri" },
  { id: "analitik",  label: "Analitik Geometri",        shortLabel: "Analitik",     x: 70, y: 78, color: "#10b981",          glowColor: "rgba(16,185,129,0.4)", category: "geometri" },
  { id: "limit",     label: "Limit ve Süreklilik",      shortLabel: "Limit",        x: 85, y: 35, color: "#f59e0b",          glowColor: "rgba(245,158,11,0.4)", category: "ileri" },
];

const EDGES: TopicEdge[] = [
  // Temel → Analiz akışı
  { from: "sayi",      to: "cebir" },
  { from: "sayi",      to: "uslu" },
  { from: "cebir",     to: "denklem" },
  { from: "denklem",   to: "esitsizlik" },
  { from: "denklem",   to: "fonksiyon" },
  // Üslü → Logaritma doğal bağ
  { from: "uslu",      to: "logaritma" },
  { from: "logaritma", to: "fonksiyon" },
  // Fonksiyon merkez
  { from: "fonksiyon", to: "turev" },
  { from: "fonksiyon", to: "limit" },
  { from: "fonksiyon", to: "analitik" },
  { from: "limit",     to: "turev" },
  { from: "turev",     to: "integral" },
  // Geometri dalı
  { from: "ucgen",     to: "cember" },
  { from: "cember",    to: "analitik" },
  { from: "analitik",  to: "turev" },
  { from: "esitsizlik",to: "fonksiyon" },
];

const CATEGORY_LABELS: Record<string, string> = {
  temel: "Temel",
  analiz: "Analiz",
  geometri: "Geometri",
  ileri: "İleri",
};
const CATEGORY_COLORS: Record<string, string> = {
  temel: "var(--primary)",
  analiz: "#3b82f6",
  geometri: "#10b981",
  ileri: "#f59e0b",
};

/* ── Bileşen ── */
export default function TopicNetwork() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Aktif node'a bağlı edge ve node'ları hesapla
  const { connectedNodes, connectedEdges } = useMemo(() => {
    if (!activeNode) return { connectedNodes: new Set<string>(), connectedEdges: new Set<number>() };

    const nodes = new Set<string>();
    const edges = new Set<number>();

    EDGES.forEach((edge, idx) => {
      if (edge.from === activeNode || edge.to === activeNode) {
        nodes.add(edge.from);
        nodes.add(edge.to);
        edges.add(idx);
      }
    });
    nodes.add(activeNode);
    return { connectedNodes: nodes, connectedEdges: edges };
  }, [activeNode]);

  const handleNodeClick = useCallback((id: string) => {
    setActiveNode((prev) => (prev === id ? null : id));
  }, []);

  // Aktif node objesini bul
  const activeNodeData = NODES.find((n) => n.id === activeNode);

  return (
    <section className="py-20 mb-32 relative w-full">
      {/* Başlık */}
      <div className="text-center mb-16 space-y-6 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/40 text-secondary-foreground rounded-full text-xs font-black tracking-widest uppercase">
          <HierarchySquare size={16} variant="TwoTone" />
          Bağlantı Haritası
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight text-foreground">
          Matematik Bir Doğru Değil,{" "}
          <span className="italic text-primary">Bir Ağdır.</span>
        </h2>
        <p className="text-foreground/60 text-lg md:text-xl max-w-3xl mx-auto font-medium">
          Konuları birbirinden kopuk adalar gibi görmeyi bırak. Her kavram, bir
          sonrakine giden gizli bir köprüdür. Bir konuya dokun ve bağlantıları keşfet.
        </p>
      </div>

      {/* Kategori Göstergesi */}
      <div className="flex flex-wrap justify-center gap-4 mb-10 px-4">
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2 text-sm font-bold text-foreground/70">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[key] }}
            />
            {label}
          </div>
        ))}
      </div>

      {/* İnteraktif Ağ */}
      <div className="relative w-full max-w-5xl mx-auto px-4">
        <div className="glass-card rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden">
          {/* Dekoratif bloblar */}
          <div className="absolute top-[-15%] left-[-10%] w-72 h-72 bg-primary/10 organic-blob animate-spin-slow blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-56 h-56 bg-secondary/15 organic-blob animate-spin-slow blur-2xl pointer-events-none" />

          {/* SVG Ağ Grafiği */}
          <div className="relative w-full" style={{ paddingBottom: "60%" }}>
            <svg
              viewBox="0 0 1000 600"
              className="absolute inset-0 w-full h-full"
              style={{ overflow: "visible" }}
            >
              {/* Kenarlar (Edges) */}
              {EDGES.map((edge, idx) => {
                const fromNode = NODES.find((n) => n.id === edge.from)!;
                const toNode = NODES.find((n) => n.id === edge.to)!;
                const isHighlighted = connectedEdges.has(idx);
                const isDimmed = activeNode && !isHighlighted;

                return (
                  <line
                    key={`edge-${idx}`}
                    x1={fromNode.x * 10}
                    y1={fromNode.y * 6}
                    x2={toNode.x * 10}
                    y2={toNode.y * 6}
                    stroke={isHighlighted ? activeNodeData?.color ?? "var(--primary)" : "var(--foreground)"}
                    strokeWidth={isHighlighted ? 3 : 1.5}
                    strokeOpacity={isDimmed ? 0.08 : isHighlighted ? 0.7 : 0.15}
                    strokeDasharray={isHighlighted ? "none" : "6 4"}
                    className="transition-all duration-500"
                  />
                );
              })}

              {/* Glow efektleri – sadece aktif bağlantılar */}
              {activeNode &&
                EDGES.filter((_, idx) => connectedEdges.has(idx)).map((edge, idx) => {
                  const fromNode = NODES.find((n) => n.id === edge.from)!;
                  const toNode = NODES.find((n) => n.id === edge.to)!;
                  return (
                    <line
                      key={`glow-${idx}`}
                      x1={fromNode.x * 10}
                      y1={fromNode.y * 6}
                      x2={toNode.x * 10}
                      y2={toNode.y * 6}
                      stroke={activeNodeData?.color ?? "var(--primary)"}
                      strokeWidth={8}
                      strokeOpacity={0.15}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  );
                })}

              {/* Düğümler (Nodes) */}
              {NODES.map((node) => {
                const isActive = activeNode === node.id;
                const isConnected = connectedNodes.has(node.id);
                const isDimmed = activeNode && !isConnected;
                const radius = isActive ? 32 : isConnected ? 26 : 22;

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-all duration-500"
                    style={{
                      opacity: isDimmed ? 0.25 : 1,
                      filter: isActive
                        ? `drop-shadow(0 0 20px ${node.glowColor}) drop-shadow(0 0 40px ${node.glowColor})`
                        : isConnected
                        ? `drop-shadow(0 0 10px ${node.glowColor})`
                        : "none",
                    }}
                    onClick={() => handleNodeClick(node.id)}
                  >
                    {/* Outer ring – pulse on active */}
                    {isActive && (
                      <circle
                        cx={node.x * 10}
                        cy={node.y * 6}
                        r={radius + 8}
                        fill="none"
                        stroke={node.color}
                        strokeWidth={2}
                        strokeOpacity={0.3}
                        className="animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"
                      />
                    )}

                    {/* Main circle */}
                    <circle
                      cx={node.x * 10}
                      cy={node.y * 6}
                      r={radius}
                      fill="white"
                      fillOpacity={0.85}
                      stroke={node.color}
                      strokeWidth={isActive ? 4 : 2}
                      className="transition-all duration-300"
                    />

                    {/* Inner fill */}
                    <circle
                      cx={node.x * 10}
                      cy={node.y * 6}
                      r={radius - 4}
                      fill={node.color}
                      fillOpacity={isActive ? 0.2 : 0.08}
                      className="transition-all duration-300"
                    />

                    {/* Label */}
                    <text
                      x={node.x * 10}
                      y={node.y * 6 + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isDimmed ? "var(--foreground)" : node.color}
                      fontSize={isActive ? 13 : 11}
                      fontWeight={800}
                      className="transition-all duration-300 pointer-events-none select-none"
                    >
                      {node.shortLabel}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Alt Bilgi Kartı – Seçili konu detayı */}
          <div
            className="mt-6 overflow-hidden transition-all duration-500"
            style={{
              maxHeight: activeNode ? "200px" : "0px",
              opacity: activeNode ? 1 : 0,
            }}
          >
            {activeNodeData && (
              <div
                className="rounded-2xl p-6 border transition-all duration-500 backdrop-blur-md"
                style={{
                  backgroundColor: `color-mix(in srgb, ${activeNodeData.color} 8%, white 92%)`,
                  borderColor: `color-mix(in srgb, ${activeNodeData.color} 25%, transparent 75%)`,
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: activeNodeData.color }}
                    >
                      <MathIcon size={20} variant="TwoTone" />
                    </div>
                    <div>
                      <p className="font-black text-lg" style={{ color: activeNodeData.color }}>
                        {activeNodeData.label}
                      </p>
                      <p className="text-foreground/50 text-sm font-medium">
                        {CATEGORY_LABELS[activeNodeData.category]} kategorisi
                      </p>
                    </div>
                  </div>
                  <div className="md:ml-auto flex flex-wrap gap-2">
                    {EDGES.filter(
                      (e) => e.from === activeNode || e.to === activeNode
                    ).map((e, i) => {
                      const otherId = e.from === activeNode ? e.to : e.from;
                      const otherNode = NODES.find((n) => n.id === otherId)!;
                      return (
                        <button
                          key={i}
                          onClick={() => handleNodeClick(otherId)}
                          className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all hover:scale-105"
                          style={{
                            borderColor: otherNode.color,
                            color: otherNode.color,
                            backgroundColor: `color-mix(in srgb, ${otherNode.color} 8%, transparent 92%)`,
                          }}
                        >
                          → {otherNode.shortLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alt metin */}
      <p className="text-center text-foreground/50 text-sm mt-8 px-4 font-medium">
        Logaritma bilmeden türevi &quot;ezberleyebilirsin&quot;, ama bizimle logaritmanın türevin içinde nasıl nefes aldığını <span className="italic font-bold text-foreground/70">görürsün</span>.
      </p>
    </section>
  );
}
