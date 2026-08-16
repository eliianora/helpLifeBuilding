'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { LogIn, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { signIn, getCurrentUserRole } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const isDisabled = useMemo(() => {
    return isLoading || !email.trim() || password.length < 6
  }, [email, password, isLoading])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await signIn(email.trim(), password)
      const role = await getCurrentUserRole().catch(() => null)
      const next = searchParams.get('next')
      const fallback = role === 'admin' ? '/admin' : '/mon-compte'
      const dest =
        next && next.startsWith('/') && !next.startsWith('//') ? next : fallback
      router.push(dest)
      router.refresh()
    } catch (err) {
      setError(err?.message || "Impossible de se connecter. Vérifie tes informations.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen page-ambient">
      <Header />
      <main className="relative z-10 pt-28 pb-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="glass-panel-strong rounded-3xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between gap-6">
              {/* <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-violet-500/20"> */}
                {/* <LogIn className="w-6 h-6 text-white" /> */}
              {/* </div> */}
            </div>

            {error && (
              <div className="mt-6 flex gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div className="text-sm leading-relaxed">{error}</div>
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <div className="mt-2 relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton@email.com"
                    autoComplete="email"
                    className="w-full h-12 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Mot de passe</span>
                <div className="mt-2 relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full h-12 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                    required
                  />
                </div>
                {/* <p className="mt-2 text-xs text-slate-500">Minimum 6 caractères.</p> */}
              </label>

              <button
                type="submit"
                disabled={isDisabled}
                className="premium-btn-primary w-full !h-12 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 flex items-center justify-end">
              <Link href="/mot-de-passe-oublie" className="text-sm font-medium text-slate-600 hover:text-slate-800">
                Mot de passe oublié ?
              </Link>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-600">Pas encore de compte ?</span>
              <Link href="/inscription" className="font-medium text-violet-700 hover:text-violet-800">
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  )
}

