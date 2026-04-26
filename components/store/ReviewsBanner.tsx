'use client'

import { useEffect, useRef } from 'react'

const REVIEWS = [
  { name: 'Inès M.', text: 'Qualité incroyable pour le prix, je recommande les yeux fermés 🔥', stars: 5 },
  { name: 'Sabrina L.', text: 'Livraison rapide et le sac est encore plus beau en vrai 😍', stars: 5 },
  { name: 'Amira K.', text: 'Le colis était super bien emballé, j'adore ma robe !!', stars: 5 },
  { name: 'Lina B.', text: 'Top qualité, taille bien, je vais recommander c'est sûr', stars: 5 },
  { name: 'Yasmine R.', text: 'Je m'attendais pas à autant de qualité, franchement wow 🙌', stars: 5 },
  { name: 'Nour T.', text: 'Le sac est parfait, exactement comme sur les photos !', stars: 5 },
  { name: 'Sofia D.', text: 'Super boutique, service au top et les articles sont ouf 💅', stars: 5 },
]

function Stars({ n }: { n: number }) {
  return (
    <span className="text-yellow-400 text-xs tracking-tight">
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  )
}

export default function ReviewsBanner() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let pos = 0
    const speed = 0.5
    let raf: number

    function tick() {
      pos += speed
      if (pos >= track!.scrollWidth / 2) pos = 0
      track!.style.transform = `translateX(-${pos}px)`
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const doubled = [...REVIEWS, ...REVIEWS]

  return (
    <section className="bg-nude-base border-b border-nude-medium overflow-hidden py-5">
      <div className="flex items-center gap-4 mb-3 px-6">
        <span className="text-lg">🤳🏽</span>
        <p className="text-xs font-medium tracking-widest uppercase text-charcoal/60">Avis clients</p>
        <div className="flex-1 h-px bg-nude-medium" />
      </div>

      <div className="overflow-hidden">
        <div ref={trackRef} className="flex gap-4 w-max will-change-transform">
          {doubled.map((r, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-64 bg-white border border-nude-medium rounded-xl p-4 space-y-2"
            >
              <Stars n={r.stars} />
              <p className="text-xs text-charcoal/80 leading-relaxed line-clamp-2">&ldquo;{r.text}&rdquo;</p>
              <p className="text-[11px] font-semibold text-charcoal">{r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
