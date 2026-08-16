'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BookOpen, Calendar, Briefcase, FolderOpen, Users, 
  ArrowRight, Star, CheckCircle, Zap, Shield, Clock,
  TrendingUp, Award, Heart, ChevronRight, Quote
} from 'lucide-react'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BandeDefilante from '@/components/BandeDefilante'
import ChatbotVendeur from '@/components/ChatbotVendeur'
import { supabase, listCommunityTestimonials } from '@/lib/supabase'
import { formatFcfa } from '@/lib/money'

// À personnaliser : mêmes valeurs que sur la page /a-propos (voir src/app/a-propos/page.js)
const FONDATRICE_PHOTO_URL = '' // ex: '/fondatrice.jpg'
const FONDATRICE_NOM = '[Nom de la fondatrice]'

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

const stats = [
  { value: '500+', label: 'Clients Satisfaits', icon: Heart },
  { value: '50+', label: 'Ebooks Disponibles', icon: BookOpen },
  { value: '98%', label: 'Taux de Satisfaction', icon: Star },
  { value: '24/7', label: 'Support Client', icon: Clock },
]

function CommunityAvatar({ avatar, className = '' }) {
  if (avatar && /^https?:\/\//.test(avatar)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={avatar} alt="" className={`rounded-full object-cover ${className}`} />
    )
  }
  return (
    <div className={`flex items-center justify-center rounded-full bg-slate-100 text-2xl ${className}`}>
      {avatar || '👤'}
    </div>
  )
}

function formatCommunityRole(role) {
  if (role === 'admin') return 'Expert Help Life Building'
  return 'Membre de la communauté'
}

export default function HomePage() {
  const [isVisible, setIsVisible] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [featuredEbooks, setFeaturedEbooks] = useState([])
  const [services, setServices] = useState([])
  const [communityPosts, setCommunityPosts] = useState([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true); setError('')
      try {
        const [{ data: eb, error: e1 }, { data: sv, error: e2 }, testimonialsData] = await Promise.all([
          supabase
            .from('ebooks')
            .select('id,titre,description,prix,image_url,notation,ventes,bestseller,statut,categorie_eb(nom)')
            .eq('statut', 'publie')
            .order('ventes', { ascending: false })
            .limit(3),
          supabase
            .from('services')
            .select('id,titre,description,prix,unite,icone,couleur,populaire,ordre,actif')
            .eq('actif', true)
            .order('ordre', { ascending: true })
            .limit(3),
          listCommunityTestimonials({ limit: 3 }).catch(() => []),
        ])
        if (e1) throw e1
        if (e2) throw e2

        const ebooks = (eb || []).map(x => ({
          id: x.id,
          titre: x.titre,
          description: x.description,
          prix: x.prix,
          image_url: x.image_url,
          categorie: x.categorie_eb?.nom || 'Sans catégorie',
          notation: x.notation || 0,
          ventes: x.ventes || 0,
        }))

        const mappedServices = (sv || []).map((s, idx) => {
          const Icon = iconMap[String(s.icone || '').toLowerCase()] || Briefcase
          const color = s.couleur || colorPalette[idx % colorPalette.length]
          const prixLabel = s.prix
            ? `${formatFcfa(s.prix)}/${s.unite || ''}`.replace(/\/$/, '')
            : (s.unite || 'Sur devis')
          return { ...s, icon: Icon, color, prixLabel }
        })

        if (!cancelled) {
          setFeaturedEbooks(ebooks)
          setServices(mappedServices)
          setCommunityPosts(testimonialsData || [])
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Erreur de chargement')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen page-ambient">
      <Header />
      
      <div className="relative z-10 pt-16">
        <BandeDefilante />
      </div>

      <section className="relative z-10 overflow-hidden py-24 lg:py-32">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-violet-100 to-yellow-100 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="hlb-shell">
          <div className="mx-auto max-w-4xl text-center">
            <div className="section-eyebrow mb-8">
              <Zap className="h-4 w-4" />
              <span>Expérience premium • Accompagnement sur mesure</span>
            </div>
            
            <h1 className="section-title mb-6 leading-tight">
              Développez vos <br />
              <span className="brand-gradient-text">compétences</span>
            </h1>
            
            <p className="section-subtitle mx-auto mb-10">
              Ebooks, formations, coaching et services professionnels pour propulser votre carrière et votre business vers de nouveaux sommets.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/ebooks" className="premium-btn-primary w-full sm:w-auto !px-8 !py-4 !text-base">
                <BookOpen className="h-5 w-5" />
                <span>Explorer les Ebooks</span>
              </Link>
              <Link href="/rdv" className="premium-btn-secondary w-full sm:w-auto !px-8 !py-4 !text-base">
                <Calendar className="h-5 w-5" />
                <span>Prendre Rendez-vous</span>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-slate-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                <span>Paiement en ligne</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>Satisfait ou Remboursé</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-500" />
                <span>Certifié Qualité</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-slate-950 py-16">
        <div className="hlb-shell">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/20">
                  <stat.icon className="h-7 w-7 text-gold-400" />
                </div>
                <div className="mb-2 text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fondatrice */}
      <section
        id="fondatrice-section"
        data-animate
        className={`relative z-10 overflow-hidden py-24 transition-all duration-700 ease-out ${isVisible['fondatrice-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-10 -left-16 w-72 h-72 bg-violet-200/50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-100/60 rounded-full blur-3xl" />
        </div>
        <div className="hlb-shell">
          <div className="grid lg:grid-cols-[340px_1fr] gap-12 items-center">
            <div className="relative mx-auto lg:mx-0 w-64 h-64 lg:w-full lg:h-80">
              <div className="absolute -inset-6 bg-gradient-to-br from-violet-200/60 to-yellow-100/60 rounded-full blur-2xl" />
              <div className="blob-shape animate-float-soft relative w-full h-full overflow-hidden shadow-2xl brand-gradient flex items-center justify-center">
                {FONDATRICE_PHOTO_URL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={FONDATRICE_PHOTO_URL} alt={FONDATRICE_NOM} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-7xl">👩🏽‍💻</span>
                )}
              </div>
            </div>

            <div>
              <span className="premium-badge mb-4 inline-block">Fondatrice de Help Life Building</span>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Bonjour, je suis <span className="brand-gradient-text">{FONDATRICE_NOM}</span>
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Placeholder — deux à trois phrases qui présentent qui elle est, son parcours et pourquoi
                elle a créé Help Life Building : le problème qu&apos;elle aide à résoudre et pour qui.
              </p>
              <div className="flex items-start gap-3 rounded-[1.75rem] bg-white/70 backdrop-blur-md border border-white/60 shadow-sm p-5 mb-6">
                <Quote className="w-6 h-6 text-violet-400 shrink-0 mt-0.5" />
                <p className="text-slate-700 italic">
                  « Placeholder — une citation courte qui résume sa philosophie ou sa mission. »
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/a-propos" className="premium-btn-primary">
                  <span>Découvrir son histoire</span><ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/ebooks" className="premium-btn-secondary">
                  <BookOpen className="w-4 h-4" /><span>Voir ses ebooks</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Ebooks */}
      <section 
        id="ebooks-section" 
        data-animate
        className={`py-24 transition-all duration-700 ${isVisible['ebooks-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="hlb-shell">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">
              Nos Ebooks <span className="brand-gradient-text">Populaires</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Découvrez notre sélection d'ebooks les plus vendus, écrits par des experts reconnus.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {error && (
              <div className="md:col-span-2 lg:col-span-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
                {error}
              </div>
            )}

            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 rounded w-full" />
                    <div className="h-10 bg-slate-200 rounded" />
                  </div>
                </div>
              ))
            ) : featuredEbooks.map((ebook) => (
              <div
                key={ebook.id}
                className="group premium-card-hover overflow-hidden"
              >
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                  {ebook.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ebook.image_url} alt={ebook.titre || 'Ebook'} className="w-full h-full object-cover" />
                  ) : (
                    <span>📘</span>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="premium-badge">{ebook.categorie}</span>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{ebook.notation}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">
                    {ebook.titre}
                  </h3>
                  <p className="text-slate-600 mb-4">{ebook.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-violet-600">{formatFcfa(ebook.prix)}</span>
                    <Link href="/ebooks" className="premium-btn-primary !px-4 !py-2.5 !text-sm">
                      <span>Acheter</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/ebooks" className="premium-btn-secondary !px-8 !py-4 !text-base">
              <span>Voir tous les ebooks</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section 
        id="services-section" 
        data-animate
        className={`relative z-10 py-24 transition-all duration-700 ${isVisible['services-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="hlb-shell">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">
              Nos <span className="brand-gradient-text">Services</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Un accompagnement personnalisé pour atteindre vos objectifs professionnels.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-lg animate-pulse">
                  <div className="w-16 h-16 rounded-2xl bg-slate-200 mb-6" />
                  <div className="h-6 bg-slate-200 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-slate-200 rounded w-full mb-6" />
                  <div className="h-10 bg-slate-200 rounded" />
                </div>
              ))
            ) : services.map((service) => (
              <div
                key={service.id}
                className="group premium-card-hover relative overflow-hidden p-8"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.titre}</h3>
                <p className="text-slate-600 mb-6">{service.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-700">{service.prixLabel}</span>
                  <Link
                    href="/services"
                    className="flex items-center space-x-2 text-violet-600 font-medium hover:text-violet-700 transition-colors"
                  >
                    <span>En savoir plus</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section 
        id="testimonials-section" 
        data-animate
        className={`py-24 transition-all duration-700 ${isVisible['testimonials-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="hlb-shell">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">
              Ce que dit notre <span className="brand-gradient-text">communauté</span>
            </h2>
            <p className="section-subtitle mx-auto">Publications réelles des membres Help Life Building</p>
          </div>

          {communityPosts.length === 0 ? (
            <div className="premium-card p-10 text-center text-slate-600">
              <p className="mb-4">Aucune publication pour le moment.</p>
              <Link href="/communaute" className="premium-btn-primary inline-flex">
                Rejoindre la communauté <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {communityPosts.map((post) => (
              <div
                key={post.id}
                className="premium-card p-8 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4 text-rose-500">
                  <Heart className="w-5 h-5 fill-current" />
                  <span className="text-sm font-semibold">{post.likes || 0} j’aime</span>
                  {post.commentaires > 0 && (
                    <span className="text-slate-400 text-sm">· {post.commentaires} commentaire{post.commentaires > 1 ? 's' : ''}</span>
                  )}
                </div>

                <p className="text-slate-600 mb-6 italic flex-1">&ldquo;{post.contenu}&rdquo;</p>
                
                <div className="flex items-center space-x-4 mt-auto">
                  <CommunityAvatar avatar={post.avatar} className="h-12 w-12 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">{post.auteur}</div>
                    <div className="text-slate-500 text-sm">{formatCommunityRole(post.role)}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{post.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 overflow-hidden py-24">
        <div className="absolute inset-0 brand-gradient" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-yellow-300 blur-3xl" />
        </div>
        
        <div className="relative hlb-shell max-w-4xl text-center">
          <h2 className="section-title mb-6 text-white">
            Prêt à transformer votre vie ?
          </h2>
          <p className="section-subtitle mx-auto mb-10 text-violet-100">
            Rejoignez notre communauté et commencez votre voyage vers le succès dès aujourd'hui.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/rdv" className="premium-btn-secondary w-full sm:w-auto !border-white/40 !bg-white !px-8 !py-4 !text-base !text-violet-700">
              <Calendar className="h-5 w-5" />
              <span>Réserver une consultation gratuite</span>
            </Link>
            <Link href="/communaute" className="premium-btn-secondary w-full sm:w-auto !border-white/30 !bg-white/10 !px-8 !py-4 !text-base !text-white hover:!bg-white/20">
              <Users className="h-5 w-5" />
              <span>Rejoindre la communauté</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <ChatbotVendeur />
    </div>
  )
}
