export default function CanliDersLoading() {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] animate-pulse">
      <div className="container max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="h-5 w-24 bg-muted rounded-full" />
          <div className="h-10 w-56 bg-muted rounded-2xl" />
          <div className="h-4 w-72 bg-muted rounded-full" />
        </div>
        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-[2rem] bg-muted aspect-video w-full" />
            <div className="rounded-[1.5rem] bg-card/60 border border-border/50 p-6 space-y-3">
              <div className="h-6 w-48 bg-muted rounded-xl" />
              <div className="h-4 w-full bg-muted rounded-full" />
              <div className="h-4 w-3/4 bg-muted rounded-full" />
            </div>
          </div>
          <div className="space-y-5">
            <div className="rounded-[1.5rem] bg-card/60 border border-border/50 h-48" />
            <div className="rounded-[1.5rem] bg-card/60 border border-border/50 h-56" />
          </div>
        </div>
      </div>
    </div>
  );
}
