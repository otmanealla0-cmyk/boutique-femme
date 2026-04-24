'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  LogOut,
  Store,
  Settings,
} from 'lucide-react'
import Logo from '@/components/Logo'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Produits', icon: Package },
  { href: '/admin/categories', label: 'Catégories', icon: Tag },
  { href: '/admin/orders', label: 'Commandes', icon: ShoppingBag },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings },
]

export default function AdminSidebar() {
  const path = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-nude-medium flex flex-col min-h-screen">
      <div className="p-6 border-b border-nude-medium flex justify-center">
        <Logo size="sm" />
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === '/admin' ? path === '/admin' : path.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`admin-sidebar-link ${active ? 'active' : 'text-charcoal'}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-nude-medium space-y-1">
        <Link
          href="/boutique"
          target="_blank"
          className="admin-sidebar-link text-charcoal"
        >
          <Store size={18} />
          Voir la boutique
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="admin-sidebar-link text-charcoal w-full"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
