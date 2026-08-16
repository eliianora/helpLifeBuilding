'use client'
import AdminTable from '@/components/AdminTable'
export default function Page() {
  return <AdminTable
    table="rendez_vous"
    title="Rendez-vous"
    fields={[
      {
        name: 'service_id',
        label: 'Service',
        type: 'select',
        optionsFrom: { table: 'services', value: 'id', label: 'titre', order: 'ordre', ascending: true },
      },
      { name: 'nom_client', label: 'Nom client', type: 'text' },
      { name: 'email_client', label: 'Email', type: 'text' },
      { name: 'telephone', label: 'Téléphone', type: 'text' },
      { name: 'message', label: 'Message', type: 'textarea' },
      { name: 'date_rdv', label: 'Date (ISO)', type: 'text' },
      { name: 'heure_rdv', label: 'Heure (HH:MM:SS)', type: 'text' },
      { name: 'duree', label: 'Durée (minutes)', type: 'number' },
      { name: 'statut', label: 'Statut', type: 'select', options: ['en_attente', 'confirme', 'annule', 'termine'] },
      { name: 'notes_admin', label: 'Notes admin', type: 'textarea' },
    ]}
    columns={[
      { name: 'id', label: 'ID' },
      { name: 'nom_client', label: 'Client' },
      { name: 'service_id', label: 'Service' },
      { name: 'date_rdv', label: 'Date' },
      { name: 'statut', label: 'Statut' },
    ]}
  />
}
