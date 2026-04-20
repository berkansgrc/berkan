export default function ExamsLoading() {
  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] w-full pb-20 animate-pulse">
      {/* Header area */}
      <div className="border-b border-border/50 bg-card/60 backdrop-blur-xl px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="h-8 w-48 bg-muted rounded-2xl" />
          <div className="h-4 w-64 bg-muted rounded-full" />
          <div className="h-12 w-full max-w-md bg-muted rounded-2xl mt-4" />
        </div>
      </div>
      {/* Exam cards grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-[1.5rem] border border-border/50 bg-card/60 p-6 space-y-4"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex justify-between">
                <div className="h-5 w-20 bg-muted rounded-full" />
                <div className="h-5 w-16 bg-muted rounded-full" />
              </div>
              <div className="h-6 w-3/4 bg-muted rounded-xl" />
              <div className="h-3 w-full bg-muted rounded-full" />
              <div className="h-3 w-2/3 bg-muted rounded-full" />
              <div className="flex gap-2 pt-2">
                <div className="h-5 w-16 bg-muted rounded-lg" />
                <div className="h-5 w-16 bg-muted rounded-lg" />
              </div>
              <div className="pt-4 border-t border-border/30">
                <div className="h-11 bg-muted rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
