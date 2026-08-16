'use client'
import AdminTable from '@/components/AdminTable'
export default function Page() {
  return <AdminTable
    table="auteurs"
    title="Gestion des Auteurs"
    fields={[
      { name: 'nom', label: 'Nom', type: 'text' },
      { name: 'prenom', label: 'Prénom', type: 'text' },
    ]}
    columns={[
      { name: 'nom', label: 'Nom' },
      { name: 'prenom', label: 'Prénom' },
    ]}
  />
}
