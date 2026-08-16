'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, X, Save, Search } from 'lucide-react'
import { listAll, createOne, updateOne, deleteOne, uploadFile } from '@/lib/supabase'

/**
 * Tableau CRUD générique pour l'admin.
 * Props:
 *  - table: nom de la table supabase
 *  - title: titre affiché
 *  - fields: [{ name, label, type ('text'|'number'|'textarea'|'select'|'multiselect'|'checkbox'|'file'), options?, optionsFrom?, toPayload?, fromRow?, upload? }]
 *  - columns: [{ name, label, render?, thClassName?, tdClassName?, truncate?, maxWidth? }]
 */
export default function AdminTable({ table, title, fields, columns }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [dynamicOptions, setDynamicOptions] = useState({})

  const empty = fields.reduce((acc, f) => {
    if (f.type === 'checkbox') return { ...acc, [f.name]: false }
    if (f.type === 'multiselect') return { ...acc, [f.name]: [] }
    return { ...acc, [f.name]: '' }
  }, {})

  const normalizeMultiValue = (value, valueType) => {
    if (value == null || value === '') return []
    const arr = Array.isArray(value) ? value : [value]
    if (valueType === 'number') return arr.map(v => (v === '' || v == null ? null : Number(v))).filter(v => Number.isFinite(v))
    return arr.map(v => String(v)).filter(v => v.length > 0)
  }

  const getFieldOptions = (f) => {
    if (f.optionsFrom) return dynamicOptions[f.name] || []
    return f.options || []
  }

  const load = async () => {
    setLoading(true); setError('')
    try {
      const data = await listAll(table, { order: 'id', ascending: false })
      setRows(data)
    } catch (e) {
      setError(e.message || 'Erreur de chargement (la table existe-t-elle dans Supabase ?)')
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [table])

  useEffect(() => {
    let cancelled = false
    const loadOptions = async () => {
      const sources = fields.filter(f => f.optionsFrom)
      if (sources.length === 0) return
      try {
        const pairs = await Promise.all(sources.map(async f => {
          const src = f.optionsFrom
          const data = await listAll(src.table, { select: src.select || '*', order: src.order || 'id', ascending: src.ascending ?? true })
          const options = (data || []).map(row => ({
            value: row[src.value || 'id'],
            label: row[src.label || 'nom'] ?? String(row[src.value || 'id']),
          }))
          return [f.name, options]
        }))
        if (!cancelled) setDynamicOptions(Object.fromEntries(pairs))
      } catch (_) {
        if (!cancelled) setDynamicOptions({})
      }
    }
    loadOptions()
    return () => { cancelled = true }
  }, [fields])

  const open = (row = null) => {
    if (row) {
      setEditing(row)
      const f = { ...empty }
      fields.forEach(fi => {
        const raw = row[fi.name]
        if (typeof fi.fromRow === 'function') {
          f[fi.name] = fi.fromRow(row)
          return
        }
        if (fi.type === 'checkbox') f[fi.name] = raw ?? false
        else if (fi.type === 'multiselect') f[fi.name] = normalizeMultiValue(raw, fi.valueType)
        else f[fi.name] = raw ?? ''
      })
      setForm(f)
    } else {
      setEditing(null); setForm(empty)
    }
    setShowModal(true)
  }

  const uploadFormFile = async (f, recordId) => {
    const file = form[f.name]
    if (!(file instanceof File)) return null

    const upload = f.upload || {}
    const bucket = upload.bucket || table
    const prefix = upload.prefix || f.name
    const fileExt = file.name?.includes('.') ? file.name.split('.').pop() : 'bin'
    const fileName = `${crypto.randomUUID?.() || String(Date.now())}.${fileExt}`
    const path = `${prefix}/${recordId}/${fileName}`
    return uploadFile(bucket, path, file)
  }

  const resolveFileFieldValue = async (f, recordId) => {
    const v = form[f.name]
    if (v instanceof File) return uploadFormFile(f, recordId)
    if (typeof v === 'string' && v.trim()) return v.trim()
    if (editing?.[f.name]) return editing[f.name]
    return null
  }

  const save = async () => {
    try {
      const fileFields = fields.filter(f => f.type === 'file')
      const nonFileFields = fields.filter(f => f.type !== 'file')

      const payload = {}
      for (const f of nonFileFields) {
        if (typeof f.toPayload === 'function') {
          const patch = f.toPayload(form, payload)
          if (patch && typeof patch === 'object') Object.assign(payload, patch)
          continue
        }
        let v = form[f.name]
        if (f.type === 'number') v = v === '' ? null : Number(v)
        if (f.type === 'multiselect') v = normalizeMultiValue(v, f.valueType)
        payload[f.name] = v
      }

      if (editing) {
        for (const f of fileFields) {
          payload[f.name] = await resolveFileFieldValue(f, editing.id)
        }
        await updateOne(table, editing.id, payload)
      } else {
        for (const f of fileFields) {
          payload[f.name] = null
        }
        const created = await createOne(table, payload)
        if (!created?.id) throw new Error('Création impossible')

        const filePatch = {}
        for (const f of fileFields) {
          const url = await uploadFormFile(f, created.id)
          if (url) filePatch[f.name] = url
        }
        if (Object.keys(filePatch).length) {
          await updateOne(table, created.id, filePatch)
        }
      }

      setShowModal(false)
      load()
    } catch (e) {
      const msg = [
        e?.message,
        e?.details,
        e?.hint,
        e?.code ? `code=${e.code}` : null,
      ].filter(Boolean).join('\n')
      alert(msg || 'Erreur')
    }
  }

  const remove = async (id) => {
    if (!confirm('Supprimer cet élément ?')) return
    try { await deleteOne(table, id); load() } catch (e) { alert(e.message) }
  }

  const filtered = rows.filter(r =>
    !search || JSON.stringify(r).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-slate-600 hover:text-violet-600 mb-2">
              <ArrowLeft className="w-4 h-4" /><span>Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          </div>
          <button onClick={() => open()} className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700">
            <Plus className="w-5 h-5" /><span>Ajouter</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..." className="pl-10 pr-4 py-2 w-full rounded-lg bg-slate-100 border-none focus:ring-2 focus:ring-violet-300" />
            </div>
            <span className="text-sm text-slate-500">{filtered.length} élément(s)</span>
          </div>

          {error && <div className="p-4 bg-red-50 text-red-700 text-sm">{error}</div>}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  {columns.map(c => (
                    <th
                      key={c.name}
                      className={`px-6 py-4 text-left text-sm font-medium text-slate-500 whitespace-nowrap ${c.thClassName || ''}`}
                      style={c.maxWidth ? { maxWidth: c.maxWidth } : undefined}
                    >
                      {c.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right text-sm font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={columns.length + 1} className="p-8 text-center text-slate-400">Chargement...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={columns.length + 1} className="p-8 text-center text-slate-400">Aucun élément</td></tr>
                ) : filtered.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    {columns.map(c => (
                      <td
                        key={c.name}
                        className={`px-6 py-4 text-slate-700 align-top ${c.tdClassName || ''}`}
                        style={c.maxWidth ? { maxWidth: c.maxWidth } : undefined}
                        title={c.truncate ? String(row[c.name] ?? '') : undefined}
                      >
                        <div className={c.truncate ? 'truncate' : ''} style={c.maxWidth ? { maxWidth: c.maxWidth } : undefined}>
                          {c.render ? c.render(row[c.name], row) : String(row[c.name] ?? '')}
                        </div>
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => open(row)} className="p-2 rounded-lg hover:bg-violet-100 text-violet-600"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => remove(row.id)} className="p-2 rounded-lg hover:bg-red-100 text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">{editing ? 'Modifier' : 'Ajouter'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {fields.map(f => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea rows={3} value={form[f.name] ?? ''} onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-300" />
                  ) : f.type === 'multiselect' ? (
                    <select
                      multiple
                      value={(form[f.name] || []).map(v => String(v))}
                      onChange={e => {
                        const next = Array.from(e.target.selectedOptions).map(o => o.value)
                        setForm({ ...form, [f.name]: f.valueType === 'number' ? next.map(Number) : next })
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-300 min-h-[120px]"
                    >
                      {getFieldOptions(f).map(o => {
                        const value = typeof o === 'object' ? o.value : o
                        const label = typeof o === 'object' ? o.label : o
                        return <option key={String(value)} value={String(value)}>{label}</option>
                      })}
                    </select>
                  ) : f.type === 'select' ? (
                    <select value={form[f.name] ?? ''} onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-300">
                      <option value="">Sélectionner</option>
                      {getFieldOptions(f).map(o => {
                        const value = typeof o === 'object' ? o.value : o
                        const label = typeof o === 'object' ? o.label : o
                        return <option key={String(value)} value={String(value)}>{label}</option>
                      })}
                    </select>
                  ) : f.type === 'checkbox' ? (
                    <input type="checkbox" checked={!!form[f.name]} onChange={e => setForm({ ...form, [f.name]: e.target.checked })}
                      className="w-5 h-5 accent-violet-600" />
                  ) : f.type === 'file' ? (
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept={f.accept || '*/*'}
                        onChange={e => setForm({ ...form, [f.name]: e.target.files?.[0] || null })}
                        className="w-full"
                      />
                      {typeof form[f.name] === 'string' && form[f.name] && (
                        <a href={form[f.name]} target="_blank" rel="noreferrer" className="text-sm text-violet-700 hover:text-violet-800">
                          Voir le fichier actuel
                        </a>
                      )}
                      <div className="text-xs text-slate-500">
                        {f.help || 'Le fichier sera uploadé puis l’URL sera enregistrée.'}
                      </div>
                    </div>
                  ) : (
                    <input type={f.type === 'number' ? 'number' : 'text'} step={f.type === 'number' ? '0.01' : undefined}
                      value={form[f.name] ?? ''} onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-300" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">Annuler</button>
              <button onClick={save} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-700">
                <Save className="w-4 h-4" /><span>Enregistrer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
