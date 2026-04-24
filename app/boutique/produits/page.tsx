export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: { cat?: string; q?: string }
}) {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.product.findMany({
      where: {
        active: true,
        ...(searchParams.cat
          ? { category: { slug: searchParams.cat } }
          : {}),
        ...(searchParams.q
          ? { name: { contains: searchParams.q } }
          : {}),
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-5 md:mb-8">
        <h1 className="text-3xl font-playfair text-charcoal">
          {searchParams.cat
            ? categories.find(c => c.slug === searchParams.cat)?.name || 'Boutique'
            : 'Toute la boutique'}
        </h1>
        <p className="text-nude-dark mt-1">{products.length} article(s)</p>
      </div>

{products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛍️</div>
          <p className="text-nude-dark">Aucun produit dans cette catégorie pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map(product => {
            const images = JSON.parse(product.images || '[]') as string[]
            return (
              <Link key={product.id} href={`/boutique/produits/${product.id}`} className="group">
                <div className="card overflow-hidden">
                  <div className="aspect-[3/4] bg-nude-base relative overflow-hidden">
                    {images[0] ? (
                      <Image
                        src={images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl text-nude-dark">
                        {product.category.slug === 'sacs' ? '👜' : product.category.slug === 'chaussures' ? '👠' : product.category.slug === 'bijoux' ? '💍' : product.category.slug === 'maillots-de-bain' ? '👙' : '👗'}
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="badge bg-gray-200 text-gray-600">Épuisé</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-nude-dark">{product.category.name}</p>
                    <h3 className="font-medium text-charcoal text-sm mt-0.5 group-hover:text-rose-deep transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="font-playfair font-bold text-rose-deep mt-1">{product.price.toFixed(2)} €</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
