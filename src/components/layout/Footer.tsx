import { Globe, Mail, Network } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative w-full py-12 px-6 lg:px-20 z-10 mt-auto bg-surface">
      <div className="max-w-7xl mx-auto bg-muted/50 rounded-[3rem] p-12 lg:p-20 overflow-hidden relative border border-border/50">
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/5 organic-blob pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="font-heading font-black text-white text-xl">B</span>
               </div>
               <div className="text-2xl font-black text-primary font-heading tracking-tight">Berkan Matematik</div>
            </div>
            
            <p className="max-w-xs text-foreground/50 font-semibold text-lg">Kinetik hareketler ile evrenin dilini (Matematiği) yeniden keşfedin.</p>
            <div className="flex gap-4">
              <a className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#"><Globe className="w-5 h-5" /></a>
              <a className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#"><Mail className="w-5 h-5" /></a>
              <a className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#"><Network className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-sm font-black uppercase tracking-widest text-foreground">
            <div className="space-y-4">
              <p className="text-foreground/50">Keşfet</p>
              <ul className="space-y-3">
                <li><Link className="hover:text-primary transition-colors" href="/exams">Sınavlar</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Canlı Sınıf</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Araçlar</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-foreground/50">Topluluk</p>
              <ul className="space-y-3">
                <li><Link className="hover:text-primary transition-colors" href="#">Blog</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Forum</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-foreground/50">Yasal</p>
              <ul className="space-y-3">
                <li><Link className="hover:text-primary transition-colors" href="/gizlilik">Gizlilik</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="/kullanim-sartlari">Şartlar</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-foreground/50">Destek</p>
              <ul className="space-y-3">
                <li><Link className="hover:text-primary transition-colors" href="/sss">SSS</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="/iletisim">İletişim</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-border/50 text-center md:text-left text-xs font-bold text-foreground/50">
            © {new Date().getFullYear()} Berkan Matematik. Evren seni bekliyor.
        </div>
      </div>
    </footer>
  );
}
