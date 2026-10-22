import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/boutique/commande', '/boutique/confirmation'],
      },
    ],
    sitemap: 'https://dressbymee.shop/sitemap.xml',
  }
}
