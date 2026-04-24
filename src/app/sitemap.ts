import { MetadataRoute } from 'next';

const GRADES = [
  "5-sinif",
  "6-sinif",
  "7-sinif",
  "lgs",
  "9-sinif",
  "10-sinif",
  "11-sinif",
  "tyt-ayt",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://berkanmatematik.com';

  const staticRoutes = [
    '',
    '/iletisim',
    '/sss',
    '/kullanim-sartlari',
    '/gizlilik',
    '/login',
    '/register',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const gradeRoutes = GRADES.map((grade) => ({
    url: `${baseUrl}/sinif/${grade}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...gradeRoutes];
}
