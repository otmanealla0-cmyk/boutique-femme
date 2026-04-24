'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const statuses = [
  { value: 'pending', label: 'En attente' },
  { value: 'paid', label: 'Payée' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
]

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const [status, setStatus] = useState(currentStatus)
  const router = useRouter()

  async function handleChange(newStatus: string) {
    setStatus(newStatus)
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      toast.success('Statut mis à jour')
      router.refresh()
    } else {
      toast.error('Erreur')
      setStatus(currentStatus)
    }
  }

  return (
    <select
      value={status}
      onChange={e => handleChange(e.target.value)}
      className="mt-1 text-sm border border-nude-medium rounded-lg px-2 py-1 text-charcoal
                 focus:outline-none focus:ring-1 focus:ring-rose-soft bg-white"
    >
      {statuses.map(s => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  )
}
