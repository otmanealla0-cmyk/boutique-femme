import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/store/AddToCartButton'
import ProductGallery from '@/components/store/ProductGallery'
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      <Link href="/boutique/produits" className="inline-flex items-center gap-1 text-nude-dark hover:text-charcoal text-sm mb-6">
        <ChevronLeft size={16} />
        Retour à la boutique
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <ProductGallery
          images={images}
          name={product.name}
          categorySlug={product.category.slug}
        />

        <div className="space-y-6">
          <div>
            <p className="text-sm text-rose-deep font-medium mb-1">{product.category.name}</p>
            <h1 className="text-2xl md:text-3xl font-playfair text-charcoal mb-3">{product.name}</h1>
            <p className="text-3xl md:text-4xl font-playfair font-bold text-rose-deep">{product.price.toFixed(2)} €</p>
          </div>

          {product.description && (
            <p className="text-charcoal/80 leading-relaxed">{product.description}</p>
          )}

          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: images[0] || '',
              sizes,
              colors,
              stock: product.stock,
            }}
          />

          <div className="border-t border-nude-medium pt-5 space-y-3 text-sm text-charcoal/70">
            <p>✓ Livraison entre 10 et 19j à domicile</p>
            <p>✓ Paiement sécurisé via SumUp</p>
            <p>✓ Retours acceptés sous 7 jours</p>
          </div>
        </div>
      </div>
    </div>
  )
}
