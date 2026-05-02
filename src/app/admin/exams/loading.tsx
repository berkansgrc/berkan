import { Category, Add } from "iconsax-react";

export default function AdminExamsLoading() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <div className="h-8 w-64 bg-border/50 rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-48 bg-border/40 rounded-lg animate-pulse" />
        </div>
        <div className="w-full sm:w-auto flex items-center gap-2">
          <div className="h-12 w-40 bg-border/50 rounded-xl animate-pulse" />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-[1.5rem] border border-border/50 bg-card/40 backdrop-blur-xl p-6 relative overflow-hidden h-[300px]"
          >
            <div className="animate-pulse space-y-4">
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 w-16 bg-border/50 rounded-full" />
                <div className="h-6 w-24 bg-border/50 rounded-full" />
              </div>
              
              <div className="h-6 w-3/4 bg-border/60 rounded-lg" />
              <div className="h-4 w-full bg-border/40 rounded-lg" />
              <div className="h-4 w-5/6 bg-border/40 rounded-lg" />
              
              <div className="flex items-center gap-3 mt-6">
                <div className="h-8 w-24 bg-border/50 rounded-lg" />
                <div className="h-8 w-32 bg-border/50 rounded-lg" />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto gap-2">
              <div className="flex-1 h-11 bg-border/50 rounded-xl animate-pulse" />
              <div className="w-24 h-11 bg-border/50 rounded-xl animate-pulse" />
              <div className="w-24 h-11 bg-border/50 rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
