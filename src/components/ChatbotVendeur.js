'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, ShoppingCart, Book, Calendar, HelpCircle, Loader2, Check, Plus, Minus } from 'lucide-react'
import { supabase as defaultSupabase } from '@/lib/supabase'
import { formatFcfa } from '@/lib/money'

export default function ChatbotVendeur({ supabase: supabaseProp }) {
  const supabase = supabaseProp || defaultSupabase
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      text: "Bonjour ! 👋 Je suis votre assistant personnel. Je peux vous aider à :\n\n• 📚 Découvrir nos ebooks\n• 🛒 Faire des achats\n• 📅 Prendre rendez-vous\n• ❓ Répondre à vos questions\n\nQue puis-je faire pour vous ?", 
      time: new Date() 
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({ nom: '', email: '', telephone: '' })
  const [conversationState, setConversationState] = useState('initial') // initial, browsing, checkout, collecting_info
  const messagesEndRef = useRef(null)

  // Charger les produits depuis Supabase au démarrage
  useEffect(() => {
    loadProducts()
    loadServices()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // ============================================
  // FONCTIONS DE CHARGEMENT DES DONNÉES
  // ============================================

  const loadProducts = async () => {
    // Si Supabase n'est pas configuré, utiliser des données de démo
    const demoProducts = [
      { id: 1, titre: 'Maîtrisez le Marketing Digital', description: 'Guide complet pour dominer les réseaux sociaux et le SEO.', prix: 19.99, categorie: 'Marketing', notation: 4.8 },
      { id: 2, titre: 'Leadership Moderne', description: 'Techniques de management pour le monde d\'aujourd\'hui.', prix: 24.99, categorie: 'Business', notation: 4.9 },
      { id: 3, titre: 'Productivité Maximale', description: 'Doublez votre efficacité en 30 jours.', prix: 14.99, categorie: 'Développement', notation: 4.7 },
      { id: 4, titre: 'Finance Personnelle', description: 'Prenez le contrôle de vos finances.', prix: 17.99, categorie: 'Finance', notation: 4.6 },
      { id: 5, titre: 'Communication Efficace', description: 'Maîtrisez l\'art de la communication.', prix: 12.99, categorie: 'Communication', notation: 4.5 },
      { id: 6, titre: 'Intelligence Émotionnelle', description: 'Développez votre QE.', prix: 21.99, categorie: 'Développement', notation: 4.8 },
    ]
    
    if (supabase) {
      try {
        const { data, error } = await supabase.from('ebooks').select('*').eq('statut', 'publie')
        if (data && data.length > 0) {
          setProducts(data)
          return
        }
      } catch (e) {
        console.log('Utilisation des données de démo')
      }
    }
    setProducts(demoProducts)
  }

  const loadServices = async () => {
    const demoServices = [
      { id: 1, titre: 'Coaching Personnel', description: 'Accompagnement sur-mesure', prix: 80, unite: 'heure' },
      { id: 2, titre: 'Formation Entreprise', description: 'Formation pour vos équipes', prix: null, unite: 'Sur devis' },
      { id: 3, titre: 'Consultation Stratégique', description: 'Analyse et recommandations', prix: 150, unite: 'heure' },
    ]
    
    if (supabase) {
      try {
        const { data, error } = await supabase.from('services').select('*').eq('actif', true)
        if (data && data.length > 0) {
          setServices(data)
          return
        }
      } catch (e) {
        console.log('Utilisation des services de démo')
      }
    }
    setServices(demoServices)
  }

  // ============================================
  // LOGIQUE DU CHATBOT INTELLIGENT
  // ============================================

  const analyzeMessage = (message) => {
    const lower = message.toLowerCase()
    
    // Détection des intentions
    const intentions = {
      salutation: /^(bonjour|salut|hello|hi|hey|coucou|bonsoir)/i.test(lower),
      voir_produits: /(voir|montre|affiche|liste|quels?).*(ebook|livre|produit|catalogue)/i.test(lower) || 
                     /(ebook|livre|produit|catalogue)/i.test(lower) && lower.length < 30,
      recherche_categorie: /(marketing|business|développement|finance|communication|leadership|productivité)/i.test(lower),
      demande_prix: /(prix|coût|combien|tarif)/i.test(lower),
      ajouter_panier: /(ajouter|acheter|prendre|commander|je veux|je voudrais)/i.test(lower),
      voir_panier: /(panier|commande|récap|total)/i.test(lower),
      finaliser: /(finaliser|payer|valider|confirmer|checkout)/i.test(lower),
      rdv: /(rdv|rendez-vous|consultation|réserver|prendre rdv)/i.test(lower),
      services: /(service|coaching|formation|accompagnement)/i.test(lower),
      aide: /(aide|help|comment|quoi faire)/i.test(lower),
      merci: /(merci|super|parfait|excellent|génial)/i.test(lower),
      annuler: /(annuler|supprimer|retirer|enlever)/i.test(lower),
      recommandation: /(recommand|conseil|suggér|meilleur|populaire|top)/i.test(lower),
    }

    // Extraction des catégories mentionnées
    const categories = []
    if (/marketing/i.test(lower)) categories.push('Marketing')
    if (/business|entreprise/i.test(lower)) categories.push('Business')
    if (/développement|personnel|productivité/i.test(lower)) categories.push('Développement')
    if (/finance|argent/i.test(lower)) categories.push('Finance')
    if (/communication/i.test(lower)) categories.push('Communication')

    // Extraction des numéros de produits mentionnés
    const numbers = lower.match(/\d+/g)?.map(n => parseInt(n)) || []

    return { intentions, categories, numbers, original: message }
  }

  const generateResponse = async (analysis) => {
    const { intentions, categories, numbers, original } = analysis
    
    // Salutation
    if (intentions.salutation) {
      return {
        text: "Bonjour ! 😊 Ravi de vous revoir ! Comment puis-je vous aider aujourd'hui ?\n\nVoulez-vous :\n• Voir nos ebooks 📚\n• Découvrir nos services 💼\n• Prendre un rendez-vous 📅",
        action: null
      }
    }

    // Voir le panier
    if (intentions.voir_panier) {
      if (cart.length === 0) {
        return {
          text: "Votre panier est vide pour l'instant. 🛒\n\nVoulez-vous voir nos ebooks ? Tapez 'voir ebooks' ou demandez-moi une recommandation !",
          action: null
        }
      }
      const total = cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0)
      let cartText = "🛒 **Votre panier :**\n\n"
      cart.forEach((item, i) => {
        cartText += `${i + 1}. ${item.titre} x${item.quantite} - ${formatFcfa(item.prix * item.quantite)}\n`
      })
      cartText += `\n💰 **Total : ${formatFcfa(total)}**\n\nTapez "finaliser" pour passer commande ou continuez vos achats !`
      return { text: cartText, action: 'show_cart' }
    }

    // Finaliser la commande
    if (intentions.finaliser) {
      if (cart.length === 0) {
        return {
          text: "Votre panier est vide ! Ajoutez d'abord des produits. Tapez 'voir ebooks' pour découvrir notre catalogue.",
          action: null
        }
      }
      setConversationState('collecting_info')
      return {
        text: "Parfait ! Pour finaliser votre commande, j'ai besoin de quelques informations. 📝\n\nQuel est votre **nom complet** ?",
        action: 'collect_name'
      }
    }

    // Collecte d'informations client
    if (conversationState === 'collecting_info') {
      if (!customerInfo.nom) {
        setCustomerInfo({ ...customerInfo, nom: original })
        return {
          text: `Merci ${original} ! 👋\n\nQuel est votre **email** pour recevoir votre commande ?`,
          action: 'collect_email'
        }
      }
      if (!customerInfo.email && original.includes('@')) {
        setCustomerInfo({ ...customerInfo, email: original })
        return {
          text: `Parfait ! Dernier détail : votre **numéro de téléphone** (optionnel, tapez "passer" pour ignorer)`,
          action: 'collect_phone'
        }
      }
      if (!customerInfo.telephone) {
        const phone = original.toLowerCase() === 'passer' ? 'Non renseigné' : original
        setCustomerInfo({ ...customerInfo, telephone: phone })
        
        // Récapitulatif final
        const total = cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0)
        let recap = `✅ **Récapitulatif de votre commande :**\n\n`
        recap += `👤 ${customerInfo.nom}\n📧 ${customerInfo.email}\n📱 ${phone}\n\n`
        recap += `📦 **Articles :**\n`
        cart.forEach(item => {
          recap += `• ${item.titre} x${item.quantite} - ${formatFcfa(item.prix * item.quantite)}\n`
        })
        recap += `\n💰 **Total : ${formatFcfa(total)}**\n\n`
        recap += `Tapez "confirmer" pour valider ou "annuler" pour modifier.`
        
        setConversationState('confirmation')
        return { text: recap, action: 'confirm_order' }
      }
    }

    // Confirmation finale
    if (conversationState === 'confirmation' && /confirmer|oui|ok|valider/i.test(original)) {
      // Sauvegarder la commande (ici on simule, avec Supabase ça irait en DB)
      const orderData = {
        client: customerInfo,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0),
        date: new Date().toISOString()
      }
      
      // Reset
      setCart([])
      setCustomerInfo({ nom: '', email: '', telephone: '' })
      setConversationState('initial')
      
      return {
        text: `🎉 **Commande confirmée !**\n\nMerci ${orderData.client.nom} pour votre achat !\n\nVous recevrez un email à ${orderData.client.email} avec vos ebooks.\n\nÀ très bientôt ! 😊`,
        action: 'order_complete'
      }
    }

    // Annuler
    if (intentions.annuler) {
      if (conversationState !== 'initial') {
        setConversationState('initial')
        setCustomerInfo({ nom: '', email: '', telephone: '' })
        return {
          text: "Pas de problème, j'ai annulé le processus. 👍\n\nComment puis-je vous aider autrement ?",
          action: null
        }
      }
      if (cart.length > 0) {
        setCart([])
        return {
          text: "J'ai vidé votre panier. 🗑️\n\nVoulez-vous recommencer vos achats ?",
          action: null
        }
      }
    }

    // Demande de recommandation
    if (intentions.recommandation) {
      const topProducts = products.filter(p => p.notation >= 4.7).slice(0, 3)
      let text = "🌟 **Voici nos ebooks les plus populaires :**\n\n"
      topProducts.forEach((p, i) => {
        text += `**${i + 1}. ${p.titre}** - ${formatFcfa(p.prix)}\n⭐ ${p.notation}/5\n${p.description}\n\n`
      })
      text += `Pour ajouter au panier, dites par exemple : "ajouter le 1" ou "je veux le Leadership"`
      return { text, action: 'show_recommendations' }
    }

    // Voir les produits / ebooks
    if (intentions.voir_produits) {
      let filteredProducts = products
      
      if (categories.length > 0) {
        filteredProducts = products.filter(p => categories.includes(p.categorie))
      }
      
      if (filteredProducts.length === 0) {
        return {
          text: `Je n'ai pas trouvé d'ebooks dans cette catégorie. Voici nos catégories disponibles : Marketing, Business, Développement, Finance, Communication.`,
          action: null
        }
      }

      let text = "📚 **Voici nos ebooks disponibles :**\n\n"
      filteredProducts.forEach((p, i) => {
        text += `**${i + 1}. ${p.titre}** - ${formatFcfa(p.prix)}\n   📁 ${p.categorie} | ⭐ ${p.notation}/5\n   ${p.description}\n\n`
      })
      text += `\n💡 Pour ajouter au panier, dites : "ajouter le 1" ou "je veux [nom du livre]"`
      
      return { text, action: 'show_products', products: filteredProducts }
    }

    // Recherche par catégorie
    if (intentions.recherche_categorie && categories.length > 0) {
      const filteredProducts = products.filter(p => categories.includes(p.categorie))
      
      if (filteredProducts.length === 0) {
        return {
          text: `Désolé, je n'ai pas d'ebooks dans la catégorie "${categories[0]}" pour le moment. Voulez-vous voir d'autres catégories ?`,
          action: null
        }
      }

      let text = `📚 **Ebooks en ${categories[0]} :**\n\n`
      filteredProducts.forEach((p, i) => {
        text += `**${i + 1}. ${p.titre}** - ${formatFcfa(p.prix)}\n   ⭐ ${p.notation}/5 | ${p.description}\n\n`
      })
      text += `Pour ajouter au panier, dites "ajouter le [numéro]"`
      
      return { text, action: 'show_products', products: filteredProducts }
    }

    // Ajouter au panier
    if (intentions.ajouter_panier) {
      // Chercher par numéro
      if (numbers.length > 0) {
        const index = numbers[0] - 1
        if (index >= 0 && index < products.length) {
          const product = products[index]
          addToCart(product)
          return {
            text: `✅ **"${product.titre}"** ajouté au panier !\n\n🛒 Votre panier contient maintenant ${cart.length + 1} article(s).\n\nVoulez-vous :\n• Continuer vos achats (tapez "voir ebooks")\n• Voir votre panier (tapez "panier")\n• Finaliser (tapez "finaliser")`,
            action: 'added_to_cart'
          }
        }
      }
      
      // Chercher par nom
      const productMatch = products.find(p => 
        original.toLowerCase().includes(p.titre.toLowerCase().split(' ').slice(0, 2).join(' ').toLowerCase())
      )
      
      if (productMatch) {
        addToCart(productMatch)
        return {
          text: `✅ **"${productMatch.titre}"** ajouté au panier !\n\n🛒 Votre panier : ${cart.length + 1} article(s)\n\nTapez "panier" pour voir le récapitulatif ou "finaliser" pour commander.`,
          action: 'added_to_cart'
        }
      }
      
      return {
        text: "Je n'ai pas trouvé ce produit. 🤔\n\nTapez 'voir ebooks' pour voir la liste complète, puis dites-moi le numéro ou le nom de l'ebook que vous voulez.",
        action: null
      }
    }

    // Services
    if (intentions.services) {
      let text = "💼 **Nos services :**\n\n"
      services.forEach((s, i) => {
        const prixText = s.prix ? `${formatFcfa(s.prix)}/${s.unite}` : s.unite
        text += `**${i + 1}. ${s.titre}** - ${prixText}\n   ${s.description}\n\n`
      })
      text += `Pour réserver, tapez "prendre rdv" ou visitez notre page Rendez-vous.`
      return { text, action: 'show_services' }
    }

    // RDV
    if (intentions.rdv) {
      return {
        text: "📅 Pour prendre rendez-vous, je vous invite à visiter notre page dédiée où vous pourrez :\n\n• Choisir votre service\n• Sélectionner une date\n• Choisir un créneau horaire\n\n👉 [Prendre rendez-vous](/rdv)\n\nOu dites-moi quel service vous intéresse et je vous guiderai !",
        action: 'redirect_rdv'
      }
    }

    // Prix
    if (intentions.demande_prix) {
      let text = "💰 **Nos tarifs :**\n\n**Ebooks :**\n"
      const priceRange = {
        min: Math.min(...products.map(p => p.prix)),
        max: Math.max(...products.map(p => p.prix))
      }
      text += `De ${formatFcfa(priceRange.min)} à ${formatFcfa(priceRange.max)}\n\n**Services :**\n`
      services.forEach(s => {
        const prixText = s.prix ? `${formatFcfa(s.prix)}/${s.unite}` : s.unite
        text += `• ${s.titre} : ${prixText}\n`
      })
      text += `\nVoulez-vous voir le détail des ebooks ou des services ?`
      return { text, action: null }
    }

    // Aide
    if (intentions.aide) {
      return {
        text: "🆘 **Comment puis-je vous aider ?**\n\nVoici ce que je peux faire :\n\n📚 **Achats**\n• \"voir ebooks\" - Voir le catalogue\n• \"ebooks marketing\" - Filtrer par catégorie\n• \"ajouter le 1\" - Ajouter au panier\n• \"panier\" - Voir votre panier\n• \"finaliser\" - Passer commande\n\n💼 **Services**\n• \"services\" - Voir nos offres\n• \"prendre rdv\" - Réserver\n\n💡 **Conseils**\n• \"recommandation\" - Nos bestsellers\n• \"prix\" - Voir les tarifs\n\nQue souhaitez-vous faire ?",
        action: null
      }
    }

    // Merci
    if (intentions.merci) {
      return {
        text: "Avec plaisir ! 😊 C'est un vrai plaisir de vous aider.\n\nN'hésitez pas si vous avez d'autres questions ou si vous voulez passer commande !",
        action: null
      }
    }

    // Réponse par défaut
    return {
      text: "Je ne suis pas sûr de comprendre votre demande. 🤔\n\nEssayez :\n• \"voir ebooks\" pour découvrir nos produits\n• \"aide\" pour voir ce que je peux faire\n• \"recommandation\" pour nos bestsellers\n\nOu posez-moi votre question différemment !",
      action: null
    }
  }

  // ============================================
  // GESTION DU PANIER
  // ============================================

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantite: item.quantite + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantite: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, delta) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQty = item.quantite + delta
        return newQty > 0 ? { ...item, quantite: newQty } : item
      }
      return item
    }).filter(item => item.quantite > 0))
  }

  // ============================================
  // ENVOI DE MESSAGE
  // ============================================

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      time: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Analyser et générer la réponse
    const analysis = analyzeMessage(inputValue)
    
    // Délai pour simuler la réflexion
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))

    const response = await generateResponse(analysis)

    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      text: response.text,
      time: new Date()
    }

    setIsTyping(false)
    setMessages(prev => [...prev, botMessage])
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Actions rapides
  const quickActions = [
    { id: 'ebooks', label: '📚 Voir Ebooks', message: 'voir ebooks' },
    { id: 'panier', label: '🛒 Mon Panier', message: 'panier' },
    { id: 'reco', label: '⭐ Bestsellers', message: 'recommandation' },
    { id: 'aide', label: '❓ Aide', message: 'aide' },
  ]

  const handleQuickAction = (message) => {
    setInputValue(message)
    setTimeout(() => handleSend(), 100)
  }

  // ============================================
  // RENDU
  // ============================================

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-emerald-500 text-white shadow-lg shadow-violet-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <MessageCircle className="w-7 h-7" />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {cart.length}
          </span>
        )}
      </button>

      {/* Fenêtre du chat */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        } w-[380px] max-w-[calc(100vw-3rem)]`}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[550px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-emerald-600 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Assistant Vendeur</h3>
                <p className="text-violet-100 text-xs flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                  En ligne • Prêt à vous aider
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {cart.length > 0 && (
                <button
                  onClick={() => setShowCart(!showCart)}
                  className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5 text-white" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Mini panier déroulant */}
          {showCart && cart.length > 0 && (
            <div className="bg-slate-50 border-b border-slate-200 p-4 max-h-48 overflow-y-auto">
              <h4 className="font-semibold text-slate-700 mb-3 flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Votre Panier
              </h4>
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">{item.titre}</p>
                    <p className="text-xs text-slate-500">{item.prix}€ x {item.quantite}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center hover:bg-slate-300">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantite}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center hover:bg-slate-300">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-700">Total:</span>
                <span className="font-bold text-violet-600">{cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0).toFixed(2)}€</span>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-br-md'
                      : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-violet-200' : 'text-slate-400'
                  }`}>
                    {message.time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                    <span className="text-sm text-slate-500">En train d'écrire...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 bg-white border-t border-slate-100">
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => {
                    setInputValue(action.message)
                    setTimeout(handleSend, 100)
                  }}
                  className="flex items-center space-x-1 px-3 py-2 rounded-full bg-slate-100 hover:bg-violet-100 hover:text-violet-700 text-slate-600 text-sm whitespace-nowrap transition-colors"
                >
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 border border-transparent focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-500 to-emerald-500 text-white flex items-center justify-center hover:shadow-lg hover:shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
