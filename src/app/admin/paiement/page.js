'use client'
import AdminTable from '@/components/AdminTable'
export default function Page() {
  return <AdminTable
    table="paiement"
    title="Paiements"
    fields={[
      { name: 'utilisateur_id', label: 'Utilisateur', type: 'text' },
      { name: 'montant', label: 'Montant', type: 'number' },
      { name: 'devise', label: 'Devise', type: 'text' },
      { name: 'date_paiement', label: 'Date paiement (ISO)', type: 'text' },
      { name: 'statut', label: 'Statut', type: 'select', options: ['pending', 'paid', 'complete', 'failed', 'cancelled'] },
      { name: 'moyen', label: 'Moyen', type: 'select', options: ['card', 'mtnmoney', 'wave', 'ommoney', 'moovmoney'] },
    ]}
    columns={[
      { name: 'utilisateur_id', label: 'Utilisateur' },
      { name: 'montant', label: 'Montant', render: (v, row) => `${Number(v || 0).toFixed(2)} ${row?.devise || ''}`.trim() },
      { name: 'moyen', label: 'Moyen' },
      { name: 'statut', label: 'Statut' },
      { name: 'date_paiement', label: 'Date' },
    ]}
  />
}
