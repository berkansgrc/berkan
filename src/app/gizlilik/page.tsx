import { Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Berkan Matematik",
  description: "Berkan Matematik platformunun gizlilik politikası ve kişisel verilerin korunması hakkında bilgiler.",
};

export default function GizlilikPage() {
  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-background overflow-hidden">
      {/* Decorative */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] z-0 pointer-events-none -translate-x-1/3 -translate-y-1/3" />

      {/* Header */}
      <div className="relative border-b border-border/50 bg-card/60 backdrop-blur-md z-10">
        <div className="container max-w-4xl px-6 lg:px-12 py-12 mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
              <div className="relative z-10 h-14 w-14 rounded-2xl bg-primary-container border border-primary/20 flex items-center justify-center shadow-xl shadow-primary/10">
                <Shield className="h-7 w-7 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                Gizlilik Politikası
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground text-lg font-medium mt-2">
            Son güncelleme: {new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container max-w-4xl px-6 lg:px-12 py-12 mx-auto">
        <article className="prose prose-lg max-w-none text-foreground/90 space-y-10">

          {/* 1 */}
          <section className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-md p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-black text-foreground mb-4">1. Genel Bilgilendirme</h2>
            <p className="text-muted-foreground leading-relaxed">
              Berkan Matematik (&quot;Platform&quot;), öğrencilere matematik eğitimi sağlamak amacıyla hizmet veren bir çevrimiçi eğitim platformudur.
              Bu gizlilik politikası, platformumuzu kullanırken toplanan, işlenen ve saklanan kişisel verileriniz hakkında sizi bilgilendirmek
              amacıyla hazırlanmıştır. 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) ve ilgili mevzuat kapsamında
              veri sorumlusu sıfatıyla hareket etmekteyiz.
            </p>
          </section>

          {/* 2 */}
          <section className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-md p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-black text-foreground mb-4">2. Toplanan Veriler</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Platformumuzu kullanırken aşağıdaki kişisel verileriniz toplanabilir:
            </p>
            <ul className="space-y-3">
              {[
                { title: "Kimlik Bilgileri", desc: "Ad, soyad ve kullanıcı adı." },
                { title: "İletişim Bilgileri", desc: "E-posta adresi." },
                { title: "Hesap Bilgileri", desc: "Şifre (hash'lenmiş olarak saklanır), kayıt tarihi ve hesap türü (öğrenci/öğretmen)." },
                { title: "Eğitim Verileri", desc: "Sınav sonuçları, doğru/yanlış sayıları, çözüm süreleri ve başarı analizleri." },
                { title: "Teknik Veriler", desc: "IP adresi, tarayıcı türü, cihaz bilgileri ve oturum çerezleri." },
                { title: "Kullanım Verileri", desc: "Sayfa görüntüleme, tıklama ve gezinme verileri." },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3 bg-muted/40 p-4 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <span className="font-heading font-bold text-foreground">{item.title}:</span>
                    <span className="text-muted-foreground ml-1">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* 3 */}
          <section className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-md p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-black text-foreground mb-4">3. Verilerin İşlenme Amaçları</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              {[
                "Kullanıcı hesabınızın oluşturulması ve yönetimi",
                "Eğitim içeriklerinin kişiselleştirilmesi ve sunulması",
                "Sınav sonuçlarınızın analiz edilmesi ve performans raporları oluşturulması",
                "Platform güvenliğinin sağlanması ve kötüye kullanımın önlenmesi",
                "Yasal yükümlülüklerin yerine getirilmesi",
                "Platformun geliştirilmesi, istatistiksel analizler yapılması",
              ].map((text) => (
                <li key={text} className="flex items-start gap-3 pl-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 4 */}
          <section className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-md p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-black text-foreground mb-4">4. Verilerin Paylaşımı</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kişisel verileriniz üçüncü taraflarla <strong className="text-foreground">satılmaz</strong> ve pazarlama amaçlı paylaşılmaz.
              Ancak aşağıdaki durumlarda verileriniz paylaşılabilir:
            </p>
            <ul className="space-y-2 text-muted-foreground mt-4">
              {[
                "Yasal zorunluluklar kapsamında yetkili kamu kurum ve kuruluşlarıyla",
                "Platformun altyapı hizmetlerini sağlayan teknik iş ortaklarıyla (Supabase, Netlify gibi — yalnızca hizmet sunumu amacıyla)",
                "Hata izleme ve performans iyileştirme amacıyla (Sentry gibi — anonim veriler)",
              ].map((text) => (
                <li key={text} className="flex items-start gap-3 pl-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 5 */}
          <section className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-md p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-black text-foreground mb-4">5. Çerezler (Cookies)</h2>
            <p className="text-muted-foreground leading-relaxed">
              Platformumuz, oturum yönetimi ve kimlik doğrulama amacıyla zorunlu çerezler kullanmaktadır.
              Bu çerezler olmadan platforma giriş yapmanız ve sınav çözmeniz mümkün değildir.
              Analitik çerezler yalnızca anonim istatistiksel veriler toplamak amacıyla kullanılır ve
              kişisel bilgilerinizle ilişkilendirilmez.
            </p>
          </section>

          {/* 6 */}
          <section className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-md p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-black text-foreground mb-4">6. Veri Güvenliği</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kişisel verilerinizin güvenliği bizim için önceliklidir. Verileriniz şifrelenerek (SSL/TLS)
              iletilir, şifreler endüstri standardı hash algoritmaları ile saklanır ve
              erişim kontrolleri ile korunur. API uçlarımız istek sınırlama (rate limiting) mekanizması
              ile bot saldırılarına karşı korunmaktadır.
            </p>
          </section>

          {/* 7 */}
          <section className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-md p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-black text-foreground mb-4">7. Haklarınız (KVKK Madde 11)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              KVKK kapsamında aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              {[
                "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
                "İşlenmişse buna ilişkin bilgi talep etme",
                "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
                "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri öğrenme",
                "Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme",
                "KVKK'nın 7. maddesi kapsamında silinmesini veya yok edilmesini isteme",
                "İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi ile aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
              ].map((text) => (
                <li key={text} className="flex items-start gap-3 pl-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 8 */}
          <section className="rounded-[1.5rem] border border-primary/30 bg-primary-container/10 backdrop-blur-md p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-black text-foreground mb-4">8. İletişim</h2>
            <p className="text-muted-foreground leading-relaxed">
              Gizlilik politikamız hakkında sorularınız veya KVKK kapsamındaki talepleriniz için
              aşağıdaki iletişim kanallarından bize ulaşabilirsiniz:
            </p>
            <div className="mt-4 p-4 bg-muted/40 rounded-xl">
              <p className="font-heading font-bold text-foreground">Berkan Matematik</p>
              <p className="text-muted-foreground text-sm mt-1">E-posta: iletisim@berkanmatematik.com</p>
            </div>
          </section>

        </article>
      </div>
    </div>
  );
}
