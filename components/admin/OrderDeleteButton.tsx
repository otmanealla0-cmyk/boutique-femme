'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function OrderDeleteButton({ orderId }: { orderId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Commande supprimée')
      router.refresh()
    } else {
      toast.error('Erreur lors de la suppression')
      setLoading(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-600">Supprimer ?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? '...' : 'Oui'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs px-2 py-1 bg-nude-medium text-charcoal rounded hover:bg-nude-dark"
        >
          Non
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
      title="Supprimer la commande"
    >
      <Trash2 size={16} />
    </button>
  )
}
