import { Mail, MessageCircle, Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim | Berkan Matematik",
  description: "Berkan Matematik ile iletişime geçin. Sorularınız, önerileriniz ve geri bildirimleriniz için bize ulaşın.",
};

export default function IletisimPage() {
  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-background overflow-hidden">
      {/* Decorative */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] z-0 pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] z-0 pointer-events-none translate-x-1/3 translate-y-1/3" />

      {/* Header */}
      <div className="relative border-b border-border/50 bg-card/60 backdrop-blur-md z-10">
        <div className="container max-w-5xl px-6 lg:px-12 py-12 mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
              <div className="relative z-10 h-14 w-14 rounded-2xl bg-primary-container border border-primary/20 flex items-center justify-center shadow-xl shadow-primary/10">
                <Mail className="h-7 w-7 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                İletişim
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground text-lg font-medium mt-2 max-w-xl">
            Sorularınız, önerileriniz veya geri bildirimleriniz için bize ulaşın. En kısa sürede dönüş yapacağız.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container max-w-5xl px-6 lg:px-12 py-12 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Contact Info — Sol Taraf */}
          <div className="lg:col-span-2 space-y-6">

            {/* E-posta Kartı */}
            <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-md p-6 shadow-sm hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-[1rem] bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-foreground">E-posta</h3>
                  <p className="text-xs text-muted-foreground font-medium">Doğrudan bize yazın</p>
                </div>
              </div>
              <a
                href="mailto:berkan_1225@hotmail.com"
                className="text-primary font-bold hover:underline text-lg"
              >
                berkan_1225@hotmail.com
              </a>
            </div>

            {/* Yanıt Süresi */}
            <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-md p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-[1rem] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-foreground">Yanıt Süresi</h3>
                  <p className="text-xs text-muted-foreground font-medium">Genellikle aynı gün</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                E-postalarınıza genellikle <span className="font-bold text-foreground">24 saat</span> içinde yanıt veriyoruz.
                Yoğun dönemlerde bu süre 48 saate uzayabilir.
              </p>
            </div>

            {/* Konum */}
            <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-md p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-[1rem] bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-foreground">Konum</h3>
                  <p className="text-xs text-muted-foreground font-medium">Çevrimiçi platform</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Berkan Matematik tamamen çevrimiçi çalışan bir eğitim platformudur. Türkiye genelinde hizmet vermekteyiz.
              </p>
            </div>
          </div>

          {/* İletişim Formu — Sağ Taraf */}
          <div className="lg:col-span-3">
            <div className="rounded-[2rem] border border-border/50 bg-card/60 backdrop-blur-md p-8 lg:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-heading font-black text-foreground">Bize Yazın</h2>
              </div>

              <form
                action={`mailto:berkan_1225@hotmail.com`}
                method="POST"
                encType="text/plain"
                className="space-y-6"
              >
                {/* Ad Soyad */}
                <div>
                  <label htmlFor="name" className="block text-sm font-heading font-bold text-foreground mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="Ad Soyad"
                    required
                    placeholder="Adınız ve soyadınız"
                    className="w-full px-5 py-3.5 bg-muted/40 border border-border/60 rounded-[1rem] text-foreground placeholder:text-muted-foreground/50 font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/40 transition-all"
                  />
                </div>

                {/* E-posta */}
                <div>
                  <label htmlFor="email" className="block text-sm font-heading font-bold text-foreground mb-2">
                    E-posta Adresiniz
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="E-posta"
                    required
                    placeholder="ornek@email.com"
                    className="w-full px-5 py-3.5 bg-muted/40 border border-border/60 rounded-[1rem] text-foreground placeholder:text-muted-foreground/50 font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/40 transition-all"
                  />
                </div>

                {/* Konu */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-heading font-bold text-foreground mb-2">
                    Konu
                  </label>
                  <select
                    id="subject"
                    name="Konu"
                    className="w-full px-5 py-3.5 bg-muted/40 border border-border/60 rounded-[1rem] text-foreground font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/40 transition-all cursor-pointer"
                  >
                    <option value="Genel Soru">Genel Soru</option>
                    <option value="Teknik Destek">Teknik Destek</option>
                    <option value="Hesap Sorunu">Hesap Sorunu</option>
                    <option value="İçerik Önerisi">İçerik Önerisi</option>
                    <option value="Hata Bildirimi">Hata Bildirimi</option>
                    <option value="İş Birliği">İş Birliği Teklifi</option>
                  </select>
                </div>

                {/* Mesaj */}
                <div>
                  <label htmlFor="message" className="block text-sm font-heading font-bold text-foreground mb-2">
                    Mesajınız
                  </label>
                  <textarea
                    id="message"
                    name="Mesaj"
                    required
                    rows={5}
                    placeholder="Mesajınızı buraya yazın..."
                    className="w-full px-5 py-3.5 bg-muted/40 border border-border/60 rounded-[1rem] text-foreground placeholder:text-muted-foreground/50 font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none"
                  />
                </div>

                {/* Gönder Butonu */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-bold text-sm py-4 rounded-[1.25rem] shadow-[0_12px_24px_rgba(0,103,98,0.25)] hover:shadow-[0_16px_32px_rgba(0,103,98,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Mail className="w-5 h-5" />
                  Mesaj Gönder
                </button>

                <p className="text-xs text-muted-foreground text-center font-medium">
                  &quot;Mesaj Gönder&quot; butonuna tıkladığınızda e-posta uygulamanız açılacaktır.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
