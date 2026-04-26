'use client'

import { useState } from 'react'
import ProductGallery from './ProductGallery'
import AddToCartButton from './AddToCartButton'

interface Props {
  product: {
    id: string
    name: string
    price: number
    stock: number
    hasBoxOption: boolean
    categorySlug: string
    categoryName: string
    description: string
  }
  images: string[]
  sizes: string[]
  colors: string[]
  bagSizes: string[]
  colorImages: Record<string, string[]>
}

export default function ProductPageClient({ product, images, sizes, colors, bagSizes, colorImages }: Props) {
  const [selectedColor, setSelectedColor] = useState(colors[0] || '')

  const displayImages =
    selectedColor && colorImages[selectedColor]?.length > 0
      ? colorImages[selectedColor]
      : images

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
      <ProductGallery
        key={selectedColor}
        images={displayImages}
        name={product.name}
        categorySlug={product.categorySlug}
      />

      <div className="space-y-6">
        <div>
          <p className="text-sm text-rose-deep font-medium mb-1">{product.categoryName}</p>
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
            image: displayImages[0] || '',
            sizes,
            colors,
            bagSizes,
            hasBoxOption: product.hasBoxOption,
            stock: product.stock,
          }}
          initialColor={selectedColor}
          onColorChange={setSelectedColor}
        />

        <div className="border-t border-nude-medium pt-5 space-y-3 text-sm text-charcoal/70">
          <p>✓ Livraison entre 10 et 19j à domicile</p>
          <p>✓ Paiement sécurisé via SumUp</p>
          <p>✓ Retours acceptés sous 7 jours</p>
        </div>
      </div>
    </div>
  )
}
