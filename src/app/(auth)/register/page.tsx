import Link from "next/link";
import { signup } from "@/app/(auth)/actions";
import { Compass, Sparkles, User, Mail, Lock, ArrowRight } from "lucide-react";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-background/50 text-foreground overflow-x-hidden flex items-center justify-center py-12">
      {/* Decorative Ethereal Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\\\'0 0 200 200\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\'%3E%3Cfilter id=\\\'noiseFilter\\\'%3E%3CfeTurbulence type=\\\'fractalNoise\\\' baseFrequency=\\\'0.65\\\' numOctaves=\\\'3\\\' stitchTiles=\\\'stitch\\\'/%3E%3C/filter%3E%3Crect width=\\\'100%25\\\' height=\\\'100%25\\\' filter=\\\'url(%23noiseFilter)\\\'/%3E%3C/svg%3E")' }}></div>
      <div className="fixed -top-24 -left-24 w-[500px] h-[500px] bg-primary-container/20 rounded-full blur-[100px] z-0 pointer-events-none"></div>
      <div className="fixed top-1/2 -right-48 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] z-0 pointer-events-none"></div>
      <div className="fixed -bottom-24 left-1/4 w-96 h-96 bg-tertiary-container/15 rounded-full blur-[80px] z-0 pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl w-full items-center px-6 lg:px-12">
        
        {/* Left Side: Visual/Branding */}
        <div className="hidden lg:flex lg:col-span-6 flex-col gap-8">
          <div className="relative z-10">
            <h1 className="font-heading font-extrabold text-5xl xl:text-[3.5rem] text-primary leading-[1.1] tracking-tight">
              Kinetik <span className="text-secondary italic">Geometriyi</span> Keşfet.
            </h1>
            <div className="mt-6 flex flex-col gap-4 max-w-md">
              <p className="text-muted-foreground text-lg leading-relaxed font-sans">
                Matematiksel kavramları yepyeni bir ortamda vizualize eden binlerce öğrenci arasına katıl. Karmaşık problemler artık çok basit.
              </p>
            </div>
          </div>
          
          {/* Boxy Floating Stats/Visuals */}
          <div className="grid grid-cols-2 gap-5 mt-4">
            <div className="bg-card p-6 rounded-[1.5rem] rounded-tr-3xl shadow-[0_20px_40px_rgba(44,47,48,0.04)] flex flex-col gap-4 border border-border">
              <div className="bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center">
                <Compass className="text-secondary w-6 h-6" />
              </div>
              <div>
                <p className="text-xl font-bold font-heading text-foreground">Görsel Kanıt</p>
                <p className="text-sm text-muted-foreground mt-1">Teoremler ile 3D alanda oyna.</p>
              </div>
            </div>
            <div className="bg-primary-container/20 backdrop-blur-md p-6 rounded-[1.5rem] rounded-bl-3xl shadow-[0_20px_40px_rgba(44,47,48,0.04)] flex flex-col gap-4 border border-primary/10 mt-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="text-primary w-6 h-6" />
                </div>
                <p className="text-xl font-bold font-heading text-foreground">Akıllı Öğrenim</p>
                <p className="text-sm text-muted-foreground mt-1">Mantığınla beraber gelişen yapı.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sign Up Form Card */}
        <div className="col-span-12 lg:col-span-6 flex justify-center lg:justify-end w-full">
          <div className="w-full max-w-[460px] bg-card/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] rounded-tr-[5rem] shadow-[0_20px_40px_rgba(44,47,48,0.06)] relative border border-border">
            {/* Subtle geometric decoration behind form */}
            <div className="absolute -top-8 -right-8 w-32 h-32 border-[16px] border-secondary/10 rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 w-full">
              <div className="mb-8">
                <h2 className="font-heading font-bold text-3xl text-foreground mb-2">Hesap Oluştur</h2>
                <p className="text-muted-foreground text-sm">Matematiksel yolculuğuna bugün başla.</p>
              </div>

              {params?.error && (
                <div className="mb-6 rounded-xl bg-destructive/10 p-4 text-sm text-destructive font-medium border border-destructive/20 shadow-sm animate-in fade-in slide-in-from-top-2">
                  {params.error}
                </div>
              )}

              <form action={signup} className="space-y-5">
                {/* Input: Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-foreground px-1" htmlFor="fullName">Ad Soyad</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input className="w-full pl-11 pr-4 py-3.5 bg-input/50 focus:bg-input border border-transparent rounded-[1rem] focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60 text-foreground font-medium" id="fullName" name="fullName" placeholder="Pascal Euler" type="text" required />
                  </div>
                </div>

                {/* Input: Email */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-foreground px-1" htmlFor="email">E-posta Adresi</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input className="w-full pl-11 pr-4 py-3.5 bg-input/50 focus:bg-input border border-transparent rounded-[1rem] focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60 text-foreground font-medium" id="email" name="email" placeholder="ornek@email.com" type="email" required />
                  </div>
                </div>

                {/* Input: Password */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-foreground px-1" htmlFor="password">Güvenli Şifre</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input className="w-full pl-11 pr-4 py-3.5 bg-input/50 focus:bg-input border border-transparent rounded-[1rem] focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60 text-foreground font-medium" id="password" name="password" placeholder="En az 6 karakter" type="password" minLength={6} required />
                  </div>
                </div>

                {/* Default Role (Student) */}
                <input type="hidden" name="role" value="student" />

                {/* CTA Button */}
                <button type="submit" className="w-full bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-bold text-[15px] py-4 rounded-[1.25rem] rounded-tr-md shadow-[0_12px_24px_rgba(0,103,98,0.25)] hover:shadow-[0_16px_32px_rgba(0,103,98,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-6 border-0">
                  <span>Hesabı Oluştur</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform text-primary-foreground" />
                </button>
              </form>
              
              <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
                Zaten hesabınız var mı?{" "}
                <Link href="/login" className="font-heading font-bold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
                  Giriş Yap
                </Link>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Floating Graphic: Animated Formula Bubble */}
      <div className="fixed bottom-16 right-16 hidden 2xl:block z-0 pointer-events-none">
        <div className="relative group animate-in fade-in zoom-in duration-1000 delay-300 fill-mode-both">
          <div className="absolute -inset-6 bg-gradient-to-br from-primary to-[#005a55] opacity-20 blur-2xl rounded-full"></div>
          <div className="relative w-24 h-24 bg-card rounded-full flex items-center justify-center shadow-xl border border-white/50 backdrop-blur-md hover:scale-110 transition-transform cursor-default">
            <span className="font-heading font-bold text-primary text-3xl">π</span>
          </div>
          <div className="absolute -top-4 -left-4 w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center shadow-md border border-white/50 animate-bounce" style={{animationDuration: '3s'}}>
            <span className="text-secondary font-bold text-sm">Σ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
