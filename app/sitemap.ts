import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const SITE_URL = 'https://dressbymee.shop'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where: { active: true }, select: { id: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true } }),
  ])

  const staticPages = [
    { url: SITE_URL, priority: 1.0 },
    { url: `${SITE_URL}/boutique/produits`, priority: 0.9 },
    { url: `${SITE_URL}/boutique/cgv`, priority: 0.3 },
    { url: `${SITE_URL}/boutique/mentions-legales`, priority: 0.3 },
    { url: `${SITE_URL}/boutique/confidentialite`, priority: 0.3 },
  ].map(p => ({ ...p, lastModified: new Date(), changeFrequency: 'weekly' as const }))

  const categoryPages = categories.map(c => ({
    url: `${SITE_URL}/boutique/produits?cat=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const productPages = products.map(p => ({
    url: `${SITE_URL}/boutique/produits/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...categoryPages, ...productPages]
}
