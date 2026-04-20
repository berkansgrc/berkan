import Link from "next/link";
import { login } from "@/app/(auth)/actions";
import { Compass, Sparkles, Mail, Lock, ArrowRight } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-background/50 text-foreground overflow-x-hidden flex items-center justify-center py-12">
      {/* Decorative Ethereal Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\\\'0 0 200 200\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\'%3E%3Cfilter id=\\\'noiseFilter\\\'%3E%3CfeTurbulence type=\\\'fractalNoise\\\' baseFrequency=\\\'0.65\\\' numOctaves=\\\'3\\\' stitchTiles=\\\'stitch\\\'/%3E%3C/filter%3E%3Crect width=\\\'100%25\\\' height=\\\'100%25\\\' filter=\\\'url(%23noiseFilter)\\\'/%3E%3C/svg%3E")' }}></div>
      <div className="fixed -top-24 -right-24 w-[500px] h-[500px] bg-primary-container/20 rounded-full blur-[100px] z-0 pointer-events-none"></div>
      <div className="fixed top-1/2 -left-48 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] z-0 pointer-events-none"></div>
      <div className="fixed -bottom-24 right-1/4 w-96 h-96 bg-tertiary-container/15 rounded-full blur-[80px] z-0 pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl w-full items-center px-6 lg:px-12 flex-row-reverse">
        
        {/* Right Side: Visual/Branding (Appears on the left visually via order or we can just swap columns) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col gap-8 order-2">
          <div className="relative z-10">
            <h1 className="font-heading font-extrabold text-5xl xl:text-[3.5rem] text-primary leading-[1.1] tracking-tight">
              Kinetik <span className="text-secondary italic">Geometriye</span> Dönüş.
            </h1>
            <div className="mt-6 flex flex-col gap-4 max-w-md">
              <p className="text-muted-foreground text-lg leading-relaxed font-sans">
                Kaldığın yerden devam et. Öğrencilerinle veya bireysel öğrenim yolculuğunla tekrar buluş.
              </p>
            </div>
          </div>
          
          {/* Boxy Floating Stats/Visuals */}
          <div className="grid grid-cols-2 gap-5 mt-4">
            <div className="bg-card p-6 rounded-[1.5rem] rounded-tl-3xl shadow-[0_20px_40px_rgba(44,47,48,0.04)] flex flex-col gap-4 border border-border">
              <div className="bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center">
                <Compass className="text-secondary w-6 h-6" />
              </div>
              <div>
                <p className="text-xl font-bold font-heading text-foreground">Görsel Kanıt</p>
                <p className="text-sm text-muted-foreground mt-1">Teoremler ile 3D alanda oyna.</p>
              </div>
            </div>
            <div className="bg-primary-container/20 backdrop-blur-md p-6 rounded-[1.5rem] rounded-br-3xl shadow-[0_20px_40px_rgba(44,47,48,0.04)] flex flex-col gap-4 border border-primary/10 mt-8 relative overflow-hidden group">
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

        {/* Left Side: Login Form Card */}
        <div className="col-span-12 lg:col-span-6 flex justify-center lg:justify-start w-full order-1">
          <div className="w-full max-w-[460px] bg-card/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] rounded-tl-[5rem] shadow-[0_20px_40px_rgba(44,47,48,0.06)] relative border border-border">
            {/* Subtle geometric decoration behind form */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 border-[16px] border-secondary/10 rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 w-full">
              <div className="mb-8">
                <h2 className="font-heading font-bold text-3xl text-foreground mb-2">Giriş Yap</h2>
                <p className="text-muted-foreground text-sm">Hesabınıza giriş yaparak devam edin.</p>
              </div>

              {params?.error && (
                <div className="mb-6 rounded-xl bg-destructive/10 p-4 text-sm text-destructive font-medium border border-destructive/20 shadow-sm animate-in fade-in slide-in-from-top-2">
                  {params.error}
                </div>
              )}
              {params?.message && (
                <div className="mb-6 rounded-xl bg-primary/10 p-4 text-sm text-primary font-medium border border-primary/20 shadow-sm animate-in fade-in slide-in-from-top-2">
                  {params.message}
                </div>
              )}

              <form action={login} className="space-y-5">
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
                    <input className="w-full pl-11 pr-4 py-3.5 bg-input/50 focus:bg-input border border-transparent rounded-[1rem] focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60 text-foreground font-medium" id="password" name="password" placeholder="••••••••" type="password" required />
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <button type="submit" className="w-full bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-bold text-[15px] py-4 rounded-[1.25rem] rounded-tl-md shadow-[0_12px_24px_rgba(0,103,98,0.25)] hover:shadow-[0_16px_32px_rgba(0,103,98,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-2 border-0">
                    <span>Giriş Yap</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform text-primary-foreground" />
                  </button>
                </div>
              </form>
              
              <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
                Hesabınız yok mu?{" "}
                <Link href="/register" className="font-heading font-bold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
                  Kayıt Ol
                </Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
