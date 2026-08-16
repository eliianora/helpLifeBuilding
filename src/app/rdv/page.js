'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User, Mail, Phone, MessageSquare, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChatbotVendeur from '@/components/ChatbotVendeur'
import { supabase } from '@/lib/supabase'
import { formatFcfa } from '@/lib/money'

const creneaux = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

export default function RdvPage() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [formData, setFormData] = useState({ nom: '', email: '', telephone: '', message: '' })
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true); setError('')
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id,titre,prix,unite,actif')
          .eq('actif', true)
          .order('ordre', { ascending: true })
        if (error) throw error
        const mapped = (data || []).map(s => ({
          id: s.id,
          nom: s.titre,
          duree: 60,
          prix: s.prix || 0,
          unite: s.unite || 'heure',
        }))
        if (!cancelled) setServices(mapped)
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Erreur de chargement')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i))
    return days
  }

  const isDateAvailable = (date) => {
    if (!date) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const day = date.getDay()
    return date >= today && day !== 0 && day !== 6
  }

  const formatDate = (date) => {
    if (!date) return ''
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('rendez_vous').insert([{
        service_id: selectedService?.id || null,
        nom_client: formData.nom,
        email_client: formData.email,
        telephone: formData.telephone || null,
        message: formData.message || null,
        date_rdv: selectedDate ? selectedDate.toISOString().slice(0, 10) : null,
        heure_rdv: selectedTime ? `${selectedTime}:00` : null,
        duree: selectedService?.duree || 60,
        statut: 'en_attente',
      }])
      if (error) throw error
      setStep(4)
    } catch (e) {
      alert(e?.message || 'Impossible de confirmer le rendez-vous')
    }
  }

  return (
    <div className="min-h-screen page-ambient">
      <Header />
      <main className="relative z-10 pt-24 pb-16">
        <div className="hlb-shell max-w-4xl">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-violet-600 mb-4">
              <ArrowLeft className="w-4 h-4" /><span>Retour</span>
            </Link>
            <h1 className="section-title mb-4">Prendre <span className="brand-gradient-text">Rendez-vous</span></h1>
            <p className="section-subtitle">Réservez votre créneau en quelques clics.</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-violet-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && <div className={`w-20 h-1 mx-2 transition-all ${step > s ? 'bg-violet-500' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          <div className="glass-panel-strong rounded-3xl p-8">
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Choisissez votre service</h2>
                <div className="space-y-4">
                  {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
                      {error}
                    </div>
                  )}
                  {loading ? (
                    <div className="text-slate-500">Chargement...</div>
                  ) : null}
                  {services.map(service => (
                    <button key={service.id} onClick={() => { setSelectedService(service); setStep(2) }}
                      className={`w-full p-6 rounded-xl border-2 text-left transition-all hover:border-violet-400 hover:bg-violet-50 ${selectedService?.id === service.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{service.nom}</h3>
                          <p className="text-slate-500">{service.duree} minutes</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-violet-600">{service.prix === 0 ? 'Gratuit' : formatFcfa(service.prix)}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Date & Time Selection */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Choisissez une date et un horaire</h2>
                
                {/* Calendar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 rounded-lg hover:bg-slate-100">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-semibold capitalize">{currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 rounded-lg hover:bg-slate-100">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center mb-2">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                      <div key={day} className="text-sm font-medium text-slate-500 py-2">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {getDaysInMonth(currentMonth).map((date, i) => (
                      <button key={i} disabled={!isDateAvailable(date)} onClick={() => date && setSelectedDate(date)}
                        className={`py-3 rounded-lg text-sm font-medium transition-all ${!date ? 'invisible' : isDateAvailable(date) ? selectedDate?.toDateString() === date.toDateString() ? 'bg-violet-500 text-white' : 'hover:bg-violet-100 text-slate-700' : 'text-slate-300 cursor-not-allowed'}`}>
                        {date?.getDate()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Horaires disponibles pour le {formatDate(selectedDate)}</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {creneaux.map(time => (
                        <button key={time} onClick={() => setSelectedTime(time)}
                          className={`py-3 rounded-xl font-medium transition-all ${selectedTime === time ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-violet-100'}`}>
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:bg-slate-50">Retour</button>
                  <button onClick={() => setStep(3)} disabled={!selectedDate || !selectedTime}
                    className="px-6 py-3 rounded-xl bg-violet-500 text-white font-medium hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed">Continuer</button>
                </div>
              </div>
            )}

            {/* Step 3: Contact Info */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Vos informations</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nom complet</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="text" required value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-300 focus:border-transparent outline-none" placeholder="Jean Dupont" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-300 focus:border-transparent outline-none" placeholder="jean@exemple.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="tel" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-300 focus:border-transparent outline-none" placeholder="+33 6 12 34 56 78" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Message (optionnel)</label>
                    <textarea rows={4} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-300 focus:border-transparent outline-none resize-none" placeholder="Décrivez brièvement votre besoin..." />
                  </div>

                  {/* Récapitulatif */}
                  <div className="bg-violet-50 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Récapitulatif</h3>
                    <div className="space-y-2 text-slate-600">
                      <p><strong>Service:</strong> {selectedService?.nom}</p>
                      <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
                      <p><strong>Heure:</strong> {selectedTime}</p>
                      <p><strong>Prix:</strong> {selectedService?.prix === 0 ? 'Gratuit' : formatFcfa(selectedService?.prix)}</p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button type="button" onClick={() => setStep(2)} className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:bg-slate-50">Retour</button>
                    <button type="submit" className="px-8 py-3 rounded-xl bg-violet-500 text-white font-semibold hover:bg-violet-600">Confirmer le rendez-vous</button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Rendez-vous confirmé !</h2>
                <p className="text-xl text-slate-600 mb-8">Vous recevrez un email de confirmation avec tous les détails.</p>
                <Link href="/" className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl bg-violet-500 text-white font-semibold hover:bg-violet-600">
                  <span>Retour à l'accueil</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <ChatbotVendeur />
    </div>
  )
}
