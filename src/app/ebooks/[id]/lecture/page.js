'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Bookmark, ExternalLink } from 'lucide-react'
import Header from '@/components/Header'
import {
  getProgress,
  setProgress,
  requireUser,
  supabase,
  getPurchasedEbookForReading,
  resolveEbookFileUrl,
  resolveEbookReadingPlan,
  resolveStorageHref,
} from '@/lib/supabase'

export default function LectureEbook() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = params?.id
  const debug = process.env.NODE_ENV === 'development' && searchParams?.get('debug') === '1'

  const [ebook, setEbook] = useState(null)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState([])
  const [accessDenied, setAccessDenied] = useState(false)
  const [mode, setMode] = useState('text')
  const [readableUrl, setReadableUrl] = useState('')
  const [fileError, setFileError] = useState('')
  const [authState, setAuthState] = useState('checking')
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [ebookLoadError, setEbookLoadError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (cancelled) return
        if (!session) {
          setAuthState('anon')
          router.replace('/login')
          return
        }
        setAuthState('auth')
      } catch {
        if (cancelled) return
        setAuthState('anon')
        router.replace('/login')
      }
    })()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return
      if (!session) {
        setAuthState('anon')
        router.replace('/login')
      } else {
        setAuthState('auth')
      }
    })

    return () => {
      cancelled = true
      sub?.subscription?.unsubscribe?.()
    }
  }, [router])

  useEffect(() => {
    if (!id || authState !== 'auth') return

    let cancelled = false
    ;(async () => {
      setCheckingAccess(true)
      setAccessDenied(false)
      setEbookLoadError('')
      setFileError('')
      setReadableUrl('')
      setEbook(null)
      setPages([])

      try {
        await requireUser()
        const data = await getPurchasedEbookForReading(id)
        if (cancelled) return

        const plan = resolveEbookReadingPlan(data)

        setEbook(data)
        setPages(plan.pages)
        setMode(plan.mode)

        if (data?.fichier_url) {
          try {
            const url = await resolveEbookFileUrl(data.fichier_url)
            if (!cancelled) setReadableUrl(url)
          } catch (error) {
            if (!cancelled) {
              setFileError(error?.message || 'Impossible de charger le fichier de cet ebook.')
            }
          }
        }

        const saved = getProgress(id)
        if (!cancelled && saved?.page) setPage(saved.page)
      } catch (error) {
        if (cancelled) return
        if (error?.code === 'ACCESS_DENIED' || error?.message === 'ACCESS_DENIED') {
          setAccessDenied(true)
        } else {
          setEbookLoadError(error?.message || "Impossible de charger l'ebook.")
        }
      } finally {
        if (!cancelled) setCheckingAccess(false)
      }
    })()

    return () => { cancelled = true }
  }, [id, authState])

  const totalPages = useMemo(() => {
    if (mode === 'text') return Math.max(pages.length, 1)
    if (mode === 'unavailable') return 0
    const count = Number(ebook?.pages || 0)
    return Number.isFinite(count) && count > 0 ? count : 1
  }, [ebook?.pages, mode, pages.length])

  const percent = useMemo(() => {
    if (mode === 'unavailable' || totalPages < 1) return 0
    return Math.round((page / totalPages) * 100)
  }, [page, totalPages, mode])
  const fileUrl = useMemo(() => {
    if (readableUrl) return readableUrl
    return resolveStorageHref(ebook?.fichier_url)
  }, [readableUrl, ebook?.fichier_url])
  const pdfUrl = useMemo(() => {
    if (!fileUrl) return ''
    return `${fileUrl}#page=${page}`
  }, [fileUrl, page])
  const hasTextContent = mode === 'text' && pages.length > 0
  const hasFileContent = (mode === 'pdf' || mode === 'epub') && Boolean(fileUrl)
  const isUnavailable = mode === 'unavailable'
  const canRead = !checkingAccess && !accessDenied && !ebookLoadError

  useEffect(() => {
    if (id && canRead && totalPages > 0) setProgress(id, page, totalPages)
  }, [id, page, totalPages, canRead])

  const fileLoading = (mode === 'pdf' || mode === 'epub') && Boolean(ebook?.fichier_url) && !fileUrl && !fileError

  const go = (nextPage) => setPage(Math.min(Math.max(1, nextPage), totalPages))

  return (
    <div className="min-h-screen page-ambient">
      <Header />
      <main className="pt-20 pb-16 max-w-4xl mx-auto px-4">
        <Link href="/ebooks" className="inline-flex items-center gap-2 text-slate-600 hover:text-violet-600 mb-4">
          <ArrowLeft className="w-4 h-4" /> Bibliothèque
        </Link>

        {debug && (
          <div className="bg-white rounded-2xl shadow p-4 mb-6 text-xs text-slate-700 border border-slate-200">
            <div><strong>debug</strong></div>
            <div>id: {String(id || '')}</div>
            <div>checkingAccess: {String(checkingAccess)}</div>
            <div>accessDenied: {String(accessDenied)}</div>
            <div>mode: {mode}</div>
            <div>ebook.fichier_url: {String(ebook?.fichier_url || '')}</div>
            <div>readableUrl: {String(readableUrl || '')}</div>
            <div>pages: {String(pages.length)}</div>
            <div>fileError: {String(fileError || '')}</div>
            <div>ebookLoadError: {String(ebookLoadError || '')}</div>
          </div>
        )}

        {(authState === 'checking' || checkingAccess) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-slate-600">
            Chargement de votre ebook...
          </div>
        )}

        {accessDenied && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-yellow-200">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Accès refusé</h2>
            <p className="text-slate-600 mb-4">
              Cet ebook n’est pas encore dans vos achats. Finalisez le paiement pour y accéder.
            </p>
            <div className="flex gap-3">
              <Link href="/panier" className="px-5 py-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-700">
                Aller au panier
              </Link>
              <Link href="/ebooks" className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50">
                Retour aux ebooks
              </Link>
            </div>
          </div>
        )}

        {!checkingAccess && !accessDenied && ebookLoadError && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-red-200">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Ebook introuvable</h2>
            <p className="text-slate-600 mb-4">{ebookLoadError}</p>
            <Link href="/ebooks" className="px-5 py-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-700 inline-flex">
              Retour aux ebooks
            </Link>
          </div>
        )}

        {canRead && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl brand-gradient flex items-center justify-center text-white">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900">{ebook?.titre || 'Lecture en cours'}</h1>
                <p className="text-slate-500">{ebook?.auteur || 'Help Life Building'}</p>
              </div>
              {!isUnavailable && (
                <div className="text-right">
                  <div className="text-3xl font-bold text-violet-600">{percent}%</div>
                  <div className="text-xs text-slate-500">Progression</div>
                </div>
              )}
            </div>

            {!isUnavailable && (
              <div className="mt-5">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Page {page} / {totalPages}</span>
                  <span className="flex items-center gap-1"><Bookmark className="w-4 h-4" /> Sauvegarde auto</span>
                </div>
                <div className="h-3 bg-violet-100 rounded-full overflow-hidden">
                  <div className="h-full brand-gradient transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
              </div>
            )}
          </div>
        )}

        {canRead && (
          <div className="bg-white rounded-2xl shadow-lg min-h-[60vh] p-6 md:p-8 text-slate-700">
            {fileError && (
              <div className="mb-4 p-4 rounded-2xl border border-red-100 bg-red-50 text-red-700 text-sm">
                {fileError}
              </div>
            )}

            {mode === 'pdf' && hasFileContent ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-slate-600">
                    Lecture du fichier acheté. Si l’aperçu reste vide, ouvrez le PDF dans un nouvel onglet.
                  </div>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100"
                  >
                    <ExternalLink className="w-4 h-4" /> Ouvrir le PDF
                  </a>
                </div>
                <object
                  key={pdfUrl}
                  data={pdfUrl}
                  type="application/pdf"
                  className="w-full h-[75vh] rounded-xl border border-slate-200"
                >
                  <iframe
                    src={pdfUrl}
                    className="w-full h-[75vh] rounded-xl border border-slate-200"
                    title="Lecture PDF"
                  />
                </object>
              </div>
            ) : mode === 'epub' && hasFileContent ? (
              <div className="space-y-3">
                <p className="text-slate-600">
                  Fichier EPUB associé à votre achat.
                </p>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700"
                >
                  <ExternalLink className="w-4 h-4" /> Ouvrir l’EPUB
                </a>
              </div>
            ) : hasTextContent ? (
              <div className="p-2 md:p-4 leading-relaxed whitespace-pre-line">
                {pages[page - 1]}
              </div>
            ) : fileLoading ? (
              <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
                Chargement du fichier PDF...
              </div>
            ) : isUnavailable ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
                  <h2 className="font-bold text-lg mb-2">Contenu non disponible</h2>
                  <p>
                    Cet ebook n’a pas encore de fichier PDF associé. La description seule ne constitue pas le livre complet.
                  </p>
                </div>
                {ebook?.description && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">Résumé</h3>
                    <p className="text-slate-600 leading-relaxed">{ebook.description}</p>
                  </div>
                )}
                <p className="text-sm text-slate-500">
                  Un administrateur doit ouvrir <strong>Admin → Ebooks → Modifier</strong>, téléverser le PDF, puis cliquer sur <strong>Enregistrer</strong>.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-slate-600">
                <p>Le fichier est inaccessible pour le moment.</p>
                {fileUrl && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700"
                  >
                    <ExternalLink className="w-4 h-4" /> Ouvrir le fichier
                  </a>
                )}
                {fileError && <p className="text-sm text-red-600">{fileError}</p>}
              </div>
            )}
          </div>
        )}

        {canRead && mode === 'text' && hasTextContent && (
          <div className="flex items-center justify-between mt-6">
            <button onClick={() => go(page - 1)} disabled={page === 1}
              className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow disabled:opacity-40 hover:bg-violet-50">
              <ChevronLeft className="w-4 h-4" /> Précédent
            </button>
            <input type="range" min={1} max={totalPages} value={page} onChange={e => go(Number(e.target.value))}
              className="flex-1 mx-4 accent-violet-600" />
            <button onClick={() => go(page + 1)} disabled={page === totalPages}
              className="flex items-center gap-2 px-5 py-3 brand-gradient text-white rounded-xl shadow disabled:opacity-40">
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {canRead && mode !== 'text' && hasFileContent && (
          <div className="mt-6 bg-white rounded-2xl shadow p-4 flex items-center justify-between gap-4">
            <button onClick={() => go(page - 1)} disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" /> Page -
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">Page</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={page}
                onChange={e => go(Number(e.target.value || 1))}
                className="w-24 px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-300"
              />
              <span className="text-sm text-slate-600">/ {totalPages}</span>
            </div>
            <button onClick={() => go(page + 1)} disabled={page === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40">
              Page + <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
