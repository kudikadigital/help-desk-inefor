'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Loader2, Mail, MessageCircle, Phone, CreditCard, Banknote } from 'lucide-react'

type Lead = {
  id: string
  name: string
  email: string
  phone: string
  status: string
  paymentProofUrl: string | null
  createdAt: Date
}

const statusStyles: Record<string, string> = {
  NOVO: 'bg-slate-800 text-slate-400 border-slate-700',
  AGUARDANDO_VALIDACAO: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  MATRICULADO: 'bg-green-500/10 text-green-400 border-green-500/20',
  CANCELADO: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const statusLabel: Record<string, string> = {
  NOVO: 'Novo',
  AGUARDANDO_VALIDACAO: 'Aguardando',
  MATRICULADO: 'Matriculado',
  CANCELADO: 'Cancelado',
}

export default function AdminLeadRow({ lead }: { lead: Lead }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Falha')
      router.refresh()
    } catch {
      alert('Erro ao atualizar.')
    } finally {
      setLoading(false)
    }
  }

  const getWhatsAppLink = (phone: string) => {
    let n = phone.replace(/\D/g, '')
    if (n.length === 9) n = '244' + n
    return `https://wa.me/${n}`
  }

  return (
    <tr className="hover:bg-slate-800/50 transition group border-b border-slate-800 last:border-0">

      <td className="px-6 py-4">
        <span className="font-mono text-xs bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-400">
          #{lead.id.slice(0, 6)}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="font-bold text-white mb-0.5">{lead.name}</div>
        <div className="text-xs text-slate-500 font-mono">
          {new Date(lead.createdAt).toLocaleDateString('pt-AO')} •{' '}
          {new Date(lead.createdAt).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Mail className="w-3 h-3 text-slate-600" /> {lead.email}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Phone className="w-3 h-3 text-slate-600" /> {lead.phone}
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        {lead.status === 'NOVO' ? (
          <span className="text-slate-600 text-xs italic">Sem pagamento</span>
        ) : lead.paymentProofUrl ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-700/50 text-slate-300 border border-slate-700">
            <Banknote className="w-3 h-3" /> Comprovativo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CreditCard className="w-3 h-3" /> Online
          </span>
        )}
      </td>

      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          statusStyles[lead.status] || 'bg-slate-800 text-slate-500 border-slate-700'
        }`}>
          {statusLabel[lead.status] || lead.status}
        </span>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
          ) : (
            <>
              <div className="flex items-center mr-2 pr-2 border-r border-slate-700 gap-1">
                <a href={getWhatsAppLink(lead.phone)} target="_blank" rel="noopener noreferrer"
                  title="WhatsApp"
                  className="p-2 hover:bg-green-500/20 text-slate-500 hover:text-green-400 rounded-lg transition">
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a href={`mailto:${lead.email}`} title="E-mail"
                  className="p-2 hover:bg-blue-500/20 text-slate-500 hover:text-blue-400 rounded-lg transition">
                  <Mail className="w-4 h-4" />
                </a>
              </div>

              {lead.status !== 'MATRICULADO' && (
                <button onClick={() => handleStatusChange('MATRICULADO')} title="Confirmar Matrícula"
                  className="p-2 bg-green-900/20 hover:bg-green-500/20 text-green-600 hover:text-green-400 rounded-lg transition border border-transparent hover:border-green-500/30">
                  <Check className="w-4 h-4" />
                </button>
              )}

              {lead.status !== 'CANCELADO' && (
                <button onClick={() => handleStatusChange('CANCELADO')} title="Cancelar"
                  className="p-2 bg-red-900/20 hover:bg-red-500/20 text-red-600 hover:text-red-400 rounded-lg transition border border-transparent hover:border-red-500/30">
                  <X className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
