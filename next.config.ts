import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "ibb.co" },
    ],
  },
  experimental: {
    // Lucide-react ve diğer büyük paketlerin sadece kullanılan ikonları yüklemesi
    optimizePackageImports: [
        "lucide-react",
        "@supabase/supabase-js",
        "@supabase/ssr",
        "@base-ui/react",
      ],
  },
};

// Sentry entegrasyonu — DSN yoksa sessizce devre dışı kalır
export default withSentryConfig(nextConfig, {
  // Source map'leri Sentry'ye yükle (hata izleme için)
  silent: true,

  // Source map'leri gizle
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
