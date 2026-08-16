'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const PAID_STATUSES = ['paid', 'complete']

export default function Page() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])
  const [clients, setClients] = useState({})

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true); setError('')
      try {
        const { data, error } = await supabase
          .from('paiement')
          .select('id,utilisateur_id,montant,devise,moyen,statut,date_paiement,items')
          .in('statut', PAID_STATUSES)
          .order('date_paiement', { ascending: false })
        if (error) throw error

        const payments = data || []
        const ids = [...new Set(payments.map(r => r.utilisateur_id).filter(Boolean))]
        let profileById = {}
        if (ids.length) {
          const { data: profiles, error: profileError } = await supabase
            .from('users')
            .select('id,email,nom')
            .in('id', ids)
          if (profileError) throw profileError
          profileById = Object.fromEntries((profiles || []).map(p => [p.id, p]))
        }

        if (!cancelled) {
          setRows(payments)
          setClients(profileById)
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Erreur')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const clientLabel = (userId) => {
    const profile = clients[userId]
    if (!profile) return userId || '—'
    const name = profile.nom?.trim()
    if (name && profile.email) return `${name} (${profile.email})`
    return profile.email || name || userId
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-slate-600 hover:text-violet-600 mb-2">
            <ArrowLeft className="w-4 h-4" /><span>Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Paniers validés (payés)</h1>
          <p className="text-slate-500 text-sm">Paiements avec statut paid ou complete.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          {error && <div className="p-4 bg-red-50 text-red-700 text-sm">{error}</div>}
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Client</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Montant</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Moyen</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Ebooks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">Chargement...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">Aucun panier validé</td></tr>
              ) : rows.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 align-top">
                  <td className="px-6 py-4 text-slate-700 whitespace-nowrap">{r.date_paiement || ''}</td>
                  <td className="px-6 py-4 text-slate-700">{clientLabel(r.utilisateur_id)}</td>
                  <td className="px-6 py-4 text-slate-700 whitespace-nowrap">
                    {Number(r.montant || 0).toLocaleString('fr-FR')} {r.devise || 'XOF'}
                  </td>
                  <td className="px-6 py-4 text-slate-700">{r.moyen}</td>
                  <td className="px-6 py-4 text-slate-700">
                    <div className="space-y-1">
                      {(Array.isArray(r.items) ? r.items : []).map((it, idx) => (
                        <div key={idx} className="text-sm">
                          #{it.ebook_id ?? it.id} — {it.titre || 'Ebook'} ({Number(it.prix || 0).toLocaleString('fr-FR')} FCFA)
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
