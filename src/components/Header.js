'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu, X, BookOpen, Calendar, Briefcase,
  FolderOpen, Users, ShoppingCart, LogIn, User, LayoutDashboard, Heart
} from 'lucide-react'
import Logo from './Logo'
import { supabase, getLocalCart, clearLocalCart, getCurrentUser, getCurrentUserRole } from '@/lib/supabase'

const navigation = [
  { name: 'Accueil', href: '/', icon: null },
  { name: 'Fondatrice', href: '/a-propos', icon: Heart },
  { name: 'Ebooks', href: '/ebooks', icon: BookOpen },
  { name: 'Services', href: '/services', icon: Briefcase },
  { name: 'Portfolio', href: '/portfolio', icon: FolderOpen },
  { name: 'Rendez-vous', href: '/rdv', icon: Calendar },
  { name: 'Communauté', href: '/communaute', icon: Users },
]

export default function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    const refresh = () => setCartCount(getLocalCart().length)
    const refreshAuth = async () => {
      const user = await getCurrentUser().catch(() => null)
      setIsLoggedIn(!!user)
      if (user) {
        const role = await getCurrentUserRole().catch(() => null)
        setIsAdmin(role === 'admin')
      } else {
        setIsAdmin(false)
      }
    }
    refresh()
    refreshAuth()
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        clearLocalCart()
        refresh()
      }
      refreshAuth()
      if (session) refresh()
    })
    window.addEventListener('scroll', onScroll)
    window.addEventListener('cart-updated', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      sub?.subscription?.unsubscribe?.()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('cart-updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-panel-strong shadow-premium-soft' : 'bg-white/35 backdrop-blur-md'
    }`}>
      <div className="hlb-shell">
        <div className="flex h-16 items-center justify-between gap-3">
          <Logo size={44} withText={false} />

          <nav className="hidden items-center gap-1 lg:flex">
            {navigation.map(item => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                    active
                      ? 'bg-violet-600 text-white shadow-glow'
                      : 'text-slate-600 hover:bg-white/80 hover:text-violet-700'
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link href="/panier" className="relative rounded-xl p-2 transition-colors hover:bg-white/80">
              <ShoppingCart className="h-5 w-5 text-slate-600" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-[10px] font-bold text-violet-950">
                  {cartCount}
                </span>
              )}
            </Link>
            {isLoggedIn ? (
              isAdmin ? (
                <Link href="/admin" className="premium-btn-secondary !px-3 !py-2 !text-sm !text-slate-900">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              ) : (
                <Link href="/mon-compte" className="premium-btn-secondary !px-3 !py-2 !text-sm">
                  <User className="h-4 w-4" />
                  <span>Mon compte</span>
                </Link>
              )
            ) : (
              <Link href="/login" className="premium-btn-primary !px-4 !py-2 !text-sm">
                <LogIn className="h-4 w-4" />
                <span>Connexion</span>
              </Link>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="rounded-2xl p-2.5 hover:bg-white/80 lg:hidden">
            {isOpen ? <X className="h-6 w-6 text-slate-600" /> : <Menu className="h-6 w-6 text-slate-600" />}
          </button>
        </div>
      </div>

      <div className={`absolute left-0 right-0 top-full transition-all lg:hidden ${
        isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
      }`}>
        <nav className="glass-panel-strong mx-4 mb-4 rounded-3xl p-4 shadow-premium">
          <div className="space-y-1">
            {navigation.map(item => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-medium ${
                    active ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-violet-50'
                  }`}
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
          <div className="mt-4 space-y-2 border-t border-slate-200/80 pt-4">
            <Link href="/panier" onClick={() => setIsOpen(false)} className="premium-btn-secondary w-full">
              <ShoppingCart className="h-5 w-5" />
              <span>Panier ({cartCount})</span>
            </Link>
            {isLoggedIn ? (
              isAdmin ? (
                <Link href="/admin" onClick={() => setIsOpen(false)} className="premium-btn-secondary w-full !text-slate-900">
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Admin</span>
                </Link>
              ) : (
                <Link href="/mon-compte" onClick={() => setIsOpen(false)} className="premium-btn-secondary w-full">
                  <User className="h-5 w-5" />
                  <span>Mon compte</span>
                </Link>
              )
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)} className="premium-btn-primary w-full">
                <LogIn className="h-5 w-5" />
                <span>Connexion</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
