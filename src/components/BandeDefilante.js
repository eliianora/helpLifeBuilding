'use client'

import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Play, Pause, Image, FileText, Video, Music } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Données de démonstration (seront remplacées par Supabase)
const demoInfos = [
  { id: 1, type: 'text', content: '🎉 Nouveau ! Découvrez notre collection d\'ebooks sur le développement personnel', lien: '/ebooks' },
  { id: 2, type: 'text', content: '📅 Prenez rendez-vous maintenant et bénéficiez de -20% sur votre première consultation', lien: '/rdv' },
  { id: 3, type: 'text', content: '⭐ Plus de 500 clients satisfaits ! Rejoignez notre communauté', lien: '/communaute' },
  { id: 4, type: 'text', content: '🚀 Nouveaux services disponibles - Coaching personnalisé & Formation en ligne', lien: '/services' },
]

export default function BandeDefilante({ infos = demoInfos }) {
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [dbInfos, setDbInfos] = useState(null)

  // Doubler le contenu pour créer l'effet de boucle infinie
  const sourceInfos = dbInfos || infos
  const allInfos = [...sourceInfos, ...sourceInfos]

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('bande_info')
          .select('id,type,contenu,media_url,lien,actif,ordre')
          .eq('actif', true)
          .order('ordre', { ascending: true })
        if (error) throw error
        const mapped = (data || []).map(x => ({
          id: x.id,
          type: x.type || 'text',
          content: x.contenu,
          lien: x.lien || '#',
          media_url: x.media_url || null,
        })).filter(x => !!x.content)
        if (!cancelled && mapped.length) setDbInfos(mapped)
      } catch (_) {
        // fallback: garder demoInfos
      }
    })()
    return () => { cancelled = true }
  }, [])

  const getIcon = (type) => {
    switch(type) {
      case 'image': return <Image className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'audio': return <Music className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="relative bg-gradient-to-r from-slate-900 via-violet-900 to-slate-900 overflow-hidden">
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
      
      {/* Contrôles */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center space-x-2">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          title={isPaused ? 'Reprendre' : 'Pause'}
        >
          {isPaused ? (
            <Play className="w-4 h-4 text-white" />
          ) : (
            <Pause className="w-4 h-4 text-white" />
          )}
        </button>
      </div>

      {/* Conteneur du défilement */}
      <div 
        className={`flex whitespace-nowrap py-3 ${isPaused ? '' : 'animate-marquee'}`}
        style={{ 
          animationPlayState: isPaused ? 'paused' : 'running',
          width: 'max-content'
        }}
      >
        {allInfos.map((info, index) => (
          <a
            key={`${info.id}-${index}`}
            href={info.lien || '#'}
            className="inline-flex items-center space-x-3 mx-8 text-white/90 hover:text-white transition-colors group"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 group-hover:bg-yellow-500/30 transition-colors">
              {getIcon(info.type)}
            </span>
            <span className="font-medium tracking-wide">{info.content}</span>
            <span className="text-yellow-400 opacity-50">•</span>
          </a>
        ))}
      </div>

      {/* Dégradés sur les côtés pour l'effet de fondu */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none" />
      <div className="absolute right-16 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none" />
    </div>
  )
}
