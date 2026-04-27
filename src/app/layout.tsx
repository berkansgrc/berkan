import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope, Caveat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FeedbackButton } from "@/components/ui/FeedbackButton";
import { LazyMotionProvider } from "@/components/providers/LazyMotionProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import PageTransition from "@/components/ui/PageTransition";
import "@/env"; // Çevre değişkenlerini başlangıçta doğrula

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const caveat = Caveat({
  variable: "--font-chalk",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://berkanmatematik.com'),
  title: {
    default: "Berkan Matematik - Yeni Nesil Matematik Platformu",
    template: "%s | Berkan Matematik",
  },
  description: "Matematiği sadece işlem olarak değil, düşüncenin mimarisi olarak öğreten interaktif ve modern eğitim platformu. 'Hata Güzeldir' mottosuyla öğrenmeyi yeniden keşfedin.",
  keywords: ["matematik", "online matematik", "yks matematik", "berkan matematik", "matematik eğitimi", "yeni nesil matematik", "interaktif eğitim"],
  authors: [{ name: "Berkan Sığırcı" }],
  creator: "Berkan Sığırcı",
  publisher: "Berkan Matematik",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://berkanmatematik.com",
    title: "Berkan Matematik - Yeni Nesil Matematik Platformu",
    description: "Matematiği sadece işlem olarak değil, düşüncenin mimarisi olarak öğreten interaktif ve modern eğitim platformu.",
    siteName: "Berkan Matematik",
  },
  twitter: {
    card: "summary_large_image",
    title: "Berkan Matematik - Yeni Nesil Matematik Platformu",
    description: "Matematiği sadece işlem olarak değil, düşüncenin mimarisi olarak öğreten interaktif ve modern eğitim platformu.",
    creator: "@berkansigirci",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${plusJakartaSans.variable} ${manrope.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col">
        <QueryProvider>
          <LazyMotionProvider>
            <Navbar />
            <main className="flex-1 flex flex-col pb-16 md:pb-0">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <FeedbackButton />
          </LazyMotionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
