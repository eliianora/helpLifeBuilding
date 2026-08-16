'use client'
import AdminTable from '@/components/AdminTable'
export default function Page() {
  return <AdminTable
    table="categorie_eb"
    title="Catégories d'Ebooks"
    fields={[{ name: 'nom', label: 'Nom', type: 'text' }]}
    columns={[{ name: 'nom', label: 'Nom' }]}
  />
}
