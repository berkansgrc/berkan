// Global loading skeleton for admin panel
export default function AdminLoading() {
  return (
    <div className="p-6 lg:p-10 space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-32 bg-muted rounded-full" />
        <div className="h-10 w-72 bg-muted rounded-2xl" />
        <div className="h-4 w-48 bg-muted rounded-full" />
      </div>
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-[1.5rem] border border-border/50 bg-card/60 p-6 space-y-4">
            <div className="w-10 h-10 bg-muted rounded-[10px]" />
            <div className="h-3 w-24 bg-muted rounded-full" />
            <div className="h-8 w-16 bg-muted rounded-xl" />
            <div className="h-3 w-20 bg-muted rounded-full" />
          </div>
        ))}
      </div>
      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 rounded-[1.5rem] border border-border/50 bg-card/60 h-64" />
        <div className="lg:col-span-2 rounded-[1.5rem] border border-border/50 bg-card/60 h-64" />
      </div>
    </div>
  );
}
