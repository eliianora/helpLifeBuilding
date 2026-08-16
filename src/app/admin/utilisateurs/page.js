'use client'
import AdminTable from '@/components/AdminTable'
export default function Page() {
  return <AdminTable
    table="users"
    title="Utilisateurs"
    fields={[
      { name: 'nom', label: 'Nom', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'avatar_url', label: 'Avatar URL', type: 'text' },
      { name: 'role', label: 'Rôle', type: 'select', options: ['client', 'admin'] },
      { name: 'points', label: 'Points', type: 'number' },
    ]}
    columns={[
      { name: 'id', label: 'ID' },
      { name: 'nom', label: 'Nom' },
      { name: 'email', label: 'Email' },
      { name: 'role', label: 'Rôle' },
      { name: 'points', label: 'Points' },
    ]}
  />
}
