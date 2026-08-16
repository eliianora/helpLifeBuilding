'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, ShoppingCart, ArrowLeft, LogOut, User as UserIcon } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase, requireUser, listPurchasedEbooks } from '@/lib/supabase'

export default function MonComptePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ achetes: 0, lus: 0, progressionMoy: 0 })
  const [purchasedEbooks, setPurchasedEbooks] = useState([])
  const [progress, setProgress] = useState([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const u = await requireUser()
        if (cancelled) return
        setUser(u)

        // Achats
        const { data: achats } = await supabase
          .from('ebook_achats')
          .select('ebook_id')
          .eq('utilisateur_id', u.id)

        const ebooksAchetes = await listPurchasedEbooks(u.id).catch(() => [])

        // Progression
        const { data: prog } = await supabase
          .from('ebook_progress')
          .select('ebook_id,page,percent,total_pages,updated_at')
          .eq('utilisateur_id', u.id)
          .order('updated_at', { ascending: false })

        const achetes = (achats || []).length
        const lus = (prog || []).filter(p => Number(p.percent || 0) >= 100).length
        const progressionMoy = prog?.length
          ? Math.round((prog.reduce((s, p) => s + Number(p.percent || 0), 0) / prog.length))
          : 0

        if (!cancelled) {
          setStats({ achetes, lus, progressionMoy })
          setProgress(prog || [])
          setPurchasedEbooks(ebooksAchetes)
        }
      } catch (_) {
        router.push('/login')
        return
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [router])

  const email = useMemo(() => user?.email || '', [user])

  return (
    <div className="min-h-screen page-ambient">
      <Header />
      <main className="pt-28 pb-16 max-w-6xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-violet-600 mb-6">
          <ArrowLeft className="w-4 h-4" /> Accueil
        </Link>

        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center">
                <UserIcon className="w-7 h-7 text-violet-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Mon compte</h1>
                <p className="text-slate-500 text-sm">{email}</p>
              </div>
            </div>
            <Link href="/deconnexion" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50">
              <LogOut className="w-4 h-4" /> Déconnexion
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-600 text-white flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Ebooks achetés</p>
              <p className="text-2xl font-bold text-slate-900">{loading ? '—' : stats.achetes}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Ebooks lus (100%)</p>
              <p className="text-2xl font-bold text-slate-900">{loading ? '—' : stats.lus}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500 text-white flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Progression moyenne</p>
              <p className="text-2xl font-bold text-slate-900">{loading ? '—' : `${stats.progressionMoy}%`}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Mes ebooks</h2>
            <Link href="/ebooks" className="text-sm font-medium text-violet-700 hover:text-violet-800">
              Catalogue →
            </Link>
          </div>

          {loading ? (
            <div className="text-slate-500">Chargement...</div>
          ) : purchasedEbooks.length === 0 ? (
            <div className="text-slate-500">
              Aucun ebook acheté pour le moment. Parcourez le catalogue puis validez votre panier.
            </div>
          ) : (
            <div className="space-y-4">
              {purchasedEbooks.map(ebook => (
                <div key={ebook.id} className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{ebook.titre}</div>
                    {ebook.auteur && <p className="text-sm text-slate-500">Par {ebook.auteur}</p>}
                  </div>
                  <Link
                    href={`/ebooks/${ebook.id}/lecture`}
                    className="premium-btn-primary !px-4 !py-2.5 !text-sm"
                  >
                    <BookOpen className="w-4 h-4" /><span>Lire</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Ma progression</h2>
            <Link href="/ebooks" className="text-sm font-medium text-violet-700 hover:text-violet-800">
              Voir les ebooks →
            </Link>
          </div>

          {loading ? (
            <div className="text-slate-500">Chargement...</div>
          ) : progress.length === 0 ? (
            <div className="text-slate-500">
              Aucune progression enregistrée pour le moment. Ouvre un ebook et commence à lire.
            </div>
          ) : (
            <div className="space-y-4">
              {progress.slice(0, 10).map(p => (
                <div key={`${p.ebook_id}`} className="p-4 rounded-2xl bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-slate-900">Ebook #{p.ebook_id}</div>
                    <div className="text-sm text-slate-600">{Number(p.percent || 0)}%</div>
                  </div>
                  <div className="h-2 bg-violet-100 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-600" style={{ width: `${Number(p.percent || 0)}%` }} />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Page {p.page || 1} / {p.total_pages || '—'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

