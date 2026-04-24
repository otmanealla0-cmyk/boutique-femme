'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AccountLogout() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/customer/logout', { method: 'POST' })
    toast.success('Déconnecté')
    router.push('/boutique')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm text-nude-dark hover:text-rose-deep transition-colors"
    >
      <LogOut size={16} />
      Se déconnecter
    </button>
  )
}
