'use client'
import AdminTable from '@/components/AdminTable'
export default function Page() {
  return <AdminTable
    table="bande_info"
    title="Bande Information"
    fields={[
      { name: 'type', label: 'Type', type: 'select', options: ['text', 'image', 'video', 'audio'] },
      { name: 'contenu', label: 'Contenu', type: 'textarea' },
      { name: 'media_url', label: 'Media URL', type: 'text' },
      { name: 'lien', label: 'Lien', type: 'text' },
      { name: 'actif', label: 'Actif', type: 'checkbox' },
      { name: 'ordre', label: 'Ordre', type: 'number' },
    ]}
    columns={[
      { name: 'type', label: 'Type' },
      { name: 'contenu', label: 'Contenu' },
      { name: 'lien', label: 'Lien' },
      { name: 'actif', label: 'Actif', render: v => v ? '✅' : '❌' },
    ]}
  />
}
