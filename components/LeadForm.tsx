'use client'

import { useState } from 'react'

export default function LeadForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar.')
      }

      setSuccess(true)
      // Opcional: Limpar o formulário
      e.currentTarget.reset()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl text-center shadow-lg">
        <h3 className="text-xl font-bold mb-2">Inscrição Recebida!</h3>
        <p>Entraremos em contato em breve para finalizar sua matrícula.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-4 text-sm text-green-700 underline hover:text-green-900"
        >
          Cadastrar outro e-mail
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white text-slate-800 p-8 rounded-xl shadow-2xl relative">
      <h3 className="text-2xl font-bold mb-2">Inscreva-se na Lista de Espera</h3>
      <p className="text-slate-500 mb-6 text-sm">
        Garanta o desconto do Lote 1 (50% OFF)
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="sr-only">Nome Completo</label>
          <input 
            id="name"
            name="name" 
            type="text" 
            placeholder="Seu Nome Completo" 
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            required 
            disabled={loading}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="sr-only">E-mail</label>
          <input 
            id="email"
            name="email" 
            type="email" 
            placeholder="Seu Melhor E-mail" 
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            required 
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="phone" className="sr-only">Telefone</label>
          <input 
            id="phone"
            name="phone" 
            type="tel" 
            placeholder="Seu Telefone/WhatsApp" 
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            required 
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full font-bold py-3 rounded-lg transition flex justify-center items-center ${
            loading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-700 hover:bg-blue-800 text-white'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              ENVIANDO...
            </>
          ) : (
            'QUERO ME INSCREVER'
          )}
        </button>
      </form>
    </div>
  )
}