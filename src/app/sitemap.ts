import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://sabrang.jklu.edu.in';
  const routes = [
    '',
    '/About',
    '/Events',
    '/Gallery',
    '/schedule/progress',
    '/Team',
    '/FAQ',
    '/why-sponsor-us',
    '/Contact',
  ];
  const now = new Date().toISOString();
  return routes.map((path) => ({
    url: `${base}${path || '/'}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));
}


