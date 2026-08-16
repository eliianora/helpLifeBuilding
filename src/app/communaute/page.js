'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart, MessageCircle, Send, Image, Smile, Users, Trophy, Star } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChatbotVendeur from '@/components/ChatbotVendeur'
import {
  addCommunityComment,
  createCommunityPost,
  getCommunityStats,
  getTopCommunityMembers,
  listCommunityComments,
  listCommunityPosts,
  toggleCommunityPostLike,
} from '@/lib/supabase'

const events = [
  { titre: 'Webinar Marketing Digital', date: 'Demain, 14h', participants: 156 },
  { titre: 'Atelier Productivité', date: 'Vendredi, 10h', participants: 89 },
  { titre: 'Session Q&A avec un Expert', date: 'Samedi, 16h', participants: 234 },
]

function CommunityAvatar({ avatar, className = '' }) {
  if (avatar && /^https?:\/\//.test(avatar)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={avatar} alt="" className={`rounded-full object-cover ${className}`} />
    )
  }

  return (
    <div className={`flex items-center justify-center rounded-full bg-slate-100 text-2xl ${className}`}>
      {avatar || '👤'}
    </div>
  )
}

export default function CommunautePage() {
  const router = useRouter()
  const [newPost, setNewPost] = useState('')
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState({ membersCount: 0, postsCount: 0 })
  const [topMembers, setTopMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null)
  const [commentsByPost, setCommentsByPost] = useState({})
  const [commentDrafts, setCommentDrafts] = useState({})
  const [commentsLoading, setCommentsLoading] = useState({})

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [postsData, statsData, leaders] = await Promise.all([
        listCommunityPosts(),
        getCommunityStats(),
        getTopCommunityMembers(),
      ])
      setPosts(postsData)
      setStats(statsData)
      setTopMembers(leaders)
    } catch (e) {
      setError(e?.message || 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handlePost = async () => {
    const contenu = newPost.trim()
    if (!contenu || publishing) return

    setPublishing(true)
    setActionError('')
    try {
      await createCommunityPost(contenu)
      setNewPost('')
      await load()
    } catch (e) {
      if (e?.code === 'AUTH_REQUIRED') {
        router.push('/login')
        return
      }
      setActionError(e?.message || 'Impossible de publier')
    } finally {
      setPublishing(false)
    }
  }

  const handleToggleLike = async (post) => {
    setActionError('')
    try {
      const result = await toggleCommunityPostLike(post.id)
      setPosts(prev => prev.map(item => {
        if (item.id !== post.id) return item
        const likedByMe = result.likedByMe ?? !item.likedByMe
        return {
          ...item,
          likes: result.likes,
          likedByMe,
        }
      }))
    } catch (e) {
      if (e?.code === 'AUTH_REQUIRED') {
        router.push('/login')
        return
      }
      if (e?.code === 'LIKE_UNAVAILABLE') {
        setActionError('Les likes seront disponibles après la mise à jour SQL de la communauté.')
        return
      }
      setActionError(e?.message || 'Impossible de mettre à jour le like')
    }
  }

  const loadComments = async (postId) => {
    setCommentsLoading(prev => ({ ...prev, [postId]: true }))
    try {
      const comments = await listCommunityComments(postId)
      setCommentsByPost(prev => ({ ...prev, [postId]: comments }))
    } catch (e) {
      setActionError(e?.message || 'Impossible de charger les commentaires')
    } finally {
      setCommentsLoading(prev => ({ ...prev, [postId]: false }))
    }
  }

  const toggleComments = async (postId) => {
    if (openCommentsPostId === postId) {
      setOpenCommentsPostId(null)
      return
    }

    setOpenCommentsPostId(postId)
    if (!commentsByPost[postId]) {
      await loadComments(postId)
    }
  }

  const handleComment = async (postId) => {
    const contenu = (commentDrafts[postId] || '').trim()
    if (!contenu) return

    setActionError('')
    try {
      await addCommunityComment(postId, contenu)
      setCommentDrafts(prev => ({ ...prev, [postId]: '' }))
      await loadComments(postId)
      setPosts(prev => prev.map(post => (
        post.id === postId
          ? { ...post, commentaires: (post.commentaires || 0) + 1 }
          : post
      )))
    } catch (e) {
      if (e?.code === 'AUTH_REQUIRED') {
        router.push('/login')
        return
      }
      if (e?.code === 'COMMENTS_UNAVAILABLE') {
        setActionError('Les commentaires seront disponibles après la mise à jour SQL de la communauté.')
        return
      }
      setActionError(e?.message || 'Impossible de publier le commentaire')
    }
  }

  return (
    <div className="min-h-screen page-ambient">
      <Header />
      <main className="relative z-10 pt-24 pb-16">
        <div className="hlb-shell">
          <div className="mb-8">
            <Link href="/" className="mb-4 inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-violet-600">
              <ArrowLeft className="h-4 w-4" /><span>Retour</span>
            </Link>
            <h1 className="section-title mb-4">Notre <span className="brand-gradient-text">Communauté</span></h1>
            <p className="section-subtitle">Échangez, apprenez et grandissez ensemble.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="premium-card p-6">
                <div className="flex gap-4">
                  <CommunityAvatar avatar="👤" className="h-12 w-12" />
                  <div className="flex-1">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Partagez quelque chose avec la communauté..."
                      rows={3}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-violet-300"
                    />
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-2">
                        <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Ajouter une image">
                          <Image className="h-5 w-5" />
                        </button>
                        <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Ajouter un emoji">
                          <Smile className="h-5 w-5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={handlePost}
                        disabled={!newPost.trim() || publishing}
                        className="premium-btn-primary !px-5 !py-2.5 !text-sm disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" /><span>{publishing ? 'Publication...' : 'Publier'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">
                  {error}
                </div>
              )}

              {actionError && (
                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-amber-800">
                  {actionError}
                </div>
              )}

              {loading ? (
                <div className="p-6 text-slate-500">Chargement...</div>
              ) : posts.length === 0 ? (
                <div className="premium-card p-8 text-center text-slate-500">
                  Aucune publication pour le moment. Soyez le premier à partager un message.
                </div>
              ) : posts.map(post => (
                <div key={post.id} className="premium-card p-6">
                  <div className="flex items-start gap-4">
                    <CommunityAvatar avatar={post.avatar} className="h-12 w-12" />
                    <div className="flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900">{post.auteur}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-sm text-slate-500">{post.role}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-sm text-slate-400">{post.date}</span>
                      </div>
                      <p className="mb-4 text-slate-700">{post.contenu}</p>
                      <div className="flex items-center gap-6">
                        <button
                          type="button"
                          onClick={() => handleToggleLike(post)}
                          className={`flex items-center gap-2 transition-colors ${post.likedByMe ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}
                        >
                          <Heart className={`h-5 w-5 ${post.likedByMe ? 'fill-current' : ''}`} />
                          <span>{post.likes}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleComments(post.id)}
                          className="flex items-center gap-2 text-slate-500 transition-colors hover:text-violet-500"
                        >
                          <MessageCircle className="h-5 w-5" /><span>{post.commentaires}</span>
                        </button>
                      </div>

                      {openCommentsPostId === post.id && (
                        <div className="mt-5 border-t border-slate-100 pt-5">
                          {commentsLoading[post.id] ? (
                            <p className="text-sm text-slate-500">Chargement des commentaires...</p>
                          ) : (
                            <div className="space-y-4">
                              {(commentsByPost[post.id] || []).length === 0 ? (
                                <p className="text-sm text-slate-500">Aucun commentaire pour le moment.</p>
                              ) : (commentsByPost[post.id] || []).map(comment => (
                                <div key={comment.id} className="rounded-2xl bg-slate-50 p-4">
                                  <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                                    <span className="font-medium text-slate-800">{comment.auteur}</span>
                                    <span>•</span>
                                    <span>{comment.date}</span>
                                  </div>
                                  <p className="text-slate-700">{comment.contenu}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="mt-4 flex gap-3">
                            <input
                              type="text"
                              value={commentDrafts[post.id] || ''}
                              onChange={(e) => setCommentDrafts(prev => ({ ...prev, [post.id]: e.target.value }))}
                              placeholder="Écrire un commentaire..."
                              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-300"
                            />
                            <button
                              type="button"
                              onClick={() => handleComment(post.id)}
                              disabled={!commentDrafts[post.id]?.trim()}
                              className="premium-btn-primary !px-4 !py-2.5 !text-sm disabled:opacity-50"
                            >
                              Envoyer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="premium-card p-6">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                  <Users className="h-5 w-5 text-violet-500" /><span>Statistiques</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-violet-50 p-4 text-center">
                    <div className="text-2xl font-bold text-violet-600">{stats.membersCount.toLocaleString('fr-FR')}</div>
                    <div className="text-sm text-slate-500">Membres</div>
                  </div>
                  <div className="rounded-xl bg-yellow-50 p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.postsCount.toLocaleString('fr-FR')}</div>
                    <div className="text-sm text-slate-500">Posts</div>
                  </div>
                </div>
              </div>

              <div className="premium-card p-6">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                  <Trophy className="h-5 w-5 text-yellow-500" /><span>Top Contributeurs</span>
                </h3>
                <div className="space-y-4">
                  {topMembers.length === 0 ? (
                    <p className="text-sm text-slate-500">Aucun contributeur pour le moment.</p>
                  ) : topMembers.map((member, index) => (
                    <div key={`${member.nom}-${index}`} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{member.badge}</span>
                        <CommunityAvatar avatar={member.avatar} className="h-10 w-10 text-lg" />
                        <span className="font-medium text-slate-900">{member.nom}</span>
                      </div>
                      <span className="text-sm text-slate-500">{member.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="premium-card p-6">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                  <Star className="h-5 w-5 text-violet-500" /><span>Événements à venir</span>
                </h3>
                <div className="space-y-4">
                  {events.map((event, index) => (
                    <div key={index} className="rounded-xl bg-slate-50 p-4">
                      <h4 className="mb-1 font-medium text-slate-900">{event.titre}</h4>
                      <p className="mb-2 text-sm text-slate-500">{event.date}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">{event.participants} participants</span>
                        <button type="button" className="text-sm font-medium text-violet-600 hover:text-violet-700">Participer</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatbotVendeur />
    </div>
  )
}
