'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen, Briefcase, FolderOpen, Calendar, Megaphone, Users,
  BookText, Tag, Code, CreditCard, ShoppingCart, Layers,
  TrendingUp, DollarSign, Eye,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatFcfa } from '@/lib/money'

const cards = [
  { name: 'Ebooks', href: '/admin/ebooks', icon: BookOpen, color: 'from-violet-500 to-violet-700' },
  { name: 'Auteurs', href: '/admin/auteurs', icon: BookText, color: 'from-yellow-400 to-yellow-600' },
  { name: 'Catégories Ebooks', href: '/admin/categorie-eb', icon: Tag, color: 'from-pink-400 to-pink-600' },
  { name: 'Services', href: '/admin/services', icon: Briefcase, color: 'from-emerald-400 to-emerald-600' },
  { name: 'Projets', href: '/admin/projet', icon: FolderOpen, color: 'from-blue-400 to-blue-600' },
  { name: 'Catégories Projet', href: '/admin/categorie-pro', icon: Layers, color: 'from-indigo-400 to-indigo-600' },
  { name: 'Langages', href: '/admin/langages', icon: Code, color: 'from-cyan-400 to-cyan-600' },
  { name: 'Bande Info', href: '/admin/bande-info', icon: Megaphone, color: 'from-rose-400 to-rose-600' },
  { name: 'Utilisateurs', href: '/admin/utilisateurs', icon: Users, color: 'from-fuchsia-400 to-fuchsia-600' },
  { name: 'Paiements', href: '/admin/paiement', icon: CreditCard, color: 'from-green-400 to-green-600' },
  { name: 'Commandes payées', href: '/admin/panier', icon: ShoppingCart, color: 'from-orange-400 to-orange-600' },
  { name: 'Rendez-vous', href: '/admin/rdv', icon: Calendar, color: 'from-purple-400 to-purple-600' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: 'Revenus', value: '—', icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Ebooks publiés', value: '—', icon: BookOpen, color: 'bg-violet-500' },
    { label: 'Membres', value: '—', icon: Users, color: 'bg-yellow-500' },
  ])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [{ data: paiements }, ebooksRes, usersRes] = await Promise.all([
          supabase.from('paiement').select('montant').eq('statut', 'paid'),
          supabase.from('ebooks').select('id', { count: 'exact', head: true }).eq('statut', 'publie'),
          supabase.from('users').select('id', { count: 'exact', head: true }),
        ])
        const revenus = (paiements || []).reduce((s, p) => s + Number(p.montant || 0), 0)
        if (!cancelled) {
          setStats([
            { label: 'Revenus', value: formatFcfa(revenus), icon: DollarSign, color: 'bg-emerald-500' },
            { label: 'Ebooks publiés', value: String(ebooksRes.count ?? 0), icon: BookOpen, color: 'bg-violet-500' },
            { label: 'Membres', value: String(usersRes.count ?? 0), icon: Users, color: 'bg-yellow-500' },
          ])
        }
      } catch {
        if (!cancelled) {
          setStats([
            { label: 'Revenus', value: '—', icon: DollarSign, color: 'bg-emerald-500' },
            { label: 'Ebooks publiés', value: '—', icon: BookOpen, color: 'bg-violet-500' },
            { label: 'Membres', value: '—', icon: Users, color: 'bg-yellow-500' },
          ])
        }
      }
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Tableau de bord</h1>
        <p className="text-slate-500 mb-8">Gérez l'ensemble du contenu de Help Life Building</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-6 shadow flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center text-white`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-4">Tables de la base de données</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.map(c => (
            <Link key={c.href} href={c.href}
              className="group bg-white rounded-2xl p-5 shadow hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                <c.icon className="w-6 h-6" />
              </div>
              <p className="font-semibold text-slate-900">{c.name}</p>
              <p className="text-xs text-slate-500 mt-1">Gérer →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
