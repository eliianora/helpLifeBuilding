'use client'
import AdminTable from '@/components/AdminTable'
export default function Page() {
  return <AdminTable
    table="categorie_pro"
    title="Catégories de Projet"
    fields={[{ name: 'nom', label: 'Nom', type: 'text' }]}
    columns={[{ name: 'nom', label: 'Nom' }]}
  />
}
