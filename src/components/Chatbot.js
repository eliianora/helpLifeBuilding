'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, ShoppingCart, Book, Calendar, HelpCircle } from 'lucide-react'

const quickActions = [
  { id: 'ebooks', label: 'Voir les Ebooks', icon: Book, action: '/ebooks' },
  { id: 'rdv', label: 'Prendre RDV', icon: Calendar, action: '/rdv' },
  { id: 'help', label: 'Aide', icon: HelpCircle, action: 'help' },
]

const botResponses = {
  default: "Bonjour ! Je suis votre assistant. Comment puis-je vous aider aujourd'hui ? Vous pouvez me poser des questions sur nos ebooks, services, ou prendre un rendez-vous.",
  ebook: "Nous avons une large collection d'ebooks sur le développement personnel, le business et la technologie. Voulez-vous voir notre catalogue ?",
  rdv: "Je peux vous aider à prendre un rendez-vous. Quel type de consultation recherchez-vous ?",
  service: "Nous offrons des services de coaching, formation et consultation. Quel domaine vous intéresse ?",
  prix: "Nos tarifs varient selon les services. Les ebooks commencent à partir de 9.99€, et les consultations à partir de 50€/heure. Voulez-vous plus de détails ?",
  help: "Je peux vous aider avec : \n• Trouver un ebook\n• Prendre un rendez-vous\n• Comprendre nos services\n• Répondre à vos questions\n\nQue souhaitez-vous faire ?",
  merci: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. 😊",
  bonjour: "Bonjour ! Ravi de vous voir ! Comment puis-je vous aider aujourd'hui ?",
}

function getBotResponse(message) {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('ebook') || lowerMessage.includes('livre')) {
    return botResponses.ebook
  }
  if (lowerMessage.includes('rdv') || lowerMessage.includes('rendez-vous') || lowerMessage.includes('consultation')) {
    return botResponses.rdv
  }
  if (lowerMessage.includes('service') || lowerMessage.includes('coaching') || lowerMessage.includes('formation')) {
    return botResponses.service
  }
  if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('coût') || lowerMessage.includes('combien')) {
    return botResponses.prix
  }
  if (lowerMessage.includes('aide') || lowerMessage.includes('help')) {
    return botResponses.help
  }
  if (lowerMessage.includes('merci') || lowerMessage.includes('super') || lowerMessage.includes('parfait')) {
    return botResponses.merci
  }
  if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
    return botResponses.bonjour
  }
  
  return "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler ou choisir une des options ci-dessous ?"
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: botResponses.default, time: new Date() }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

    // Simuler un délai de réponse
    await new Promise(resolve => setTimeout(resolve, 1000))

    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      text: getBotResponse(inputValue),
      time: new Date()
    }

    setIsTyping(false)
    setMessages(prev => [...prev, botMessage])
  }

  const handleQuickAction = (action) => {
    if (action.action.startsWith('/')) {
      window.location.href = action.action
    } else {
      setInputValue(action.label)
      handleSend()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-yellow-500 text-white shadow-lg shadow-violet-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
      </button>

      {/* Fenêtre du chat */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        } ${isMinimized ? 'w-80' : 'w-96'}`}
      >
        <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
          isMinimized ? 'h-16' : 'h-[500px]'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-violet-700 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Assistant MonPortail</h3>
                <p className="text-violet-200 text-xs">En ligne • Répond instantanément</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="w-5 h-5 text-white" />
                ) : (
                  <Minimize2 className="w-5 h-5 text-white" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
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
                      <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-2 bg-white border-t border-slate-100">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-full bg-slate-100 hover:bg-violet-100 hover:text-violet-700 text-slate-600 text-sm whitespace-nowrap transition-colors"
                    >
                      <action.icon className="w-4 h-4" />
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
                    placeholder="Écrivez votre message..."
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-100 border border-transparent focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100 transition-all"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white flex items-center justify-center hover:shadow-lg hover:shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
