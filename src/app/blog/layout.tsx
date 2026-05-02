export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary">
      {/* İnce ızgara (Grid) arka planı */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Ortada hafif parlama (Glow) efekti */}
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      
      <main className="relative z-10 container max-w-5xl mx-auto px-4 py-8 md:py-12 pb-24 md:pb-12">
        {children}
      </main>
    </div>
  );
}
