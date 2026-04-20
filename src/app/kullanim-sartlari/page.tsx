import { FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Şartları | Berkan Matematik",
  description: "Berkan Matematik platformunun kullanım koşulları, üyelik şartları ve sorumluluklar.",
};

export default function KullanimSartlariPage() {
  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-background overflow-hidden">
      {/* Decorative */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] z-0 pointer-events-none translate-x-1/3 -translate-y-1/3" />

      {/* Header */}
      <div className="relative border-b border-border/50 bg-card/60 backdrop-blur-md z-10">
        <div className="container max-w-4xl px-6 lg:px-12 py-12 mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-secondary/20 blur-md rounded-full" />
              <div className="relative z-10 h-14 w-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center shadow-xl shadow-secondary/10">
                <FileText className="h-7 w-7 text-secondary" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                Kullanım Şartları
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
            <h2 className="text-2xl font-heading font-black text-foreground mb-4">1. Kabul ve Onay</h2>
            <p className="text-muted-foreground leading-relaxed">
              Berkan Matematik platformuna (&quot;Platform&quot;) kayıt olarak veya platformu kullanarak,
              işbu kullanım şartlarını okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan edersiniz.
              Bu şartları kabul etmiyorsanız platformu kullanmamanız gerekmektedir.
              Platform, 18 yaşından küçük öğrencilere eğitim hizmeti sunmakta olup,
              bu durumda velinin/vasinin onayı aranır.
            </p>
          </section>

          {/* 2 */}
          <section className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-md p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-black text-foreground mb-4">2. Hizmet Tanımı</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Berkan Matematik, aşağıdaki hizmetleri sunan bir çevrimiçi eğitim platformudur:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              {[
                "Sınıf bazlı matematik ders içerikleri (video, yazılı içerik, uygulama)",
                "Çevrimiçi deneme sınavları ve anlık sonuç analizi",
                "Canlı ders yayınları ve etkileşimli öğrenme",
                "Performans takibi ve kişisel başarı raporları",
                "Öğrenci ve öğretmen panelleri aracılığıyla içerik yönetimi",
              ].map((text) => (
                <li key={text} className="flex items-start gap-3 pl-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3 */}
          <section className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-md p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-black text-foreground mb-4">3. Üyelik ve Hesap Güvenliği</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Platforma kayıt olmak için geçerli bir e-posta adresi ve güçlü bir şifre belirlemeniz gerekmektedir.
                Hesabınızın güvenliğinden siz sorumlusunuz. Şifrenizi üçüncü kişilerle paylaşmamalısınız.
              </p>
              <p>
                Hesabınız üzerinden gerçekleştirilen tüm işlemlerden siz sorumlusunuz.
                Hesabınızda yetkisiz bir erişim fark etmeniz halinde derhal bize bildirmeniz gerekmektedir.
              </p>
              <p>
                Platform, güvenlik ihlali veya kuralların çiğnenmesi durumunda herhangi bir
                hesabı önceden haber vermeksizin askıya alma veya kapatma hakkını saklı tutar.
              </p>
            </div>
          </section>

          {/* 4 */}
          <section className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-md p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-black text-foreground mb-4">4. Kullanıcı Yükümlülükleri</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Platform kullanıcıları aşağıdaki kurallara uymayı kabul eder:
            </p>
            <ul className="space-y-3">
              {[
                { title: "Doğru Bilgi", desc: "Kayıt sırasında doğru ve güncel bilgiler vermek." },
                { title: "Hukuka Uygunluk", desc: "Platformu yalnızca yasal amaçlarla kullanmak." },
                { title: "İçerik Bütünlüğü", desc: "Platform içeriklerini kopyalamamak, çoğaltmamak veya ticari amaçla kullanmamak." },
                { title: "Saygılı Davranış", desc: "Diğer kullanıcılara saygılı davranmak, taciz veya hakaret içeren davranışlardan kaçınmak." },
                { title: "Sistem Güvenliği", desc: "Platformun teknik altyapısına zarar verecek, güvenliğini tehlikeye atacak eylemlerde bulunmamak." },
                { title: "Sınav Dürüstlüğü", desc: "Sınavlarda hile yapmamak, otomatik botlar veya yazılımlar kullanmamak." },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3 bg-muted/40 p-4 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                  <div>
                    <span className="font-heading font-bold text-foreground">{item.title}:</span>
                    <span className="text-muted-foreground ml-1">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* 5 */}
          <section className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-md p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-black text-foreground mb-4">5. Fikri Mülkiyet Hakları</h2>
            <p className="text-muted-foreground leading-relaxed">
              Platformdaki tüm içerikler (sınav soruları, ders videoları, yazılı materyaller, görseller,
              tasarım öğeleri ve yazılım kodu) Berkan Matematik&apos;e aittir veya lisans altında kullanılmaktadır.
              Bu içeriklerin önceden yazılı izin alınmadan kopyalanması, dağıtılması, yayınlanması
              veya ticari amaçlarla kullanılması kesinlikle yasaktır ve yasal işlem başlatılabilir.
            </p>
          </section>

          {/* 6 */}
          <section className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-md p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-black text-foreground mb-4">6. Sorumluluk Sınırlaması</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Platform, eğitim içeriklerinin doğruluk ve güncelliği konusunda azami özeni gösterir,
                ancak içeriklerin hatasız olduğunu garanti etmez. Sınav sonuçları ve performans analizleri
                yalnızca bilgilendirme amaçlıdır, resmi bir belge niteliği taşımaz.
              </p>
              <p>
                Platformun kesintisiz veya hatasız çalışacağı garanti edilmez. Teknik bakım,
                güncelleme veya öngörülemeyen durumlar nedeniyle hizmet kesintileri yaşanabilir.
                Bu durumlarda platformun herhangi bir tazminat yükümlülüğü bulunmamaktadır.
              </p>
            </div>
          </section>

          {/* 7 */}
          <section className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-md p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-black text-foreground mb-4">7. Hesap Silme</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kullanıcılar, hesaplarının silinmesini e-posta yoluyla talep edebilir. Hesap silme talebi
              alındıktan sonra en geç 30 gün içinde tüm kişisel verileriniz sistemlerimizden kalıcı olarak
              silinir. Yasal saklama yükümlülükleri kapsamında tutulması gereken veriler bu sürecin dışındadır.
            </p>
          </section>

          {/* 8 */}
          <section className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-md p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-black text-foreground mb-4">8. Değişiklikler</h2>
            <p className="text-muted-foreground leading-relaxed">
              Berkan Matematik, bu kullanım şartlarını herhangi bir zamanda güncelleme hakkını saklı tutar.
              Önemli değişiklikler yapıldığında kullanıcılar e-posta veya platform içi bildirim yoluyla
              bilgilendirilir. Değişiklik sonrasında platformu kullanmaya devam etmeniz,
              güncellenmiş şartları kabul ettiğiniz anlamına gelir.
            </p>
          </section>

          {/* 9 */}
          <section className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-md p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-black text-foreground mb-4">9. Uygulanacak Hukuk ve Yetki</h2>
            <p className="text-muted-foreground leading-relaxed">
              Bu kullanım şartları Türkiye Cumhuriyeti kanunlarına tabidir.
              Uyuşmazlıkların çözümünde Türkiye Cumhuriyeti mahkemeleri ve icra daireleri yetkilidir.
            </p>
          </section>

          {/* 10 */}
          <section className="rounded-[1.5rem] border border-secondary/30 bg-secondary/5 backdrop-blur-md p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-black text-foreground mb-4">10. İletişim</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kullanım şartlarımız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
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
