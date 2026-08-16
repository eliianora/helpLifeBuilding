import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.error('Variables NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY requises.')
  }
}

// Navigateur : cookies (lus par le middleware). SSR : client éphémère sans persistance.
export const supabase =
  typeof window !== 'undefined'
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })

// ============ CRUD GENERIQUE ============
export async function listAll(table, opts = {}) {
  let q = supabase.from(table).select(opts.select || '*')
  if (opts.order) q = q.order(opts.order, { ascending: opts.ascending ?? false })
  const { data, error } = await q
  if (error) throw error
  return data || []
}
export async function getOne(table, id) {
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
  if (error) throw error
  return data
}
export async function createOne(table, payload) {
  const { data, error } = await supabase.from(table).insert([payload]).select()
  if (error) throw error
  return data?.[0]
}
export async function updateOne(table, id, updates) {
  const { data, error } = await supabase.from(table).update(updates).eq('id', id).select()
  if (error) throw error
  return data?.[0]
}
export async function deleteOne(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
  return true
}

// ============ AUTH ============
export async function signUp(email, password, nom) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nom, role: 'client' } },
  })
  if (error) throw error
  if (data?.user && data?.session) {
    await ensureUserProfile({
      id: data.user.id,
      email: data.user.email,
      nom: data.user.user_metadata?.nom || nom || null,
      role: 'client',
    }, { strict: true })
  }
  return data
}
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  // IMPORTANT: on ne crée PAS de profil automatiquement au login.
  // - client: profil créé via signUp (/inscription)
  // - admin: profil créé manuellement en base avec role='admin'
  return data
}
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  clearLocalCart()
}
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getCurrentUserRole() {
  const user = await getCurrentUser().catch(() => null)
  if (!user) return null
  const { data, error } = await supabase.from('users').select('role').eq('id', user.id).maybeSingle()
  if (error) return null
  return data?.role || null
}
export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) {
    const err = new Error('AUTH_REQUIRED')
    err.code = 'AUTH_REQUIRED'
    throw err
  }
  return user
}
export async function requestPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
  return true
}
export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
  return data
}
export async function setSessionFromRecoveryUrl() {
  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) throw error
    return data?.session || null
  }
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const access_token = hashParams.get('access_token')
  const refresh_token = hashParams.get('refresh_token')
  if (access_token && refresh_token) {
    const { data, error } = await supabase.auth.setSession({ access_token, refresh_token })
    if (error) throw error
    return data?.session || null
  }
  return null
}

// ============ PROFIL UTILISATEUR (table `users`) ============
export async function ensureUserProfile(profile, { strict = false } = {}) {
  if (!profile?.id) return null
  try {
    const { data: existing, error: e1 } = await supabase
      .from('users')
      .select('id,role')
      .eq('id', profile.id)
      .maybeSingle()
    if (e1) throw e1
    if (existing?.id) return existing
    const { data, error } = await supabase.from('users').insert([{
      id: profile.id,
      email: profile.email || null,
      nom: profile.nom || null,
      avatar_url: profile.avatar_url || null,
      role: profile.role || 'client',
    }]).select()
    if (error) throw error
    return data?.[0] || null
  } catch (err) {
    if (strict) throw err
    return null
  }
}

// ============ STORAGE ============
export async function uploadFile(bucket, path, file) {
  const cleanPath = String(path || '').replace(/^\/+/, '')
  const { error } = await supabase.storage.from(bucket).upload(cleanPath, file, { upsert: true })
  if (error) throw error
  return cleanPath
}

// ============ PANIER (local + supabase sync) ============
const CART_KEY = 'hlb_cart'
export function getLocalCart() {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]') } catch { return [] }
}
export function setLocalCart(items) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('cart-updated'))
}
export function addToLocalCart(ebook) {
  const cart = getLocalCart()
  if (!cart.find(i => i.id === ebook.id)) {
    cart.push(ebook)
    setLocalCart(cart)
  }
}
export function removeFromLocalCart(id) {
  setLocalCart(getLocalCart().filter(i => i.id !== id))
}
export function clearLocalCart() { setLocalCart([]) }

// ============ ACHATS / ACCES EBOOKS ============
// Tables recommandées:
// - `paiement` (id, utilisateur_id, montant, devise, moyen, statut, date, items)
// - `ebook_achats` (id, utilisateur_id, ebook_id, paiement_id, created_at)
export async function hasEbookAccess(ebookId, userId) {
  if (!ebookId || !userId) return false
  const { data, error } = await supabase
    .from('ebook_achats')
    .select('id')
    .eq('utilisateur_id', userId)
    .eq('ebook_id', ebookId)
    .limit(1)
  if (error) return false
  return (data || []).length > 0
}

export async function getPurchasedEbookIds(userId) {
  if (!userId) return new Set()
  const { data, error } = await supabase
    .from('ebook_achats')
    .select('ebook_id')
    .eq('utilisateur_id', userId)
  if (error) throw error
  return new Set((data || []).map(row => String(row.ebook_id)))
}

export async function listPurchasedEbooks(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('ebook_achats')
    .select('ebook_id, created_at, ebooks(id,titre,description,image_url,auteur)')
    .eq('utilisateur_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error

  return (data || [])
    .map(row => ({
      id: row.ebooks?.id || row.ebook_id,
      titre: row.ebooks?.titre || 'Ebook',
      description: row.ebooks?.description || '',
      image_url: row.ebooks?.image_url || '',
      auteur: row.ebooks?.auteur || '',
      acheteLe: row.created_at,
    }))
    .filter(item => item.id)
}

export async function completeCheckout({ moyen, ebookIds, nom_client, email_client }) {
  const user = await requireUser()
  const ids = [...new Set((ebookIds || []).map(String).filter(Boolean))]
  if (!ids.length) {
    const err = new Error('Panier vide')
    err.code = 'EMPTY_CART'
    throw err
  }

  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  if (!token) {
    const err = new Error('AUTH_REQUIRED')
    err.code = 'AUTH_REQUIRED'
    throw err
  }

  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      moyen,
      ebookIds: ids,
      nom_client,
      email_client,
    }),
  })

  const payload = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(payload.error || 'Paiement impossible')
    if (payload.error === 'AUTH_REQUIRED') err.code = 'AUTH_REQUIRED'
    throw err
  }

  return payload
}

/** @deprecated Utiliser completeCheckout */
export async function createPaymentAndGrantEbookAccess(opts) {
  const ids = (opts.items || []).map(i => i.ebook_id ?? i.id).filter(Boolean)
  return completeCheckout({
    moyen: opts.moyen,
    ebookIds: ids,
    nom_client: null,
    email_client: null,
  })
}

/** @deprecated Inclus dans completeCheckout */
export async function createCommande() {
  throw new Error('Utiliser completeCheckout')
}

// ============ LECTURE EBOOK ============
export function detectEbookReadingMode(fichierUrl) {
  const raw = String(fichierUrl || '').trim()
  if (!raw) return null
  const lower = (() => {
    try { return new URL(raw).pathname.toLowerCase() } catch { return raw.toLowerCase().split('#')[0].split('?')[0] }
  })()
  if (lower.includes('.pdf')) return 'pdf'
  if (lower.includes('.epub')) return 'epub'
  return 'file'
}

export function normalizeEbookPages(ebook) {
  const fromColumn = ebook?.contenu_pages
  if (Array.isArray(fromColumn) && fromColumn.length) {
    return fromColumn.map((entry, idx) => {
      if (typeof entry === 'string' && entry.trim()) return entry.trim()
      if (entry && typeof entry === 'object') {
        const text = entry.text ?? entry.contenu ?? entry.content
        if (typeof text === 'string' && text.trim()) return text.trim()
      }
      return `Page ${idx + 1}`
    })
  }
  return []
}

export function resolveEbookReadingPlan(ebook) {
  const textPages = normalizeEbookPages(ebook)
  const fileRef = String(ebook?.fichier_url || '').trim()
  const fileMode = fileRef ? detectEbookReadingMode(fileRef) : null

  if (fileMode === 'pdf' || fileMode === 'epub' || fileMode === 'file') {
    return { mode: fileMode === 'file' ? 'pdf' : fileMode, pages: textPages, hasFile: true, hasText: textPages.length > 0 }
  }
  if (textPages.length > 0) {
    return { mode: 'text', pages: textPages, hasFile: false, hasText: true }
  }
  return { mode: 'unavailable', pages: [], hasFile: false, hasText: false }
}

const EBOOK_READING_SELECT = 'id,titre,description,auteur,pages,image_url,fichier_url,statut'

function isMissingContenuPagesColumn(error) {
  const message = String(error?.message || '')
  return error?.code === '42703' || message.includes('contenu_pages')
}

async function fetchEbookForReading(ebookId) {
  const withPages = await supabase
    .from('ebooks')
    .select(`${EBOOK_READING_SELECT},contenu_pages`)
    .eq('id', ebookId)
    .single()

  if (!withPages.error) return withPages.data
  if (!isMissingContenuPagesColumn(withPages.error)) throw withPages.error

  const fallback = await supabase
    .from('ebooks')
    .select(EBOOK_READING_SELECT)
    .eq('id', ebookId)
    .single()

  if (fallback.error) throw fallback.error
  return fallback.data
}

export async function getPurchasedEbookForReading(ebookId) {
  const user = await requireUser()
  const allowed = await hasEbookAccess(ebookId, user.id)
  if (!allowed) {
    const err = new Error('ACCESS_DENIED')
    err.code = 'ACCESS_DENIED'
    throw err
  }

  return fetchEbookForReading(ebookId)
}

// ============ FICHE PUBLIQUE EBOOK (extrait gratuit) ============
// Accessible sans connexion : sert à attirer les visiteurs (SEO, partage, aperçu).
const EBOOK_PUBLIC_SELECT =
  'id,titre,description,prix,prix_original,image_url,auteur,notation,nombre_avis,ventes,bestseller,statut,pages,categorie_eb(nom)'

export async function getPublicEbook(ebookId) {
  const withPages = await supabase
    .from('ebooks')
    .select(`${EBOOK_PUBLIC_SELECT},contenu_pages`)
    .eq('id', ebookId)
    .eq('statut', 'publie')
    .single()

  if (!withPages.error) return withPages.data
  if (!isMissingContenuPagesColumn(withPages.error)) throw withPages.error

  const fallback = await supabase
    .from('ebooks')
    .select(EBOOK_PUBLIC_SELECT)
    .eq('id', ebookId)
    .eq('statut', 'publie')
    .single()
  if (fallback.error) throw fallback.error
  return fallback.data
}

// Découpe un extrait gratuit à partir de `contenu_pages`, avec repli sur la description.
// Ne renvoie jamais l'intégralité du livre : c'est uniquement un aperçu marketing.
export function getFreeExcerpt(ebook, { maxPages = 2, maxChars = 1400 } = {}) {
  const pages = normalizeEbookPages(ebook)
  if (pages.length > 0) {
    const slice = pages.slice(0, maxPages)
    let text = slice.join('\n\n')
    let truncated = pages.length > maxPages
    if (text.length > maxChars) {
      text = text.slice(0, maxChars).trim() + '…'
      truncated = true
    }
    return { text, truncated, source: 'pages' }
  }
  const desc = String(ebook?.description || '').trim()
  if (desc) return { text: desc, truncated: false, source: 'description' }
  return { text: '', truncated: false, source: 'none' }
}

export async function listRelatedEbooks(categorieNom, excludeId, limit = 3) {
  const { data, error } = await supabase
    .from('ebooks')
    .select('id,titre,prix,image_url,auteur,notation,statut,categorie_eb(nom)')
    .eq('statut', 'publie')
    .neq('id', excludeId)
    .limit(12)
  if (error) throw error
  const rows = data || []
  const sameCategory = categorieNom
    ? rows.filter(r => (r.categorie_eb?.nom || '') === categorieNom)
    : []
  const pool = sameCategory.length ? sameCategory : rows
  return pool.slice(0, limit)
}

export function getStoragePublicUrl(bucket, objectPath) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  const path = String(objectPath || '').replace(/^\/+/, '')
  if (!base || !path) return ''
  return `${base.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${path}`
}

export function resolveStorageHref(fichierUrl, bucket = 'ebooks') {
  const raw = String(fichierUrl || '').trim()
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  return getStoragePublicUrl(bucket, raw)
}

export async function resolveEbookFileUrl(fichierUrl) {
  const raw = String(fichierUrl || '').trim()
  if (!raw) return ''

  const signObject = async (bucket, objectPath) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(objectPath.replace(/^\/+/, ''), 60 * 60)
    if (error) throw error
    return data?.signedUrl || ''
  }

  if (!/^https?:\/\//i.test(raw)) {
    try {
      return await signObject('ebooks', raw)
    } catch {
      return getStoragePublicUrl('ebooks', raw)
    }
  }

  if (raw.includes('/storage/v1/object/public/')) {
    return raw
  }

  if (raw.includes('/storage/v1/object/')) {
    try {
      const u = new URL(raw)
      const idx = u.pathname.indexOf('/storage/v1/object/')
      const after = u.pathname.slice(idx + '/storage/v1/object/'.length)
      const parts = after.split('/').filter(Boolean)
      const bucket = parts[0] === 'sign' ? parts[1] : parts[0]
      const objectPath = (parts[0] === 'sign' ? parts.slice(2) : parts.slice(1)).join('/')
      if (bucket && objectPath) return await signObject(bucket, objectPath)
    } catch {
      return raw
    }
  }

  return raw
}

// ============ LECTURE / PROGRESSION ============
const PROG_KEY = 'hlb_reading_progress'
export function getProgress(ebookId) {
  if (typeof window === 'undefined') return { page: 1, percent: 0 }
  try {
    const all = JSON.parse(localStorage.getItem(PROG_KEY) || '{}')
    return all[ebookId] || { page: 1, percent: 0 }
  } catch { return { page: 1, percent: 0 } }
}
export function setProgress(ebookId, page, totalPages) {
  if (typeof window === 'undefined') return
  const all = JSON.parse(localStorage.getItem(PROG_KEY) || '{}')
  const percent = totalPages > 0 ? Math.round((page / totalPages) * 100) : 0
  all[ebookId] = { page, percent, totalPages, updatedAt: new Date().toISOString() }
  localStorage.setItem(PROG_KEY, JSON.stringify(all))

  // Sync best-effort dans une table `ebook_progress` (multi-device).
  // Table recommandée: (utilisateur_id uuid, ebook_id uuid, page int, percent int, total_pages int, updated_at timestamptz)
  ;(async () => {
    try {
      const user = await getCurrentUser()
      if (!user) return
      await supabase.from('ebook_progress').upsert([{
        utilisateur_id: user.id,
        ebook_id: ebookId,
        page,
        percent,
        total_pages: totalPages,
        updated_at: new Date().toISOString(),
      }], { onConflict: 'utilisateur_id,ebook_id' })
    } catch (_) {}
  })()
}

// ============ COMMUNAUTÉ ============
function formatCommunityDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
}

function mapCommunityAuthor(profile) {
  if (!profile) {
    return { auteur: 'Membre', avatar: '👤', role: 'client' }
  }
  return {
    auteur: profile.nom || 'Membre',
    avatar: profile.avatar_url || '👤',
    role: profile.role || 'client',
  }
}

async function fetchCommunityProfiles(userIds) {
  if (!userIds.length) return {}
  const { data, error } = await supabase
    .from('users')
    .select('id,nom,avatar_url,role,points')
    .in('id', userIds)
  if (error) throw error
  return Object.fromEntries((data || []).map(profile => [profile.id, profile]))
}

async function fetchLikedPostIds(postIds, userId) {
  if (!userId || !postIds.length) return new Set()
  const { data, error } = await supabase
    .from('community_post_likes')
    .select('post_id')
    .eq('user_id', userId)
    .in('post_id', postIds)
  if (error) {
    if (error.code === 'PGRST205') return new Set()
    throw error
  }
  return new Set((data || []).map(row => row.post_id))
}

async function fetchCommunityCommentCounts(postIds) {
  if (!postIds.length) return {}
  const { data, error } = await supabase
    .from('community_comments')
    .select('post_id')
    .in('post_id', postIds)
  if (error) {
    if (error.code === 'PGRST205') return {}
    throw error
  }
  return (data || []).reduce((acc, row) => {
    acc[row.post_id] = (acc[row.post_id] || 0) + 1
    return acc
  }, {})
}

export async function getCommunityStats() {
  const [members, posts] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('community_posts').select('id', { count: 'exact', head: true }),
  ])
  if (members.error) throw members.error
  if (posts.error) throw posts.error
  return {
    membersCount: members.count || 0,
    postsCount: posts.count || 0,
  }
}

export async function getTopCommunityMembers(limit = 3) {
  const { data, error } = await supabase
    .from('users')
    .select('nom,avatar_url,points')
    .order('points', { ascending: false })
    .limit(limit)
  if (error) throw error
  const badges = ['🥇', '🥈', '🥉']
  return (data || []).map((member, index) => ({
    nom: member.nom || 'Membre',
    avatar: member.avatar_url || '👤',
    points: member.points || 0,
    badge: badges[index] || '⭐',
  }))
}

export async function listCommunityTestimonials({ limit = 3 } = {}) {
  const posts = await listCommunityPosts({ limit: Math.max(limit * 4, 12) })
  return posts
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, limit)
}

export async function listCommunityPosts({ limit = 30 } = {}) {
  const { data: posts, error } = await supabase
    .from('community_posts')
    .select('id,contenu,likes,created_at,user_id')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error

  const rows = posts || []
  const postIds = rows.map(post => post.id)
  const userIds = [...new Set(rows.map(post => post.user_id).filter(Boolean))]
  const user = await getCurrentUser().catch(() => null)

  const [profiles, likedPostIds, commentCounts] = await Promise.all([
    fetchCommunityProfiles(userIds),
    fetchLikedPostIds(postIds, user?.id),
    fetchCommunityCommentCounts(postIds),
  ])

  return rows.map(post => ({
    id: post.id,
    user_id: post.user_id,
    contenu: post.contenu,
    likes: post.likes || 0,
    commentaires: commentCounts[post.id] || 0,
    date: formatCommunityDate(post.created_at),
    likedByMe: likedPostIds.has(post.id),
    ...mapCommunityAuthor(profiles[post.user_id]),
  }))
}

export async function createCommunityPost(contenu) {
  const user = await requireUser()
  await ensureUserProfile({
    id: user.id,
    email: user.email,
    nom: user.user_metadata?.nom || user.email?.split('@')[0] || null,
  })

  const { error } = await supabase.from('community_posts').insert([{
    user_id: user.id,
    contenu: contenu.trim(),
    likes: 0,
  }])
  if (error) throw error
}

export async function toggleCommunityPostLike(postId) {
  const user = await requireUser()
  const { data, error } = await supabase.rpc('toggle_community_post_like', {
    p_post_id: postId,
  })
  if (!error) {
    return { likes: Number(data || 0), likedByMe: null }
  }

  const { data: existing, error: existingError } = await supabase
    .from('community_post_likes')
    .select('post_id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle()
  if (existingError) {
    if (existingError.code === 'PGRST205') {
      const err = new Error('LIKE_UNAVAILABLE')
      err.code = 'LIKE_UNAVAILABLE'
      throw err
    }
    throw existingError
  }

  if (existing?.post_id) {
    const { error: deleteError } = await supabase
      .from('community_post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id)
    if (deleteError) throw deleteError
  } else {
    const { error: insertError } = await supabase
      .from('community_post_likes')
      .insert([{ post_id: postId, user_id: user.id }])
    if (insertError) throw insertError
  }

  const { data: post, error: postError } = await supabase
    .from('community_posts')
    .select('likes')
    .eq('id', postId)
    .single()
  if (postError) throw postError
  return {
    likes: post?.likes || 0,
    likedByMe: !existing?.post_id,
  }
}

export async function listCommunityComments(postId) {
  const { data, error } = await supabase
    .from('community_comments')
    .select('id,contenu,created_at,user_id')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  if (error) {
    if (error.code === 'PGRST205') return []
    throw error
  }

  const rows = data || []
  const userIds = [...new Set(rows.map(row => row.user_id).filter(Boolean))]
  const profiles = await fetchCommunityProfiles(userIds)

  return rows.map(row => ({
    id: row.id,
    contenu: row.contenu,
    date: formatCommunityDate(row.created_at),
    ...mapCommunityAuthor(profiles[row.user_id]),
  }))
}

export async function addCommunityComment(postId, contenu) {
  const user = await requireUser()
  await ensureUserProfile({
    id: user.id,
    email: user.email,
    nom: user.user_metadata?.nom || user.email?.split('@')[0] || null,
  })

  const { error } = await supabase.from('community_comments').insert([{
    post_id: postId,
    user_id: user.id,
    contenu: contenu.trim(),
  }])
  if (error) {
    if (error.code === 'PGRST205') {
      const err = new Error('COMMENTS_UNAVAILABLE')
      err.code = 'COMMENTS_UNAVAILABLE'
      throw err
    }
    throw error
  }
}
