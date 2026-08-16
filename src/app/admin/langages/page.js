'use client'
import AdminTable from '@/components/AdminTable'
export default function Page() {
  return <AdminTable
    table="langages"
    title="Langages"
    fields={[{ name: 'nom', label: 'Nom', type: 'text' }]}
    columns={[{ name: 'nom', label: 'Nom' }]}
  />
}
