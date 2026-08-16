import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'Help Life Building | Ebooks, services et accompagnement',
  description: 'Plateforme premium pour acheter des ebooks, réserver des rendez-vous, découvrir nos services et rejoindre notre communauté.',
  keywords: 'ebook, services, portfolio, rendez-vous, communauté, coaching, formation',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="antialiased text-slate-900">
        {children}
      </body>
    </html>
  )
}
