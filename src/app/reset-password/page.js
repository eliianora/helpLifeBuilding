'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Lock, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react'
import { setSessionFromRecoveryUrl, updatePassword } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const passwordsMatch = password && confirmPassword && password === confirmPassword
  const isDisabled = useMemo(() => {
    if (isLoading) return true
    if (password.length < 6) return true
    if (password !== confirmPassword) return true
    return false
  }, [confirmPassword, isLoading, password])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setError('')
      try {
        await setSessionFromRecoveryUrl()
        if (!cancelled) setIsReady(true)
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Lien invalide ou expiré. Redemande un nouveau lien.")
          setIsReady(true)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      await updatePassword(password)
      setSuccess('Mot de passe mis à jour. Redirection...')
      setTimeout(() => {
        router.push('/login')
        router.refresh()
      }, 700)
    } catch (err) {
      setError(err?.message || "Impossible de changer le mot de passe.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] pt-28 pb-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h1 className="mt-1 text-3xl font-display font-bold text-slate-900">Nouveau mot de passe</h1>
              </div>
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
            </div>

            {error && (
              <div className="mt-6 flex gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div className="text-sm leading-relaxed">{error}</div>
              </div>
            )}

            {success && (
              <div className="mt-6 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 mt-0.5" />
                <div className="text-sm leading-relaxed">{success}</div>
              </div>
            )}

            {!isReady ? (
              <div className="mt-8 text-sm text-slate-600">Préparation du lien...</div>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Nouveau mot de passe</span>
                  <div className="mt-2 relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full h-12 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                      required
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Confirmer</span>
                  <div className="mt-2 relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full h-12 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                      required
                    />
                  </div>
                  {confirmPassword && (
                    <p className={`mt-2 text-xs ${passwordsMatch ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {passwordsMatch ? 'Les mots de passe correspondent.' : 'Les mots de passe ne correspondent pas.'}
                    </p>
                  )}
                </label>

                <button
                  type="submit"
                  disabled={isDisabled}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-violet-500 to-emerald-600 text-white font-medium shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="mt-6 flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-600">Besoin d’un nouveau lien ?</span>
              <Link href="/mot-de-passe-oublie" className="font-medium text-violet-700 hover:text-violet-800">
                Redemander
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

