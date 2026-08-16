'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Github, Eye, X } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChatbotVendeur from '@/components/ChatbotVendeur'
import { supabase } from '@/lib/supabase'

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [selectedProjet, setSelectedProjet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [projets, setProjets] = useState([])
  const [categories, setCategories] = useState(['Tous'])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true); setError('')
      try {
        const { data, error } = await supabase
          .from('portfolio')
          .select('id,titre,description,image_url,lien_demo,lien_github,visible,categorie_pro(nom),langages(nom)')
          .eq('visible', true)
          .order('ordre', { ascending: true })
        if (error) throw error

        const mapped = (data || []).map(p => ({
          id: p.id,
          titre: p.titre,
          description: p.description,
          categorie: p.categorie_pro?.nom || 'Sans catégorie',
          technologies: p.langages?.nom ? [p.langages.nom] : [],
          image_url: p.image_url,
          lien: p.lien_demo || '#',
          github: p.lien_github || '#',
        }))

        const catSet = new Set(mapped.map(x => x.categorie).filter(Boolean))
        if (!cancelled) {
          setProjets(mapped)
          setCategories(['Tous', ...Array.from(catSet)])
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Erreur de chargement')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const filteredProjets = useMemo(
    () => projets.filter(p => selectedCategory === 'Tous' || p.categorie === selectedCategory),
    [projets, selectedCategory]
  )

  return (
    <div className="min-h-screen page-ambient">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center space-x-2 text-slate-600 hover:text-violet-600 mb-4">
              <ArrowLeft className="w-4 h-4" /><span>Retour</span>
            </Link>
            <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Notre <span className="text-violet-600">Portfolio</span></h1>
            <p className="text-xl text-slate-600">Découvrez nos réalisations et projets récents.</p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${selectedCategory === cat ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30' : 'bg-white text-slate-600 hover:bg-slate-50 shadow'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {error && (
              <div className="md:col-span-2 lg:col-span-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
                {error}
              </div>
            )}

            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 rounded w-full" />
                    <div className="h-3 bg-slate-200 rounded w-5/6" />
                  </div>
                </div>
              ))
            ) : filteredProjets.map(projet => (
              <div key={projet.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 bg-gradient-to-br from-violet-100 to-yellow-100 flex items-center justify-center text-6xl">
                  {projet.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={projet.image_url} alt={projet.titre || 'Projet'} className="w-full h-full object-cover" />
                  ) : (
                    <span>🧩</span>
                  )}
                  <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-4">
                    <button onClick={() => setSelectedProjet(projet)} className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-violet-500 hover:text-white transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                    <a href={projet.lien} className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-violet-500 hover:text-white transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <a href={projet.github} className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-violet-500 hover:text-white transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-3">{projet.categorie}</span>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{projet.titre}</h3>
                  <p className="text-slate-600 mb-4">{projet.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {projet.technologies.map((tech, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {selectedProjet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedProjet(null)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="relative h-64 bg-gradient-to-br from-violet-100 to-yellow-100 flex items-center justify-center text-8xl">
                {selectedProjet.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedProjet.image_url} alt={selectedProjet.titre || 'Projet'} className="w-full h-full object-cover" />
                ) : (
                  <span>🧩</span>
                )}
                <button onClick={() => setSelectedProjet(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8">
                <span className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-4">{selectedProjet.categorie}</span>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{selectedProjet.titre}</h2>
                <p className="text-slate-600 mb-6">{selectedProjet.description}</p>
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-900 mb-3">Technologies utilisées</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProjet.technologies.map((tech, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg">{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-4">
                  <a href={selectedProjet.lien} className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-violet-500 text-white font-medium hover:bg-violet-600">
                    <ExternalLink className="w-5 h-5" /><span>Voir le projet</span>
                  </a>
                  <a href={selectedProjet.github} className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50">
                    <Github className="w-5 h-5" /><span>Code</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <ChatbotVendeur />
    </div>
  )
}
