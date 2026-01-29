'use client'

import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  return (
    <a 
      href="https://wa.me/244900000000?text=Olá, gostaria de saber mais sobre o curso de Help Desk."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg shadow-green-500/30 transition-all hover:scale-110 animate-bounce-slow flex items-center justify-center"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
      {/* Badge de notificação para chamar atenção */}
      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
    </a>
  )
}