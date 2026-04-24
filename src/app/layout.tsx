import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope, Caveat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
  title: "Berkan Matematik - Modern Eğitim Platformu",
  description: "Öğrenciler için interaktif ve modern matematik eğitimi.",
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
        <Navbar />
        <main className="flex-1 flex flex-col pb-16 md:pb-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
