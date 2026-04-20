type Option = {
  label: string;
  text: string;
};

type Props = {
  orderIndex: number;
  body: string;
  options: Option[];
  imageUrl?: string | null;
  selectedOption: string | null;
  onSelect: (label: string) => void;
};

export default function QuestionCard({
  orderIndex,
  body,
  options,
  imageUrl,
  selectedOption,
  onSelect,
}: Props) {
  return (
    <div className="rounded-[2rem] border border-border/60 bg-card/80 backdrop-blur-2xl shadow-[0_32px_64px_rgba(44,47,48,0.08)] p-6 md:p-10 space-y-8 relative overflow-hidden transition-all duration-500">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

      {/* Soru numarası + metin */}
      <div className="flex flex-col md:flex-row gap-6 relative z-10">
        <div className="shrink-0 flex flex-col items-center gap-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground text-xl font-heading font-extrabold shadow-sm border border-primary/20">
            {orderIndex}
            </span>
            <div className="w-[2px] h-12 bg-border/50 hidden md:block rounded-full"></div>
        </div>
        <div className="flex-1 space-y-6">
            <p className="text-xl md:text-2xl font-heading font-bold leading-relaxed text-foreground tracking-tight">{body}</p>
            
            {/* Görsel */}
            {imageUrl && (
            <div className="rounded-[1.5rem] p-2 border border-border/80 bg-input/40 backdrop-blur-sm self-start inline-block shadow-inner mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                src={imageUrl}
                alt={`Soru ${orderIndex} görseli`}
                className="rounded-xl max-h-80 object-contain w-auto"
                />
            </div>
            )}
        </div>
      </div>

      {/* Seçenekler */}
      <div className="space-y-3 relative z-10 pl-0 md:pl-[4.5rem]">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.label;

          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => onSelect(opt.label)}
              className={`w-full group flex items-center gap-4 rounded-[1.25rem] border-2 px-5 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-[0_8px_16px_rgba(0,103,98,0.1)]"
                  : "border-border/80 bg-input/30 hover:border-primary/40 hover:bg-input"
              }`}
            >
              {isSelected && <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"></div>}

              <span
                className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-full text-base font-heading font-extrabold transition-all duration-300 relative z-10 ${
                  isSelected 
                    ? "bg-primary text-primary-foreground shadow-sm scale-110" 
                    : "bg-surface-variant text-on-surface-variant border border-border/50 group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30"
                }`}
              >
                {opt.label}
              </span>
              <span className={`text-lg leading-relaxed relative z-10 transition-colors ${isSelected ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>{opt.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
