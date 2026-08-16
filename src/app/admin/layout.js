'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, Briefcase, FolderOpen, Calendar,
  Megaphone, Users, LogOut, BookText, Tag, Code, CreditCard, ShoppingCart, Layers, Menu, X
} from 'lucide-react'
import { supabase, signOut } from '@/lib/supabase'
import Logo from '@/components/Logo'

const menu = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Ebooks', href: '/admin/ebooks', icon: BookOpen },
  { name: 'Auteurs', href: '/admin/auteurs', icon: BookText },
  { name: 'Catégories Ebooks', href: '/admin/categorie-eb', icon: Tag },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Projets', href: '/admin/projet', icon: FolderOpen },
  { name: 'Catégories Projet', href: '/admin/categorie-pro', icon: Layers },
  { name: 'Langages', href: '/admin/langages', icon: Code },
  { name: 'Bande Info', href: '/admin/bande-info', icon: Megaphone },
  { name: 'Utilisateurs', href: '/admin/utilisateurs', icon: Users },
  { name: 'Paiements', href: '/admin/paiement', icon: CreditCard },
  { name: 'Panier', href: '/admin/panier', icon: ShoppingCart },
  { name: 'Rendez-vous', href: '/admin/rdv', icon: Calendar },
]

export default function AdminLayout({ children }) {
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      router.push('/login')
      router.refresh()
    } catch {
      setSigningOut(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (cancelled) return
      if (!user) {
        router.push('/login')
        return
      }
      const { data: urow } = await supabase.from('users').select('role').eq('id', user.id).maybeSingle()
      if (cancelled) return
      if (urow?.role !== 'admin') {
        router.push('/mon-compte')
        return
      }
      setLoading(false)
    }
    check()
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return
      if (!session) router.push('/login')
    })
    return () => {
      cancelled = true
      sub?.subscription?.unsubscribe?.()
    }
  }, [router])

  if (loading) return <div className="flex h-screen items-center justify-center text-slate-500">Vérification...</div>

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 px-4 flex items-center justify-between border-b border-slate-800">
          <div className="bg-white rounded-lg px-2 py-1"><Logo size={32} /></div>
          <button onClick={() => setOpen(false)} className="lg:hidden"><X className="w-5 h-5" /></button>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-9rem)]">
          {menu.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active ? 'bg-violet-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}>
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm disabled:opacity-60"
          >
            <LogOut className="w-4 h-4" />
            <span>{signingOut ? 'Déconnexion...' : 'Déconnexion'}</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-0">
        <div className="lg:hidden p-4 bg-white shadow flex items-center justify-between">
          <button onClick={() => setOpen(true)}><Menu className="w-6 h-6" /></button>
          <Logo size={32} withText={false} />
        </div>
        <main>{children}</main>
      </div>
    </div>
  )
}
