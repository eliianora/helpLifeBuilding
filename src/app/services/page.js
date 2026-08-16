'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Star, Users, TrendingUp, Heart, Zap, Clock, Shield, ArrowRight, Briefcase } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChatbotVendeur from '@/components/ChatbotVendeur'
import { supabase } from '@/lib/supabase'
import { formatFcfa } from '@/lib/money'

const iconMap = {
  heart: Heart,
  users: Users,
  trendingup: TrendingUp,
  star: Star,
  zap: Zap,
  clock: Clock,
  shield: Shield,
  briefcase: Briefcase,
}

const colorPalette = [
  'from-rose-500 to-pink-600',
  'from-violet-500 to-blue-600',
  'from-yellow-500 to-orange-600',
  'from-emerald-500 to-teal-600',
  'from-cyan-500 to-sky-600',
]

const packs = [
  { id: 1, nom: 'Starter', prix: 199, sessions: 3, description: 'Idéal pour démarrer', features: ['3 sessions de coaching', 'Plan d\'action', 'Support email'] },
  { id: 2, nom: 'Growth', prix: 499, sessions: 8, description: 'Le plus populaire', features: ['8 sessions de coaching', 'Plan personnalisé', 'Support WhatsApp', 'Ressources exclusives'], popular: true },
  { id: 3, nom: 'Premium', prix: 999, sessions: 20, description: 'Transformation complète', features: ['20 sessions de coaching', 'Accompagnement complet', 'Support prioritaire 24/7', 'Accès VIP communauté', 'Bonus ebooks'] },
]

export default function ServicesPage() {
  const [selectedPack, setSelectedPack] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [services, setServices] = useState([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true); setError('')
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id,titre,description,prix,unite,icone,couleur,features,populaire,ordre,actif')
          .eq('actif', true)
          .order('ordre', { ascending: true })
        if (error) throw error

        const mapped = (data || []).map((s, idx) => {
          const Icon = iconMap[String(s.icone || '').toLowerCase()] || BriefcaseFallbackIcon
          const color = s.couleur || colorPalette[idx % colorPalette.length]
          const features = Array.isArray(s.features) ? s.features : (s.features ? Object.values(s.features) : [])
          return {
            ...s,
            Icon,
            color,
            features: (features || []).map(x => String(x)).filter(Boolean),
          }
        })

        if (!cancelled) setServices(mapped)
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Erreur de chargement')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const hasServices = useMemo(() => services.length > 0, [services])

  return (
    <div className="min-h-screen page-ambient">
      <Header />
      <main className="relative z-10 pt-24 pb-16">
        <div className="hlb-shell">
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-violet-600 mb-4">
              <ArrowLeft className="w-4 h-4" /><span>Retour</span>
            </Link>
            <h1 className="section-title mb-4">Nos <span className="brand-gradient-text">Services</span></h1>
            <p className="section-subtitle">Un accompagnement professionnel pour atteindre vos objectifs.</p>
          </div>

          {/* Services Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {error && (
              <div className="md:col-span-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
                {error}
              </div>
            )}

            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-lg animate-pulse">
                  <div className="w-16 h-16 rounded-2xl bg-slate-200 mb-6" />
                  <div className="h-6 bg-slate-200 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-5/6 mb-6" />
                  <div className="h-10 bg-slate-200 rounded" />
                </div>
              ))
            ) : !hasServices ? (
              <div className="md:col-span-3 text-center text-slate-500 py-10">
                Aucun service actif pour le moment.
              </div>
            ) : services.map(service => (
              <div key={service.id} className={`premium-card-hover relative p-8 ${service.popular ? 'ring-2 ring-violet-500' : ''}`}>
                {service.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-500 text-white text-sm font-bold rounded-full">POPULAIRE</div>}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6`}>
                  <service.Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.titre}</h3>
                <p className="text-slate-600 mb-6">{service.description}</p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-3 text-slate-600">
                      <Check className="w-5 h-5 text-emerald-500" /><span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div>
                    {service.prix ? (
                      <><span className="text-3xl font-bold text-slate-900">{formatFcfa(service.prix)}</span><span className="text-slate-500">/{service.unite}</span></>
                    ) : (
                      <span className="text-xl font-semibold text-slate-700">{service.unite}</span>
                    )}
                  </div>
                  <Link href="/rdv" className="premium-btn-primary !px-5 !py-2.5 !text-sm">
                    <span>Réserver</span><ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Packs Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Nos <span className="text-violet-600">Packs</span></h2>
            <p className="text-xl text-slate-600">Des offres groupées pour un meilleur rapport qualité-prix.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packs.map(pack => (
              <div key={pack.id} className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all ${pack.popular ? 'ring-2 ring-yellow-500 scale-105' : ''}`}>
                {pack.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-500 text-white text-sm font-bold rounded-full">MEILLEURE OFFRE</div>}
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{pack.nom}</h3>
                <p className="text-slate-500 mb-4">{pack.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-violet-600">{formatFcfa(pack.prix)}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {pack.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-3 text-slate-600">
                      <Check className="w-5 h-5 text-emerald-500" /><span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-semibold transition-all ${pack.popular ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  Choisir ce pack
                </button>
              </div>
            ))}
          </div>

          {/* Garanties */}
          <div className="mt-20 bg-slate-900 rounded-3xl p-12">
            <h2 className="text-3xl font-display font-bold text-white text-center mb-12">Nos Garanties</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-violet-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Satisfait ou Remboursé</h3>
                <p className="text-slate-400">Garantie 30 jours sans condition</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Résultats Garantis</h3>
                <p className="text-slate-400">Des méthodes éprouvées qui fonctionnent</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Support 24/7</h3>
                <p className="text-slate-400">Une équipe disponible à tout moment</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatbotVendeur />
    </div>
  )
}

function BriefcaseFallbackIcon(props) {
  return <Briefcase {...props} />
}
