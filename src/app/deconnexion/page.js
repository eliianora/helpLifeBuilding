'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/supabase'

export default function DeconnexionPage() {
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await signOut()
      } finally {
        if (!cancelled) {
          router.push('/')
          router.refresh()
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [router])

  return (
    <main className="min-h-[calc(100vh-5rem)] pt-28 pb-16 px-4">
      <div className="max-w-md mx-auto text-center text-slate-700">
        Déconnexion...
      </div>
    </main>
  )
}

