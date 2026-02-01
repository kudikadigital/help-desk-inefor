'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Check, X, Loader2, Mail, Phone } from 'lucide-react'

// (Tipo Lead mantido igual...)
type Lead = {
  id: string
  name: string
  email: string
  phone: string
  status: string
  paymentProofUrl: string | null
  createdAt: Date
}

export default function AdminLeadRow({ lead }: { lead: Lead }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (!response.ok) throw new Error('Falha')
      router.refresh()
    } catch (error) {
      console.error('Erro ao atualizar.', error)
    } finally {
      setLoading(false)
    }
  }

  // Cores "Neon" para o Dark Mode
  const statusStyles: Record<string, string> = {
    'NOVO': 'bg-slate-800 text-slate-400 border-slate-700',
    'AGUARDANDO_VALIDACAO': 'bg-orange-500/10 text-orange-400 border-orange-500/20', // Estilo brilhante
    'MATRICULADO': 'bg-green-500/10 text-green-400 border-green-500/20',
    'CANCELADO': 'bg-red-500/10 text-red-400 border-red-500/20'
  }

  return (
    <tr className="hover:bg-slate-800/50 transition group">
      {/* Nome e Data */}
      <td className="px-6 py-4">
        <div className="font-bold text-white mb-0.5">{lead.name}</div>
        <div className="text-xs text-slate-500 font-mono">
            {new Date(lead.createdAt).toLocaleDateString('pt-AO')} • {new Date(lead.createdAt).toLocaleTimeString('pt-AO', {hour: '2-digit', minute:'2-digit'})}
        </div>
      </td>

      {/* Contato com Ícones sutis */}
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

      {/* Arquivo */}
      <td className="px-6 py-4">
        {lead.paymentProofUrl ? (
          <a 
            href={lead.paymentProofUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 text-xs font-medium transition border border-blue-500/20"
          >
            <FileText className="w-3.5 h-3.5" /> Comprovativo
          </a>
        ) : (
          <span className="text-slate-600 text-xs italic">Pendente</span>
        )}
      </td>

      {/* Status Badge */}
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyles[lead.status] || 'bg-slate-800 text-slate-500 border-slate-700'}`}>
          {lead.status.replace('_', ' ')}
        </span>
      </td>

      {/* Ações */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition">
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
            ) : (
                <>
                   {/* Botão Aprovar */}
                   {lead.status !== 'MATRICULADO' && (
                        <button 
                            onClick={() => handleStatusChange('MATRICULADO')}
                            title="Confirmar"
                            className="p-2 bg-green-900/20 hover:bg-green-500/20 text-green-600 hover:text-green-400 rounded-lg transition border border-transparent hover:border-green-500/30"
                        >
                            <Check className="w-4 h-4" />
                        </button>
                   )}
                   
                   {/* Botão Cancelar */}
                   {lead.status !== 'CANCELADO' && (
                        <button 
                             onClick={() => handleStatusChange('CANCELADO')}
                             title="Rejeitar"
                             className="p-2 bg-red-900/20 hover:bg-red-500/20 text-red-600 hover:text-red-400 rounded-lg transition border border-transparent hover:border-red-500/30"
                        >
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