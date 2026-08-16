'use client'

import AdminTable from '@/components/AdminTable'
import { formatFcfa } from '@/lib/money'
import { resolveStorageHref } from '@/lib/supabase'

export default function Page() {
  return <AdminTable
    table="ebooks"
    title="Gestion des Ebooks"
    fields={[
      { name: 'titre', label: 'Titre', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'prix', label: 'Prix (FCFA)', type: 'number' },
      {
        name: 'categorie_eb_id',
        label: 'Catégorie',
        type: 'select',
        optionsFrom: { table: 'categorie_eb', value: 'id', label: 'nom', order: 'nom', ascending: true },
      },
      { name: 'auteur', label: 'Auteur', type: 'text' },
      { name: 'image_url', label: 'Image (URL)', type: 'text' },
      {
        name: 'fichier_url',
        label: 'Fichier (PDF/EPUB)',
        type: 'file',
        accept: '.pdf,.epub,application/pdf',
        upload: { bucket: 'ebooks', prefix: 'files' },
        help: 'Crée un bucket Storage `ebooks` (public) ou utilise des URLs signées.',
      },
      { name: 'statut', label: 'Statut', type: 'select', options: ['publie', 'brouillon', 'archive'] },
    ]}
    columns={[
      { name: 'titre', label: 'Titre', truncate: true, maxWidth: 260 },
      { name: 'auteur', label: 'Auteur', truncate: true, maxWidth: 180 },
      {
        name: 'fichier_url',
        label: 'Fichier',
        maxWidth: 220,
        render: (v) => {
          const url = resolveStorageHref(v)
          if (!url) return '—'
          return (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 text-sm font-medium"
            >
              Ouvrir
            </a>
          )
        },
      },
      { name: 'prix', label: 'Prix', maxWidth: 120, render: v => formatFcfa(v) },
      { name: 'statut', label: 'Statut', maxWidth: 110, tdClassName: 'whitespace-nowrap' },
    ]}
  />
}
