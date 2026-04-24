export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const heroSetting = await prisma.setting.findUnique({ where: { key: 'hero_image' } })
  const heroImage = heroSetting?.value || '/hero.jpg'

  const featured = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: { category: true },
    take: 4,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-boutique">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-20 flex flex-col md:flex-row items-center gap-8 md:gap-10">
          <div className="flex-1 text-center md:text-left order-2 md:order-1">
            <p className="text-rose-deep text-xs font-medium tracking-widest uppercase mb-3">
              Nouvelle collection
            </p>
            <h1 className="text-4xl md:text-6xl font-playfair text-charcoal leading-tight mb-4 md:mb-6">
              Mode & Élégance<br />
              <span className="italic text-rose-deep text-2xl md:text-3xl">pour dead tes outfits</span>
            </h1>
            <p className="text-nude-dark text-base md:text-lg mb-6 md:mb-8 max-w-md mx-auto md:mx-0">
              Retrouve ici tes pépites du moment à prix doux
            </p>
            <Link href="/boutique/produits" className="btn-primary inline-flex items-center gap-2">
              Découvrir la boutique
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="flex-1 flex justify-center order-1 md:order-2">
            <div className="relative w-56 h-64 sm:w-72 sm:h-80 md:w-96 md:h-[420px]">
              <div className="absolute inset-0 bg-rose-blush rounded-[40px] rotate-3" />
              <div className="absolute inset-2 rounded-[35px] overflow-hidden -rotate-1">
                <Image
                  src={heroImage}
                  alt="Dress By Me"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Produits mis en avant */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-12 md:pb-16">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-playfair text-charcoal">
              Best Sellers
            </h2>
            <Link href="/boutique/produits" className="text-rose-deep text-sm font-medium hover:underline flex items-center gap-1">
              Tout voir <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {featured.map(product => {
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
                          {product.category.slug === 'sacs' ? '👜' : '👗'}
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="badge bg-rose-blush text-rose-dark text-[10px] px-2 py-0.5">
                          ★ Best Seller
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-nude-dark mb-0.5">{product.category.name}</p>
                      <h3 className="font-medium text-charcoal text-sm group-hover:text-rose-deep transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="font-playfair font-bold text-rose-deep mt-1 text-sm md:text-base">{product.price.toFixed(2)} €</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {featured.length === 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-12 text-center">
          <div className="bg-nude-base rounded-3xl p-10 md:p-16">
            <div className="text-6xl mb-4">🛍️</div>
            <h2 className="text-2xl font-playfair text-charcoal mb-3">La boutique s&apos;habille...</h2>
            <p className="text-nude-dark mb-6">Les produits arrivent bientôt !</p>
          </div>
        </section>
      )}

      {/* Bannière valeurs */}
      <section className="bg-rose-blush py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 text-center">
          {[
            { icon: '🚚', title: 'Livraison', desc: 'Entre 10 et 19j à domicile' },
            { icon: '💳', title: 'Paiement sécurisé', desc: 'Via SumUp – 100% sécurisé' },
            { icon: '↩️', title: 'Retours faciles', desc: '7 jours pour changer d\'avis' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex md:flex-col items-center md:items-center gap-4 md:gap-0">
              <div className="text-3xl md:mb-3">{icon}</div>
              <div className="text-left md:text-center">
                <h3 className="font-playfair font-semibold text-charcoal mb-0.5 md:mb-1">{title}</h3>
                <p className="text-sm text-charcoal/70">{desc}</p>
              </div>
            </div>
          ))}
          <div className="flex md:flex-col items-center md:items-center gap-4 md:gap-0">
            <div className="text-3xl md:mb-3">💬</div>
            <div className="text-left md:text-center">
              <h3 className="font-playfair font-semibold text-charcoal mb-1 md:mb-2">Nous contacter</h3>
              <p className="text-sm text-charcoal/70 flex items-center md:justify-center gap-1">
                <span>👻</span> shopluxe31
              </p>
              <p className="text-sm text-charcoal/70 flex items-center md:justify-center gap-1 mt-0.5">
                <span>✉️</span> dressbymee@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
