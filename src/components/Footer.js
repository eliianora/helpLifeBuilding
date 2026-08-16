'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import {
  Mail, Phone, MapPin, Facebook, Twitter, Instagram,
  Linkedin, Youtube, Send, Heart, ArrowRight
} from 'lucide-react'

const footerLinks = {
  services: [
    { name: 'Ebooks', href: '/ebooks' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Rendez-vous', href: '/rdv' },
  ],
  entreprise: [
    { name: 'La fondatrice', href: '/a-propos' },
    { name: 'Communauté', href: '/communaute' },
    { name: 'Mon compte', href: '/mon-compte' },
    { name: 'Ebooks', href: '/ebooks' },
  ],
  legal: [
    { name: 'Mentions légales', href: '/rdv' },
    { name: 'Contact', href: '/rdv' },
  ],
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:bg-blue-600' },
  { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:bg-violet-500' },
  { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:bg-pink-600' },
  { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:bg-blue-700' },
  { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:bg-red-600' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('newsletter').insert([{ email: email.trim() }])
      if (error && error.code !== '23505') throw error
      setSubscribed(true)
      setEmail('')
    } catch {
      alert('Inscription impossible pour le moment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white">
      {/* Décoration de fond */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-display font-bold mb-3">
              Restez informé de nos <span className="text-yellow-400">nouveautés</span>
            </h3>
            <p className="text-slate-400 mb-6">
              Recevez nos dernières actualités, offres exclusives et conseils directement dans votre boîte mail.
            </p>

            {subscribed ? (
              <div className="flex items-center justify-center space-x-2 text-emerald-400">
                <Heart className="w-5 h-5" />
                <span>Merci pour votre inscription !</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
                <div className="relative flex-1 max-w-md">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-yellow-500 text-white font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Envoi...</span>
                  ) : (
                    <>
                      <span>S'inscrire</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              {/* <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-yellow-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div> */}
              <span className="font-display text-2xl font-bold">Help Life Building</span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-sm">
              Votre plateforme tout-en-un pour les ebooks, services professionnels, et bien plus encore. Rejoignez notre communauté grandissante.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-slate-400">
              <a href="mailto:coachprisca.com" className="flex items-center space-x-3 hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-violet-400" />
                <span>coachprisca@gmail.com</span>
              </a>
              <a href="tel:+225 0715939321" className="flex items-center space-x-3 hover:text-white transition-colors">
                <Phone className="w-5 h-5 text-violet-400" />
                <span>+225 0715939321</span>
              </a>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-violet-400" />
                <span>Abidjan, Côte d'Ivoire</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.entreprise.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Légal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Help Life Building. Tous droits réservés.
          </p>

          {/* Social Links */}
          <div className="flex items-center space-x-2">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 ${social.color} hover:text-white`}
                title={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
