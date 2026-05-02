export default function GradeLoading() {
  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] w-full pb-20 bg-background overflow-x-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-border/50 bg-card/60 backdrop-blur-xl">
        <div className="container max-w-7xl px-6 lg:px-12 py-8 mx-auto">
          <div className="w-28 h-4 bg-muted rounded-lg mb-4" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-muted" />
            <div>
              <div className="w-40 h-8 bg-muted rounded-lg mb-2" />
              <div className="w-24 h-4 bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container max-w-7xl px-6 lg:px-12 py-10 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sol: Video alanı */}
          <div className="lg:col-span-8 space-y-5">
            <div className="aspect-video w-full rounded-[1.75rem] bg-muted" />
            <div className="rounded-[1.5rem] bg-muted h-32" />
          </div>

          {/* Sağ: Ders listesi */}
          <div className="lg:col-span-4 space-y-4">
            <div className="w-32 h-5 bg-muted rounded-lg" />
            <div className="h-10 rounded-2xl bg-muted" />
            <div className="rounded-[1.5rem] border border-border/50 bg-card/60 overflow-hidden divide-y divide-border/30">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted" />
                    <div className="flex-1">
                      <div className="w-3/4 h-4 bg-muted rounded mb-1" />
                      <div className="w-1/3 h-3 bg-muted rounded" />
                    </div>
                  </div>
                  <div className="mt-3 space-y-2 pl-11">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="flex items-center gap-3 py-2">
                        <div className="w-8 h-8 rounded-md bg-muted" />
                        <div className="flex-1">
                          <div className="w-4/5 h-3.5 bg-muted rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
