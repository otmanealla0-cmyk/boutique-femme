import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductPageClient from '@/components/store/ProductPageClient'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'

const SITE_URL = 'https://dressbymee.shop'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id, active: true },
    include: { category: true },
  })
  if (!product) return {}

  const images = JSON.parse(product.images || '[]') as string[]
  const image = images[0] || '/og-image.jpg'
  const description = product.description
    ? product.description.slice(0, 155)
    : `${product.name} – ${product.category.name} disponible sur Dress By Me.`

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} | Dress By Me`,
      description,
      url: `${SITE_URL}/boutique/produits/${id}`,
      images: [{ url: image, alt: product.name }],
      type: 'website',
    },
    alternates: { canonical: `${SITE_URL}/boutique/produits/${id}` },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id, active: true },
    include: { category: true },
  })

  if (!product) notFound()

  const images = JSON.parse(product.images || '[]') as string[]
  const sizes = JSON.parse(product.sizes || '[]') as string[]
  const colors = JSON.parse(product.colors || '[]') as string[]
  const bagSizes = JSON.parse(product.bagSizes || '[]') as string[]
  const colorImages = JSON.parse(product.colorImages || '{}') as Record<string, string[]>

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      <Link href="/boutique/produits" className="inline-flex items-center gap-1 text-nude-dark hover:text-charcoal text-sm mb-6">
        <ChevronLeft size={16} />
        Retour à la boutique
      </Link>

      <ProductPageClient
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          hasBoxOption: product.hasBoxOption,
          categorySlug: product.category.slug,
          categoryName: product.category.name,
          description: product.description,
        }}
        images={images}
        sizes={sizes}
        colors={colors}
        bagSizes={bagSizes}
        colorImages={colorImages}
      />
    </div>
  )
}
