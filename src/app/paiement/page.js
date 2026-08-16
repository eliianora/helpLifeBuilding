'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lock, Check, Smartphone, Wallet, CreditCard } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getLocalCart, clearLocalCart, completeCheckout, requireUser } from '@/lib/supabase'
import { formatFcfa } from '@/lib/money'

const moyens = [
  { id: 'wave', label: 'Wave', icon: Smartphone },
  { id: 'mtnmoney', label: 'MTN Money', icon: Smartphone },
  { id: 'ommoney', label: 'Orange Money', icon: Wallet },
  { id: 'moovmoney', label: 'Moov Money', icon: Wallet },
  { id: 'simulation', label: 'Paiement test', icon: CreditCard },
]

export default function PaiementPage() {
  const router = useRouter()
  const [cart, setCart] = useState([])
  const [moyen, setMoyen] = useState('wave')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({ nom: '', email: '', tel: '' })

  useEffect(() => { setCart(getLocalCart()) }, [])

  const total = cart.reduce((s, i) => s + Number(i.prix || 0), 0)

  const handlePay = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await requireUser()

      await completeCheckout({
        moyen,
        ebookIds: cart.map(i => i.id),
        nom_client: form.nom,
        email_client: form.email,
      })

      clearLocalCart()
      setDone(true)
      setTimeout(() => router.push('/mon-compte'), 2500)
    } catch (err) {
      if (err?.code === 'AUTH_REQUIRED' || err?.message === 'AUTH_REQUIRED') {
        router.push('/login')
        return
      }
      alert(err?.message || 'Paiement impossible')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen page-ambient">
        <Header />
        <main className="pt-32 pb-16 max-w-2xl mx-auto px-4 text-center">
          <div className="premium-card p-12">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Paiement enregistré</h1>
            <p className="text-slate-600 mb-8">Vos ebooks sont disponibles dans Mon compte.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen page-ambient">
      <Header />
      <main className="pt-28 pb-16 max-w-5xl mx-auto px-4">
        <Link href="/panier" className="inline-flex items-center gap-2 text-slate-600 hover:text-violet-600 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour au panier
        </Link>
        <h1 className="section-title mb-2 flex items-center gap-3">
          <Lock className="w-8 h-8 text-violet-600" /> Paiement
        </h1>

        <form onSubmit={handlePay} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="premium-card p-6">
              <h2 className="font-bold text-lg mb-4">Vos informations</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input required placeholder="Nom complet" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })}
                  className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-violet-300" />
                <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-violet-300" />
                <input required placeholder="Téléphone" value={form.tel} onChange={e => setForm({ ...form, tel: e.target.value })}
                  className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-violet-300 sm:col-span-2" />
              </div>
            </div>

            <div className="premium-card p-6">
              <h2 className="font-bold text-lg mb-4">Moyen de paiement</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {moyens.map(m => (
                  <button type="button" key={m.id} onClick={() => setMoyen(m.id)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      moyen === m.id ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-slate-200 hover:border-violet-300'
                    }`}>
                    <m.icon className="w-6 h-6" />
                    <span className="text-sm font-medium text-center">{m.label}</span>
                  </button>
                ))}
              </div>
              {moyen !== 'simulation' && (
                <p className="mt-4 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl p-3">
                  La confirmation mobile money sera branchée sur votre API prestataire. En attendant, utilisez « Paiement test ».
                </p>
              )}
            </div>
          </div>

          <div className="premium-card p-6 h-fit sticky top-28">
            <h2 className="text-xl font-bold mb-4">Commande</h2>
            <div className="space-y-2 mb-4 max-h-60 overflow-auto">
              {cart.map(i => (
                <div key={i.id} className="flex justify-between text-sm gap-2">
                  <span className="truncate">{i.titre}</span>
                  <span className="font-medium shrink-0">{formatFcfa(i.prix)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between text-lg font-bold mb-6">
              <span>Total</span><span className="text-violet-600">{formatFcfa(total)}</span>
            </div>
            <button type="submit" disabled={loading || cart.length === 0}
              className="premium-btn-primary w-full disabled:opacity-50">
              {loading ? 'Traitement...' : `Payer ${formatFcfa(total)}`}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}
