'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Mail, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react'
import { requestPasswordReset } from '@/lib/supabase'

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      await requestPasswordReset(email.trim())
      setSuccess("C’est envoyé. Vérifie ton email pour réinitialiser ton mot de passe.")
    } catch (err) {
      setError(err?.message || "Impossible d’envoyer l’email. Réessaie.")
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
                <h1 className="mt-1 text-3xl font-display font-bold text-slate-900">Mot de passe oublié</h1>
                <p className="mt-2 text-slate-600">
                  Entre ton email et on t’envoie un lien de réinitialisation.
                </p>
              </div>
              {/* <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-violet-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <KeyRound className="w-6 h-6 text-white" />
              </div> */}
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

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-yellow-500 to-violet-600 text-white font-medium shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? 'Envoi...' : 'Envoyer le lien'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between gap-4 text-sm">
              {/* <span className="text-slate-600">Tu l’as retrouvée ?</span> */}
              <Link href="/login" className="font-medium text-violet-700 hover:text-violet-800">
                Retour connexion
              </Link>
            </div>
          </div>

          {/* <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
            Astuce : vérifie aussi tes spams si tu ne reçois rien.
          </div> */}
        </div>
      </div>
    </main>
  )
}

