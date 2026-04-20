"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, Mail } from "lucide-react";
import Link from "next/link";

const FAQ_SECTIONS = [
  {
    title: "Genel",
    questions: [
      {
        q: "Berkan Matematik nedir?",
        a: "Berkan Matematik, ortaokul ve lise öğrencilerine yönelik çevrimiçi bir matematik eğitim platformudur. Ders içerikleri, deneme sınavları, canlı dersler ve performans analiziyle matematik öğreniminizi güçlendirmeyi hedefler.",
      },
      {
        q: "Platform ücretsiz mi?",
        a: "Evet, Berkan Matematik şu an tamamen ücretsizdir. Tüm ders içerikleri, sınavlar ve canlı derslere ücretsiz erişebilirsiniz. Platforma kayıt olmanız yeterlidir.",
      },
      {
        q: "Hangi sınıf seviyelerini kapsıyorsunuz?",
        a: "5. sınıftan 11. sınıfa kadar tüm ortaokul ve lise seviyelerini kapsıyoruz. Ayrıca LGS ve TYT-AYT hazırlık içerikleri de mevcuttur.",
      },
    ],
  },
  {
    title: "Hesap ve Kayıt",
    questions: [
      {
        q: "Nasıl kayıt olabilirim?",
        a: 'Ana sayfadaki "Kayıt Ol" butonuna tıklayarak e-posta adresiniz ve bir şifre ile hızlıca kayıt olabilirsiniz. Kayıt sonrası e-posta doğrulaması yapmanız gerekmektedir.',
      },
      {
        q: "Şifremi unuttum, ne yapmalıyım?",
        a: 'Giriş sayfasındaki "Şifremi Unuttum" bağlantısına tıklayarak e-posta adresinize şifre sıfırlama bağlantısı gönderebilirsiniz. Bağlantı 1 saat geçerlidir.',
      },
      {
        q: "Hesabımı silebilir miyim?",
        a: "Evet. Hesap silme talebinizi iletisim@berkanmatematik.com adresine göndererek 30 gün içinde tüm verilerinizin kalıcı olarak silinmesini sağlayabilirsiniz.",
      },
    ],
  },
  {
    title: "Sınavlar",
    questions: [
      {
        q: "Sınavlar nasıl çalışır?",
        a: "Sınav sayfasından açık sınavlardan birini seçerek başlayabilirsiniz. Her sınavda belirli bir süre verilir. Süre dolduğunda veya siz tamamladığınızda sonuçlarınız otomatik olarak hesaplanır ve kaydedilir.",
      },
      {
        q: "Net hesaplama nasıl yapılıyor?",
        a: "YKS/TYT formatına uygun olarak hesaplanır: Her 4 yanlış cevap 1 doğru cevabı götürür. Boş bırakılan sorular net hesaplamasını etkilemez.",
      },
      {
        q: "Sınav sonuçlarımı nerede görebilirim?",
        a: "Sınav sonuçlarınız otomatik olarak öğrenci panelinize kaydedilir. Panelden geçmiş sınavlarınızı, puanlarınızı ve başarı grafiklerinizi inceleyebilirsiniz.",
      },
    ],
  },
  {
    title: "Canlı Dersler",
    questions: [
      {
        q: "Canlı derslere nasıl katılabilirim?",
        a: 'Kayıtlı kullanıcılar "Canlı Ders" menüsünden aktif yayınlara katılabilir. Ders takvimini de aynı sayfadan görebilirsiniz.',
      },
      {
        q: "Canlı dersleri sonra izleyebilir miyim?",
        a: "Şu an canlı ders kayıtları platforma eklenmemektedir, ancak bu özellik üzerinde çalışıyoruz. Gelişmelerden haberdar olmak için bültenimize kayıt olabilirsiniz.",
      },
    ],
  },
  {
    title: "Teknik Sorunlar",
    questions: [
      {
        q: "Sayfa yüklenmiyor veya hata alıyorum.",
        a: "Tarayıcınızın önbelleğini temizlemeyi (Ctrl+Shift+Delete) ve sayfayı yeniden yüklemeyi deneyin. Sorun devam ederse farklı bir tarayıcı kullanmayı deneyebilir veya bize iletisim sayfamızdan ulaşabilirsiniz.",
      },
      {
        q: "Hangi tarayıcılar destekleniyor?",
        a: "Chrome, Firefox, Safari ve Edge tarayıcılarının güncel sürümleri desteklenmektedir. En iyi deneyim için tarayıcınızı güncel tutmanızı öneriyoruz.",
      },
      {
        q: "Mobil cihazlardan kullanabilir miyim?",
        a: "Evet, platform tamamen responsive (duyarlı) tasarlanmıştır. Akıllı telefon ve tabletlerden sorunsuz kullanabilirsiniz.",
      },
    ],
  },
];

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border/50 rounded-[1.25rem] bg-card/40 backdrop-blur-sm overflow-hidden transition-colors hover:border-primary/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer group"
      >
        <span className="font-heading font-bold text-foreground pr-4 group-hover:text-primary transition-colors">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5">
          <p className="text-muted-foreground leading-relaxed text-sm font-medium">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SSSPage() {
  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-background overflow-hidden">
      {/* Decorative */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] z-0 pointer-events-none translate-x-1/3 -translate-y-1/3" />

      {/* Header */}
      <div className="relative border-b border-border/50 bg-card/60 backdrop-blur-md z-10">
        <div className="container max-w-4xl px-6 lg:px-12 py-12 mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
              <div className="relative z-10 h-14 w-14 rounded-2xl bg-primary-container border border-primary/20 flex items-center justify-center shadow-xl shadow-primary/10">
                <HelpCircle className="h-7 w-7 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                Sıkça Sorulan Sorular
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground text-lg font-medium mt-2 max-w-xl">
            Merak ettiklerinize hızlıca yanıt bulun. Sorunuz burada yoksa bize yazın.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container max-w-4xl px-6 lg:px-12 py-12 mx-auto space-y-12">

        {FAQ_SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-8 bg-primary rounded-full" />
              <h2 className="text-xl font-heading font-black text-foreground">
                {section.title}
              </h2>
            </div>
            <div className="space-y-3">
              {section.questions.map((faq) => (
                <AccordionItem key={faq.q} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        ))}

        {/* CTA - Hâlâ sorunuz mu var? */}
        <div className="rounded-[2rem] border border-primary/30 bg-primary-container/10 backdrop-blur-md p-8 lg:p-10 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-[1.25rem] flex items-center justify-center mb-6 border border-primary/20">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-heading font-black text-foreground mb-3">
            Aradığınız yanıtı bulamadınız mı?
          </h3>
          <p className="text-muted-foreground font-medium max-w-md mx-auto mb-6">
            Bize doğrudan yazın, en kısa sürede yardımcı olalım.
          </p>
          <Link href="/iletisim">
            <button className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-[#005a55] text-primary-foreground font-heading font-bold text-sm px-8 py-3.5 rounded-[1.25rem] shadow-[0_12px_24px_rgba(0,103,98,0.25)] hover:shadow-[0_16px_32px_rgba(0,103,98,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer">
              <Mail className="w-4 h-4" />
              İletişime Geç
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
