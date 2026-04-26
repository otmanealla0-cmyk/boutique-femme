'use client'

import { useRouter } from 'next/navigation'

const FILTERS = [
  { value: '', label: 'Toutes' },
  { value: 'pending', label: 'En attente' },
  { value: 'paid', label: 'Payées' },
  { value: 'shipped', label: 'Expédiées' },
  { value: 'delivered', label: 'Livrées' },
  { value: 'cancelled', label: 'Annulées' },
]

interface Props {
  counts: Record<string, number>
  current: string
}

export default function OrderStatusFilter({ counts, current }: Props) {
  const router = useRouter()

  function select(value: string) {
    router.push(value ? `/admin/orders?status=${value}` : '/admin/orders')
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(f => {
        const count = f.value ? (counts[f.value] ?? 0) : total
        const active = current === f.value
        return (
          <button
            key={f.value}
            onClick={() => select(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              active
                ? 'bg-charcoal text-white border-charcoal'
                : 'bg-white text-nude-dark border-nude-medium hover:border-charcoal hover:text-charcoal'
            }`}
          >
            {f.label}
            <span className={`ml-1.5 text-xs ${active ? 'opacity-70' : 'opacity-60'}`}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
