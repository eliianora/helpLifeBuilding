'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Star, ShoppingCart, Heart, ArrowLeft, BookOpen } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChatbotVendeur from '@/components/ChatbotVendeur'
import { addToLocalCart, getCurrentUser, getPurchasedEbookIds, supabase } from '@/lib/supabase'
import { formatFcfa } from '@/lib/money'

export default function EbooksPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Toutes')
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [ebooks, setEbooks] = useState([])
  const [categories, setCategories] = useState(['Toutes'])

  const [purchasedIds, setPurchasedIds] = useState(new Set())

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const user = await getCurrentUser().catch(() => null)
      if (!user || cancelled) {
        if (!cancelled) setPurchasedIds(new Set())
        return
      }
      try {
        const ids = await getPurchasedEbookIds(user.id)
        if (!cancelled) setPurchasedIds(ids)
      } catch {
        if (!cancelled) setPurchasedIds(new Set())
      }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true); setError('')
      try {
        const [{ data: cats }, { data: eb, error: e2 }] = await Promise.all([
          supabase.from('categorie_eb').select('id,nom').order('nom', { ascending: true }),
          supabase
            .from('ebooks')
            .select('id,titre,description,prix,image_url,auteur,notation,nombre_avis,ventes,bestseller,statut,categorie_eb(nom)')
            .eq('statut', 'publie')
            .order('created_at', { ascending: false }),
        ])
        if (e2) throw e2

        const catNames = (cats || []).map(c => c.nom).filter(Boolean)
        const mapped = (eb || []).map(x => ({
          id: x.id,
          titre: x.titre,
          description: x.description,
          prix: x.prix,
          prixOriginal: x.prix_original,
          image_url: x.image_url,
          auteur: x.auteur,
          notation: x.notation,
          avis: x.nombre_avis,
          ventes: x.ventes,
          bestseller: x.bestseller,
          categorie: x.categorie_eb?.nom || 'Sans catégorie',
          statut: x.statut,
        }))

        if (!cancelled) {
          setCategories(['Toutes', ...catNames])
          setEbooks(mapped)
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Erreur de chargement')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const filteredEbooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return ebooks.filter(ebook => {
      const matchesSearch = !q || (ebook.titre || '').toLowerCase().includes(q)
      const matchesCategory = selectedCategory === 'Toutes' || ebook.categorie === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [ebooks, searchQuery, selectedCategory])

  const addToCart = async (ebook) => {
    const user = await getCurrentUser().catch(() => null)
    if (!user) {
      router.push('/login')
      return
    }
    addToLocalCart(ebook)
    setCart([...cart, ebook])
  }

  const goRead = async (ebookId) => {
    const user = await getCurrentUser().catch(() => null)
    if (!user) {
      router.push('/login')
      return
    }
    router.push(`/ebooks/${ebookId}/lecture`)
  }

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className="min-h-screen page-ambient">
      <Header />
      <main className="relative z-10 pt-24 pb-16">
        <div className="hlb-shell">
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-violet-600 mb-4">
              <ArrowLeft className="w-4 h-4" /><span>Retour</span>
            </Link>
            <h1 className="section-title mb-4">Nos <span className="brand-gradient-text">Ebooks</span></h1>
            <p className="section-subtitle">Explorez notre collection d&apos;ebooks premium.</p>
            <p className="mt-3 text-sm text-slate-500">
              Après achat, ouvrez un titre avec <span className="font-medium text-slate-700">Lire</span> ou retrouvez-le dans <Link href="/mon-compte" className="font-medium text-violet-700 hover:text-violet-800">Mon compte</Link>.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" placeholder="Rechercher un ebook..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-100 focus:bg-white focus:ring-2 focus:ring-violet-300 outline-none transition-all" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${selectedCategory === cat ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 rounded w-full" />
                    <div className="h-3 bg-slate-200 rounded w-5/6" />
                    <div className="h-10 bg-slate-200 rounded" />
                  </div>
                </div>
              ))
            ) : filteredEbooks.map(ebook => (
              <div key={ebook.id} className="group premium-card-hover overflow-hidden">
                <Link href={`/ebooks/${ebook.id}`} className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-6xl">
                  {ebook.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ebook.image_url} alt={ebook.titre || 'Ebook'} className="w-full h-full object-cover" />
                  ) : (
                    <span>📘</span>
                  )}
                  {ebook.bestseller && <span className="absolute top-4 left-4 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">BESTSELLER</span>}
                  <button onClick={(e) => { e.preventDefault(); toggleFavorite(ebook.id) }} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
                    <Heart className={`w-5 h-5 ${favorites.includes(ebook.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                  </button>
                </Link>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="premium-badge">{ebook.categorie}</span>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" /><span className="text-sm font-medium">{ebook.notation}</span>
                      <span className="text-slate-400 text-sm">({ebook.avis})</span>
                    </div>
                  </div>
                  <Link href={`/ebooks/${ebook.id}`}>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">{ebook.titre}</h3>
                  </Link>
                  <p className="text-slate-600 text-sm mb-4">{ebook.description}</p>
                  <p className="text-slate-500 text-sm mb-4">Par {ebook.auteur}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-violet-600">{formatFcfa(ebook.prix)}</span>
                      {ebook.prixOriginal && <span className="ml-2 text-slate-400 line-through">{formatFcfa(ebook.prixOriginal)}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {purchasedIds.has(String(ebook.id)) ? (
                        <button onClick={() => goRead(ebook.id)} className="premium-btn-primary !px-4 !py-2.5 !text-sm">
                          <BookOpen className="w-4 h-4" /><span>Lire</span>
                        </button>
                      ) : (
                        <button onClick={() => addToCart(ebook)} className="premium-btn-primary !px-4 !py-2.5 !text-sm">
                          <ShoppingCart className="w-4 h-4" /><span>Acheter</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!loading && filteredEbooks.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-slate-500">Aucun ebook trouvé pour votre recherche.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ChatbotVendeur />
    </div>
  )
}
