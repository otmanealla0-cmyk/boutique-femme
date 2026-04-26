'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HeroCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(i => (i + 1) % images.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [images.length])

  if (images.length === 0) return null

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  return (
    <div className="relative w-56 h-64 sm:w-72 sm:h-80 md:w-96 md:h-[420px]">
      <div className="absolute inset-0 bg-rose-blush rounded-[40px] rotate-3" />
      <div className="absolute inset-2 rounded-[35px] overflow-hidden -rotate-1">
        {images.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <Image src={src} alt="Dress By Me" fill className="object-cover" priority={i === 0} />
          </div>
        ))}

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/70 rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/70 rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
            >
              <ChevronRight size={14} />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? 16 : 6,
                    height: 6,
                    background: i === current ? 'white' : 'rgba(255,255,255,0.5)',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
