'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Star, ShoppingCart, BookOpen, Lock, Sparkles,
  Users, ShieldCheck, Share2, Check, TrendingUp,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChatbotVendeur from '@/components/ChatbotVendeur'
import { formatFcfa } from '@/lib/money'
import {
  getCurrentUser,
  getPurchasedEbookIds,
  getPublicEbook,
  getFreeExcerpt,
  listRelatedEbooks,
  addToLocalCart,
  getProgress,
} from '@/lib/supabase'

export default function FicheEbookPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [ebook, setEbook] = useState(null)
  const [user, setUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [isPurchased, setIsPurchased] = useState(false)
  const [progress, setProgress] = useState(null)
  const [related, setRelated] = useState([])
  const [addedToCart, setAddedToCart] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setNotFound(false)
      try {
        const data = await getPublicEbook(id)
        if (cancelled) return
        setEbook(data)
        setProgress(getProgress(id))
        listRelatedEbooks(data?.categorie_eb?.nom, id, 3)
          .then(list => { if (!cancelled) setRelated(list) })
          .catch(() => {})
      } catch (e) {
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setCheckingAuth(true)
      const currentUser = await getCurrentUser().catch(() => null)
      if (cancelled) return
      setUser(currentUser)
      if (currentUser) {
        try {
          const ids = await getPurchasedEbookIds(currentUser.id)
          if (!cancelled) setIsPurchased(ids.has(String(id)))
        } catch {
          if (!cancelled) setIsPurchased(false)
        }
      } else if (!cancelled) {
        setIsPurchased(false)
      }
      if (!cancelled) setCheckingAuth(false)
    })()
    return () => { cancelled = true }
  }, [id])

  const excerpt = useMemo(() => (ebook ? getFreeExcerpt(ebook) : null), [ebook])
  const categorie = ebook?.categorie_eb?.nom || 'Sans catégorie'
  const discount = ebook?.prix_original && ebook.prix_original > ebook.prix
    ? Math.round(100 - (ebook.prix / ebook.prix_original) * 100)
    : 0

  const handleAddToCart = () => {
    if (!user) {
      router.push(`/login?next=/ebooks/${id}`)
      return
    }
    addToLocalCart({ id: ebook.id, titre: ebook.titre, prix: ebook.prix, image_url: ebook.image_url })
    setAddedToCart(true)
  }

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    try {
      if (navigator.share) {
        await navigator.share({ title: ebook?.titre, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {}
  }

  if (loading) {
    return (
      <div className="min-h-screen page-ambient">
        <Header />
        <main className="relative z-10 pt-24 pb-16">
          <div className="hlb-shell">
            <div className="grid lg:grid-cols-[380px_1fr] gap-10 animate-pulse">
              <div className="h-96 bg-slate-200 rounded-3xl" />
              <div className="space-y-4">
                <div className="h-6 bg-slate-200 rounded w-1/3" />
                <div className="h-10 bg-slate-200 rounded w-2/3" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-5/6" />
                <div className="h-12 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (notFound || !ebook) {
    return (
      <div className="min-h-screen page-ambient">
        <Header />
        <main className="relative z-10 pt-24 pb-16">
          <div className="hlb-shell text-center py-16">
            <h1 className="section-title mb-4">Ebook introuvable</h1>
            <p className="section-subtitle mb-8">Ce titre n&apos;existe pas ou n&apos;est plus disponible.</p>
            <Link href="/ebooks" className="premium-btn-primary !inline-flex">
              <ArrowLeft className="w-4 h-4" /><span>Retour aux ebooks</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen page-ambient">
      <Header />
      <main className="relative z-10 pt-24 pb-16">
        <div className="hlb-shell">
          <Link href="/ebooks" className="inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-violet-600 mb-8">
            <ArrowLeft className="w-4 h-4" /><span>Retour aux ebooks</span>
          </Link>

          {/* Hero */}
          <div className="grid lg:grid-cols-[380px_1fr] gap-10 mb-16">
            <div className="relative h-96 lg:h-full rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-7xl">
              {ebook.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ebook.image_url} alt={ebook.titre} className="w-full h-full object-cover" />
              ) : (
                <span>📘</span>
              )}
              {ebook.bestseller && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">BESTSELLER</span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="premium-badge">{categorie}</span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium text-slate-700">{ebook.notation || 0}</span>
                  <span className="text-slate-400 text-sm">({ebook.nombre_avis || 0} avis)</span>
                </div>
                {ebook.ventes > 0 && (
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <Users className="w-4 h-4" /><span>{ebook.ventes} lecteurs</span>
                  </div>
                )}
              </div>

              <h1 className="section-title mb-2">{ebook.titre}</h1>
              <p className="text-slate-500 mb-6">Par <span className="font-medium text-slate-700">{ebook.auteur || 'Help Life Building'}</span></p>

              <p className="text-slate-600 leading-relaxed mb-8">{ebook.description}</p>

              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl font-bold text-violet-600">{formatFcfa(ebook.prix)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-slate-400 line-through">{formatFcfa(ebook.prix_original)}</span>
                    <span className="px-2 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-bold">-{discount}%</span>
                  </>
                )}
              </div>

              {/* CTA selon l'état de connexion / achat */}
              <div className="glass-panel rounded-2xl p-5 mb-6">
                {checkingAuth ? (
                  <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                ) : isPurchased ? (
                  <div>
                    {progress?.percent > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-slate-600 mb-2">
                          <span>Votre progression</span><span>{progress.percent}%</span>
                        </div>
                        <div className="h-2 bg-violet-100 rounded-full overflow-hidden">
                          <div className="h-full brand-gradient" style={{ width: `${progress.percent}%` }} />
                        </div>
                      </div>
                    )}
                    <button onClick={() => router.push(`/ebooks/${id}/lecture`)} className="premium-btn-primary w-full sm:w-auto">
                      <BookOpen className="w-4 h-4" /><span>{progress?.percent > 0 ? 'Continuer la lecture' : 'Commencer la lecture'}</span>
                    </button>
                  </div>
                ) : user ? (
                  <div className="flex flex-wrap gap-3">
                    <button onClick={handleAddToCart} className="premium-btn-primary">
                      {addedToCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                      <span>{addedToCart ? 'Ajouté au panier' : 'Ajouter au panier'}</span>
                    </button>
                    {addedToCart && (
                      <Link href="/panier" className="premium-btn-secondary">
                        <span>Voir mon panier</span>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-wrap gap-3 mb-3">
                      <Link href={`/login?next=/ebooks/${id}`} className="premium-btn-primary">
                        <ShoppingCart className="w-4 h-4" /><span>Se connecter pour acheter</span>
                      </Link>
                      <Link href="/inscription" className="premium-btn-secondary">
                        <span>Créer un compte</span>
                      </Link>
                    </div>
                    <p className="text-sm text-slate-500">Pas encore convaincu(e) ? Lisez l&apos;extrait gratuit ci-dessous, sans inscription.</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-violet-500" /><span>Paiement sécurisé</span></div>
                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-violet-500" /><span>Lecture en ligne, suivi de progression</span></div>
                <button onClick={handleShare} className="flex items-center gap-2 hover:text-violet-600 transition-colors">
                  <Share2 className="w-4 h-4" /><span>{copied ? 'Lien copié !' : 'Partager'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Extrait gratuit */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-violet-500" />
              <h2 className="text-2xl font-bold text-slate-900">Extrait gratuit</h2>
            </div>

            {excerpt?.source === 'none' ? (
              <div className="glass-panel rounded-3xl p-8 text-slate-500">
                L&apos;aperçu de ce livre sera bientôt disponible.
              </div>
            ) : (
              <div className="relative">
                <div className={`glass-panel rounded-3xl p-8 whitespace-pre-line leading-relaxed text-slate-700 ${excerpt?.truncated ? 'max-h-96 overflow-hidden' : ''}`}>
                  {excerpt?.text}
                </div>
                {excerpt?.truncated && (
                  <div className="absolute inset-x-0 bottom-0 h-40 rounded-b-3xl bg-gradient-to-t from-white via-white/95 to-transparent flex items-end justify-center pb-6">
                    <div className="text-center">
                      <Lock className="w-5 h-5 text-violet-500 mx-auto mb-2" />
                      <p className="text-slate-600 mb-3 text-sm">La suite est réservée aux lecteurs qui ont acheté ce livre.</p>
                      {isPurchased ? (
                        <button onClick={() => router.push(`/ebooks/${id}/lecture`)} className="premium-btn-primary !px-5 !py-2.5 !text-sm">
                          <span>Continuer la lecture</span>
                        </button>
                      ) : user ? (
                        <button onClick={handleAddToCart} className="premium-btn-primary !px-5 !py-2.5 !text-sm">
                          <span>Débloquer ce livre — {formatFcfa(ebook.prix)}</span>
                        </button>
                      ) : (
                        <Link href={`/login?next=/ebooks/${id}`} className="premium-btn-primary !inline-flex !px-5 !py-2.5 !text-sm">
                          <span>Se connecter pour débloquer</span>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ebooks similaires */}
          {related.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-violet-500" />
                <h2 className="text-2xl font-bold text-slate-900">Vous aimerez aussi</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {related.map(r => (
                  <Link key={r.id} href={`/ebooks/${r.id}`} className="group premium-card-hover overflow-hidden">
                    <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-5xl">
                      {r.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.image_url} alt={r.titre} className="w-full h-full object-cover" />
                      ) : (
                        <span>📘</span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-slate-900 mb-1 group-hover:text-violet-600 transition-colors">{r.titre}</h3>
                      <p className="text-slate-500 text-sm mb-3">Par {r.auteur}</p>
                      <span className="text-violet-600 font-bold">{formatFcfa(r.prix)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ChatbotVendeur />
    </div>
  )
}
