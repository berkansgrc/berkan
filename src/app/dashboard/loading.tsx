export default function DashboardLoading() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full p-4 md:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="h-10 w-64 bg-muted rounded-2xl" />
          <div className="h-4 w-48 bg-muted rounded-full" />
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-[1.5rem] border border-border/50 bg-card/60 p-6 space-y-3">
              <div className="w-10 h-10 bg-muted rounded-[10px]" />
              <div className="h-3 w-20 bg-muted rounded-full" />
              <div className="h-7 w-12 bg-muted rounded-xl" />
            </div>
          ))}
        </div>
        {/* Content */}
        <div className="rounded-[1.5rem] border border-border/50 bg-card/60 h-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-[1.5rem] border border-border/50 bg-card/60 h-28" />
          ))}
        </div>
      </div>
    </div>
  );
}
