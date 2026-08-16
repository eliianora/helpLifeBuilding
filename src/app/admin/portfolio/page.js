'use client'
import AdminTable from '@/components/AdminTable'
export default function Page() {
  return <AdminTable
    table="portfolio"
    title="Portfolio"
    fields={[
      { name: 'titre', label: 'Titre', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      {
        name: 'categorie_pro_id',
        label: 'Catégorie projet',
        type: 'select',
        optionsFrom: { table: 'categorie_pro', value: 'id', label: 'nom', order: 'nom', ascending: true },
      },
      {
        name: 'langages_id',
        label: 'Langage',
        type: 'select',
        optionsFrom: { table: 'langages', value: 'id', label: 'nom', order: 'nom', ascending: true },
      },
      { name: 'image_url', label: 'Image URL', type: 'text' },
      { name: 'lien_demo', label: 'Lien démo', type: 'text' },
      { name: 'lien_github', label: 'Lien GitHub', type: 'text' },
    ]}
    columns={[
      { name: 'titre', label: 'Titre' },
      { name: 'categorie_pro_id', label: 'Cat.' },
      { name: 'langages_id', label: 'Langage' },
      { name: 'lien_demo', label: 'Démo' },
    ]}
  />
}
