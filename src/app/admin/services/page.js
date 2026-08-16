'use client'
import AdminTable from '@/components/AdminTable'
export default function Page() {
  return <AdminTable
    table="services"
    title="Gestion des Services"
    fields={[
      { name: 'icone', label: 'Icône (ex: heart, users, briefcase)', type: 'text' },
      { name: 'couleur', label: 'Couleur tailwind (ex: from-violet-500 to-blue-600)', type: 'text' },
      { name: 'titre', label: 'Titre', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'prix', label: 'Prix', type: 'number' },
      { name: 'unite', label: 'Unité (ex: heure, Sur devis)', type: 'text' },
      {
        name: 'features_text',
        label: 'Avantages (séparés par |)',
        type: 'textarea',
        fromRow: (row) => Array.isArray(row.features) ? row.features.join(' | ') : '',
        toPayload: (form) => ({
          features: String(form.features_text || '')
            .split('|')
            .map(s => s.trim())
            .filter(Boolean),
        }),
      },
      {
        name: 'langages_ids',
        label: 'Langages',
        type: 'multiselect',
        valueType: 'text',
        optionsFrom: { table: 'langages', value: 'id', label: 'nom', order: 'nom', ascending: true },
      },
      { name: 'populaire', label: 'Populaire', type: 'checkbox' },
      { name: 'ordre', label: 'Ordre', type: 'number' },
      { name: 'actif', label: 'Actif', type: 'checkbox' },
    ]}
    columns={[
      { name: 'titre', label: 'Titre' },
      { name: 'prix', label: 'Prix', render: (v, row) => v == null ? (row?.unite || '') : `${Number(v || 0).toLocaleString('fr-FR')} FCFA` },
      { name: 'langages_ids', label: 'Langages', render: v => Array.isArray(v) ? v.join(', ') : String(v ?? '') },
      { name: 'unite', label: 'Unité' },
      { name: 'populaire', label: 'Populaire', render: v => v ? '✅' : '❌' },
      { name: 'actif', label: 'Actif', render: v => v ? '✅' : '❌' },
    ]}
  />
}
