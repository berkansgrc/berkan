"use client";

import { m } from "framer-motion";

const data = [
  { day: "Pzt", value: 30 },
  { day: "Sal", value: 45 },
  { day: "Çar", value: 25 },
  { day: "Per", value: 60 },
  { day: "Cum", value: 85 },
  { day: "Cmt", value: 50 },
  { day: "Paz", value: 95 },
];

export default function ActivityChart() {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="w-full h-48 flex items-end justify-between gap-2 px-2 mt-4 relative">
      {/* Background Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="w-full border-t border-border/50 border-dashed" />
        ))}
      </div>

      {data.map((item, index) => {
        const heightPercentage = (item.value / maxValue) * 100;
        
        return (
          <div key={item.day} className="flex flex-col items-center flex-1 gap-2 z-10 group">
            {/* Tooltip (Hover) */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap pointer-events-none transform -translate-x-1/2 left-1/2">
              {item.value} Etkileşim
            </div>

            {/* Bar */}
            <div className="w-full max-w-[2.5rem] h-[120px] bg-muted/40 rounded-t-xl relative overflow-hidden flex items-end">
              <m.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPercentage}%` }}
                transition={{ duration: 1, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="w-full bg-gradient-to-t from-primary/80 to-[#005a55] rounded-t-xl group-hover:opacity-80 transition-opacity cursor-pointer"
              />
            </div>
            
            {/* Label */}
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {item.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}
