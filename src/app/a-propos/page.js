'use client'

/**
 * Page "Fondatrice" — à personnaliser :
 * - Remplacez [Nom de la fondatrice], la bio, la citation et le parcours par le vrai contenu.
 * - Déposez sa photo dans /public (ex: /public/fondatrice.jpg) puis mettez à jour PHOTO_URL ci-dessous.
 * - Les chiffres clés et "Ses ebooks" sont chargés automatiquement depuis Supabase (aucune donnée en dur).
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Heart, Target, Sparkles, Users, Star,
  Instagram, Linkedin, Youtube, BookOpen, Calendar, Quote,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChatbotVendeur from '@/components/ChatbotVendeur'
import { supabase } from '@/lib/supabase'
import { formatFcfa } from '@/lib/money'

const PHOTO_URL = '' // ex: '/fondatrice.jpg'
const NOM_FONDATRICE = '[Nom de la fondatrice]'

const VALEURS = [
  { icon: Heart, titre: 'Authenticité', texte: "Chaque ebook part d'une expérience vécue, pas d'une théorie récitée." },
  { icon: Target, titre: 'Résultats concrets', texte: 'Des conseils actionnables, pensés pour être appliqués dès la première page.' },
  { icon: Sparkles, titre: 'Exigence', texte: 'Un contenu relu, testé et amélioré en continu grâce aux retours des lecteurs.' },
  { icon: Users, titre: 'Communauté', texte: "Une aventure collective : chaque lectrice et lecteur fait grandir le projet." },
]

const PARCOURS = [
  { annee: '01', titre: 'Le déclic', texte: "Placeholder — le moment ou l'événement qui a donné naissance au projet." },
  { annee: '02', titre: 'Les premiers pas', texte: 'Placeholder — la création des premiers contenus et les premiers retours de lecteurs.' },
  { annee: '03', titre: "Help Life Building aujourd'hui", texte: 'Placeholder — la plateforme actuelle, sa mission et ce qui se prépare.' },
]

const SOCIALS = [
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
]

export default function FondatricePage() {
  const [stats, setStats] = useState({ ebooksCount: 0, membersCount: 0, notationMoyenne: 0 })
  const [ebooks, setEbooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const [{ count: ebooksCount }, { count: membersCount }, { data: eb }] = await Promise.all([
          supabase.from('ebooks').select('id', { count: 'exact', head: true }).eq('statut', 'publie'),
          supabase.from('users').select('id', { count: 'exact', head: true }),
          supabase
            .from('ebooks')
            .select('id,titre,prix,image_url,notation,ventes,statut')
            .eq('statut', 'publie')
            .order('ventes', { ascending: false })
            .limit(3),
        ])
        if (cancelled) return

        const rows = eb || []
        const notes = rows.map(r => Number(r.notation || 0)).filter(n => n > 0)
        const notationMoyenne = notes.length ? notes.reduce((a, b) => a + b, 0) / notes.length : 0

        setStats({ ebooksCount: ebooksCount || 0, membersCount: membersCount || 0, notationMoyenne })
        setEbooks(rows)
      } catch {
        // silencieux : la page reste utile même sans chiffres dynamiques
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen page-ambient">
      <Header />
      <main className="relative z-10 pt-24 pb-16">
        <div className="hlb-shell">

          {/* Hero */}
          <div className="relative grid lg:grid-cols-[380px_1fr] gap-10 items-center mb-20 overflow-hidden">
            <div className="absolute -z-10 -top-16 -left-20 w-80 h-80 bg-violet-200/50 rounded-full blur-3xl" />
            <div className="absolute -z-10 top-10 right-0 w-96 h-96 bg-yellow-100/50 rounded-full blur-3xl" />

            <div className="relative mx-auto lg:mx-0 w-72 h-72 lg:w-full lg:h-96 animate-fade-in-up">
              <div className="absolute -inset-8 bg-gradient-to-br from-violet-200/60 to-yellow-100/60 rounded-full blur-2xl" />
              <div className="blob-shape animate-float-soft relative w-full h-full overflow-hidden shadow-2xl brand-gradient flex items-center justify-center">
                {PHOTO_URL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={PHOTO_URL} alt={NOM_FONDATRICE} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-7xl">👩🏽‍💻</span>
                )}
              </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <span className="premium-badge mb-4 inline-block">Fondatrice de Help Life Building</span>
              <h1 className="section-title mb-4">
                Bonjour, je suis <span className="brand-gradient-text">{NOM_FONDATRICE}</span>
              </h1>
              <p className="section-subtitle mb-8">
                Placeholder — une phrase d&apos;accroche qui résume sa mission : à qui elle s&apos;adresse,
                quel problème elle aide à résoudre, et ce qui la rend différente.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <Link href="/ebooks" className="premium-btn-primary">
                  <BookOpen className="w-4 h-4" /><span>Découvrir ses ebooks</span>
                </Link>
                <Link href="/rdv" className="premium-btn-secondary">
                  <Calendar className="w-4 h-4" /><span>Prendre rendez-vous</span>
                </Link>
              </div>
              <div className="flex items-center gap-3">
                {SOCIALS.map(s => (
                  <Link key={s.name} href={s.href} className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-slate-500 hover:text-violet-600 hover:bg-white transition-all duration-300 hover:-translate-y-0.5" aria-label={s.name}>
                    <s.icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Chiffres clés */}
          <div className="grid sm:grid-cols-3 gap-6 mb-20">
            <div className="rounded-[1.75rem] bg-white/70 backdrop-blur-md border border-white/60 shadow-sm p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-md">
              <div className="text-3xl font-bold text-violet-600 mb-1">
                {loading ? '—' : stats.ebooksCount}
              </div>
              <p className="text-slate-500 text-sm">Ebooks publiés</p>
            </div>
            <div className="rounded-[1.75rem] bg-white/70 backdrop-blur-md border border-white/60 shadow-sm p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-md">
              <div className="text-3xl font-bold text-violet-600 mb-1">
                {loading ? '—' : stats.membersCount}
              </div>
              <p className="text-slate-500 text-sm">Membres de la communauté</p>
            </div>
            <div className="rounded-[1.75rem] bg-white/70 backdrop-blur-md border border-white/60 shadow-sm p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-violet-600 mb-1">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                {loading || !stats.notationMoyenne ? '—' : stats.notationMoyenne.toFixed(1)}
              </div>
              <p className="text-slate-500 text-sm">Note moyenne des ebooks</p>
            </div>
          </div>

          {/* Son histoire */}
          <div className="grid lg:grid-cols-[1fr_360px] gap-10 mb-20">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-5">Son histoire</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Placeholder — premier paragraphe de la bio : d&apos;où elle vient, son parcours avant Help
                  Life Building, et le déclic qui l&apos;a menée à écrire son premier ebook.
                </p>
                <p>
                  Placeholder — deuxième paragraphe : ce qu&apos;elle a appris en chemin, les difficultés
                  traversées, et pourquoi elle a choisi de transmettre ce savoir sous forme d&apos;ebooks.
                </p>
                <p>
                  Placeholder — troisième paragraphe : sa vision pour Help Life Building aujourd&apos;hui et
                  pour les prochaines années.
                </p>
              </div>
            </div>
            <div className="rounded-[2rem] bg-white/75 backdrop-blur-md border border-white/60 shadow-sm p-8 flex flex-col justify-center transition-all duration-500 hover:shadow-md">
              <Quote className="w-8 h-8 text-violet-400 mb-4" />
              <p className="text-lg font-medium text-slate-800 leading-relaxed italic mb-4">
                « Placeholder — une citation courte et forte qui résume sa philosophie ou sa mission. »
              </p>
              <p className="text-sm text-slate-500">— {NOM_FONDATRICE}</p>
            </div>
          </div>

          {/* Valeurs */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Ce qui l&apos;anime</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALEURS.map(v => (
                <div key={v.titre} className="rounded-[1.75rem] bg-white/80 backdrop-blur-md border border-white/60 shadow-sm p-6 text-center transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg">
                  <div className="w-12 h-12 rounded-full brand-gradient flex items-center justify-center text-white mx-auto mb-4">
                    <v.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{v.titre}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{v.texte}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Parcours */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Son parcours</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {PARCOURS.map(p => (
                <div key={p.annee} className="rounded-[1.75rem] bg-white/70 backdrop-blur-md border border-white/60 shadow-sm p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-md">
                  <span className="text-4xl font-bold text-violet-200">{p.annee}</span>
                  <h3 className="font-bold text-slate-900 mt-3 mb-2">{p.titre}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{p.texte}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ses ebooks */}
          {ebooks.length > 0 && (
            <div className="mb-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Ses ebooks</h2>
                <Link href="/ebooks" className="text-violet-600 font-medium inline-flex items-center gap-1 hover:text-violet-700">
                  <span>Tout voir</span><ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {ebooks.map(eb => (
                  <Link key={eb.id} href={`/ebooks/${eb.id}`} className="group premium-card-hover overflow-hidden">
                    <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-5xl">
                      {eb.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={eb.image_url} alt={eb.titre} className="w-full h-full object-cover" />
                      ) : (
                        <span>📘</span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">{eb.titre}</h3>
                      <span className="text-violet-600 font-bold">{formatFcfa(eb.prix)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA finale */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white/75 backdrop-blur-md border border-white/60 shadow-md p-10 text-center">
            <div className="absolute -z-10 -top-10 -right-10 w-64 h-64 bg-violet-200/40 rounded-full blur-3xl" />
            <div className="absolute -z-10 -bottom-10 -left-10 w-64 h-64 bg-yellow-100/40 rounded-full blur-3xl" />
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Envie d&apos;aller plus loin ?</h2>
            <p className="text-slate-500 mb-6 max-w-xl mx-auto">
              Rejoignez la communauté ou réservez un rendez-vous pour échanger directement avec elle.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/communaute" className="premium-btn-primary">
                <Users className="w-4 h-4" /><span>Rejoindre la communauté</span>
              </Link>
              <Link href="/rdv" className="premium-btn-secondary">
                <Calendar className="w-4 h-4" /><span>Prendre rendez-vous</span>
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
      <ChatbotVendeur />
    </div>
  )
}
