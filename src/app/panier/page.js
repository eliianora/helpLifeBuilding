'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trash2, ShoppingBag, CreditCard } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getLocalCart, removeFromLocalCart } from '@/lib/supabase'

export default function PanierPage() {
  const [cart, setCart] = useState([])

  useEffect(() => {
    setCart(getLocalCart())
    const refresh = () => setCart(getLocalCart())
    window.addEventListener('cart-updated', refresh)
    return () => window.removeEventListener('cart-updated', refresh)
  }, [])

  const total = cart.reduce((s, i) => s + Number(i.prix || 0), 0)

  const handleRemove = (id) => {
    removeFromLocalCart(id)
    setCart(getLocalCart())
  }

  return (
    <div className="min-h-screen page-ambient">
      <Header />
      <main className="relative z-10 pt-28 pb-16 hlb-shell max-w-5xl">
        <Link href="/ebooks" className="inline-flex items-center gap-2 text-slate-600 hover:text-violet-600 mb-6">
          <ArrowLeft className="w-4 h-4" /> Continuer mes achats
        </Link>
        <h1 className="text-4xl font-bold text-slate-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="w-9 h-9 text-violet-600" /> Mon Panier
        </h1>

        {cart.length === 0 ? (
          <div className="premium-card p-12 text-center">
            <p className="text-slate-500 mb-6">Votre panier est vide.</p>
            <Link href="/ebooks" className="inline-block px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700">
              Découvrir nos ebooks
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="bg-white rounded-2xl p-5 shadow flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-yellow-100 rounded-xl flex items-center justify-center text-3xl">
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image_url} alt={item.titre || 'Ebook'} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      '📘'
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{item.titre}</h3>
                    <p className="text-sm text-slate-500">{item.categorie}</p>
                  </div>
                  <div className="text-xl font-bold text-violet-600">{Number(item.prix).toLocaleString('fr-FR')} FCFA</div>
                  <button onClick={() => handleRemove(item.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg h-fit sticky top-28">
              <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
              <div className="space-y-2 text-slate-600 mb-4">
                <div className="flex justify-between"><span>Articles</span><span>{cart.length}</span></div>
                <div className="flex justify-between"><span>Sous-total</span><span>{total.toLocaleString('fr-FR')} FCFA</span></div>
              </div>
              <div className="border-t pt-4 flex justify-between text-lg font-bold mb-6">
                <span>Total</span><span className="text-violet-600">{total.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <Link href="/paiement"
                className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-violet-500/30">
                <CreditCard className="w-5 h-5" /> Passer au paiement
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
