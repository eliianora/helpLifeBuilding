'use client'
import AdminTable from '@/components/AdminTable'
export default function Page() {
  return <AdminTable
    table="projet"
    title="Gestion des Projets"
    fields={[
      { name: 'icon', label: 'Icône (emoji ou URL)', type: 'text' },
      { name: 'titre', label: 'Titre', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      {
        name: 'categorie_pro_id',
        label: 'Catégorie projet',
        type: 'select',
        optionsFrom: { table: 'categorie_pro', value: 'id', label: 'nom', order: 'nom', ascending: true },
      },
      {
        name: 'langages_ids',
        label: 'Langages',
        type: 'multiselect',
        valueType: 'text',
        optionsFrom: { table: 'langages', value: 'id', label: 'nom', order: 'nom', ascending: true },
      },
      { name: 'statut', label: 'Statut', type: 'select', options: ['Publié', 'Brouillon', 'Archivé'] },
      { name: 'ordre', label: 'Ordre', type: 'number' },
      { name: 'visible', label: 'Visible', type: 'checkbox' },
    ]}
    columns={[
      { name: 'titre', label: 'Titre' },
      { name: 'categorie_pro_id', label: 'Cat.' },
      { name: 'langages_ids', label: 'Langages', render: v => Array.isArray(v) ? v.join(', ') : String(v ?? '') },
      { name: 'statut', label: 'Statut' },
      { name: 'visible', label: 'Visible', render: v => v ? '✅' : '❌' },
    ]}
  />
}
