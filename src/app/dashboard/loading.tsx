import { BookOpen, Target, Trophy, History } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full p-4 md:p-8 bg-background overflow-hidden pb-20">
      <div className="relative z-10 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="h-10 w-48 bg-border/50 rounded-lg animate-pulse mb-2" />
            <div className="h-6 w-72 bg-border/40 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card/40 backdrop-blur-xl border border-border/50 p-6 rounded-[1.5rem] relative overflow-hidden h-40">
            <div className="bg-border/30 border border-border/50 w-10 h-10 rounded-xl mb-4 animate-pulse" />
            <div className="h-4 w-24 bg-border/50 rounded-lg animate-pulse mb-2" />
            <div className="h-8 w-12 bg-border/60 rounded-lg animate-pulse" />
          </div>
          
          <div className="bg-card/40 backdrop-blur-xl border border-border/50 p-6 rounded-[1.5rem] relative overflow-hidden h-40">
            <div className="bg-border/30 border border-border/50 w-10 h-10 rounded-xl mb-4 animate-pulse" />
            <div className="h-4 w-32 bg-border/50 rounded-lg animate-pulse mb-2" />
            <div className="h-8 w-16 bg-border/60 rounded-lg animate-pulse" />
          </div>
          
          <div className="bg-primary/5 border border-primary/10 p-6 rounded-[1.5rem] relative overflow-hidden h-40">
            <div className="bg-primary/10 w-10 h-10 rounded-xl mb-4 animate-pulse" />
            <div className="h-4 w-20 bg-primary/20 rounded-lg animate-pulse mb-2" />
            <div className="h-8 w-24 bg-primary/30 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Son Sınav Sonuçları Skeleton */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-muted-foreground animate-pulse" />
              <div className="h-6 w-48 bg-border/50 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-[1.25rem] border border-border/50 bg-card/40 backdrop-blur-md px-5 py-4 flex items-center justify-between gap-4 h-16">
                <div className="flex-1">
                  <div className="h-4 w-40 bg-border/60 rounded-lg animate-pulse mb-1.5" />
                  <div className="h-3 w-16 bg-border/40 rounded-lg animate-pulse" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-32 bg-border/50 rounded-lg animate-pulse hidden sm:block" />
                  <div className="h-8 w-12 bg-border/60 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
