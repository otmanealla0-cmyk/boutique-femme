import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductPageClient from '@/components/store/ProductPageClient'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

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
