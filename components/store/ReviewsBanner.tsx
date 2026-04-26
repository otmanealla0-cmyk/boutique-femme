'use client'

const REVIEWS = [
  { name: 'Inès M.', text: 'Qualité incroyable pour le prix, je recommande les yeux fermés 🔥', stars: 5 },
  { name: 'Sabrina L.', text: 'Livraison rapide et le sac est encore plus beau en vrai 😍', stars: 5 },
  { name: 'Amira K.', text: "Le colis était super bien emballé, j'adore ma robe !!", stars: 5 },
  { name: 'Lina B.', text: "Top qualité, taille bien, je vais recommander c'est sûr", stars: 5 },
  { name: 'Yasmine R.', text: "Je m'attendais pas à autant de qualité, franchement wow 🙌", stars: 5 },
  { name: 'Nour T.', text: 'Le sac est parfait, exactement comme sur les photos !', stars: 5 },
  { name: 'Sofia D.', text: 'Super boutique, service au top et les articles sont ouf 💅', stars: 5 },
]

export default function ReviewsBanner() {
  const doubled = [...REVIEWS, ...REVIEWS]

  return (
    <section className="bg-nude-base border-b border-nude-medium py-5">
      {/* Titre */}
      <div className="flex items-center gap-3 px-6 mb-4">
        <span className="text-xl">🤳🏽</span>
        <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/50">Avis clients</p>
        <div className="flex-1 h-px bg-nude-medium" />
      </div>

      {/* Défilement CSS */}
      <div className="overflow-hidden">
        <div
          className="flex gap-4"
          style={{
            width: 'max-content',
            animation: 'marquee 30s linear infinite',
          }}
        >
          {doubled.map((r, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-64 bg-white border border-nude-medium rounded-xl p-4 space-y-2 shadow-sm"
            >
              <p className="text-yellow-400 text-sm tracking-tight">{'★'.repeat(r.stars)}</p>
              <p className="text-xs text-charcoal/80 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
              <p className="text-[11px] font-semibold text-charcoal">{r.name}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
