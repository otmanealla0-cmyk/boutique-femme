'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  images: string[]
  name: string
  categorySlug: string
}

const categoryEmoji: Record<string, string> = {
  sacs: '👜', chaussures: '👠', bijoux: '💍', 'maillots-de-bain': '👙', vetements: '👗',
}

export default function ProductGallery({ images, name, categorySlug }: Props) {
  const [current, setCurrent] = useState(0)
  const startX = useRef(0)
  const isDragging = useRef(false)

  function prev() { setCurrent(i => (i === 0 ? images.length - 1 : i - 1)) }
  function next() { setCurrent(i => (i === images.length - 1 ? 0 : i + 1)) }

  function onTouchStart(e: React.TouchEvent) { startX.current = e.touches[0].clientX }
  function onTouchEnd(e: React.TouchEvent) {
    const diff = startX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
  }

  function onMouseDown(e: React.MouseEvent) {
    isDragging.current = true
    startX.current = e.clientX
  }
  function onMouseUp(e: React.MouseEvent) {
    if (!isDragging.current) return
    isDragging.current = false
    const diff = startX.current - e.clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
  }
  function onMouseLeave() { isDragging.current = false }

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] rounded-2xl bg-nude-base flex items-center justify-center text-8xl text-nude-dark">
        {categoryEmoji[categorySlug] || '👗'}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Carrousel */}
      <div
        className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-nude-base select-none cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(${(i - current) * 100}%)` }}
          >
            <Image
              src={img}
              alt={`${name} ${i + 1}`}
              fill
              className="object-cover"
              draggable={false}
              priority={i === 0}
            />
          </div>
        ))}

        {/* Flèches */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
            >
              <ChevronLeft size={18} className="text-charcoal" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
            >
              <ChevronRight size={18} className="text-charcoal" />
            </button>
          </>
        )}

        {/* Compteur */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 bg-black/40 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
            {current + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Points */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-2 bg-rose-deep' : 'w-2 h-2 bg-nude-medium hover:bg-nude-dark'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
