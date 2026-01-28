'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // Importante para atualizar a tela
import { FileText, Check, X, Loader2, ExternalLink } from 'lucide-react'

// Tipo para evitar erros de TS
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
  const router = useRouter() // Hook para recarregar a página

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    
    try {
      // Chamada para a nova API Route
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        throw new Error('Falha ao atualizar')
      }

      // Sucesso: Recarrega os dados da tabela (Server Component)
      router.refresh()
      
    } catch (error) {
      alert('Erro ao atualizar status. Tente novamente.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Cores dos status (UI Visual)
  const statusColors: Record<string, string> = {
    'NOVO': 'bg-slate-100 text-slate-600',
    'AGUARDANDO_VALIDACAO': 'bg-orange-100 text-orange-700',
    'MATRICULADO': 'bg-green-100 text-green-700',
    'CANCELADO': 'bg-red-100 text-red-700'
  }

  return (
    <tr className="hover:bg-slate-50 transition border-b border-slate-100 last:border-0">
      <td className="px-6 py-4">
        <div className="font-medium text-slate-900">{lead.name}</div>
        <div className="text-xs text-slate-500">{new Date(lead.createdAt).toLocaleDateString('pt-AO')}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-slate-600">{lead.email}</div>
        <div className="text-sm text-slate-500">{lead.phone}</div>
      </td>
      <td className="px-6 py-4">
        {lead.paymentProofUrl ? (
          <a 
            href={lead.paymentProofUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
          >
            <FileText className="w-4 h-4" /> Ver Arquivo <ExternalLink className="w-3 h-3"/>
          </a>
        ) : (
          <span className="text-slate-400 text-sm italic">Pendente</span>
        )}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[lead.status] ? statusColors[lead.status] + ' border-transparent' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
          {lead.status.replace('_', ' ')}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
            {loading ? (
                <div className="p-2">
                   <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                </div>
            ) : (
                <>
                   {/* Botão Aprovar */}
                   {lead.status !== 'MATRICULADO' && (
                        <button 
                            onClick={() => handleStatusChange('MATRICULADO')}
                            title="Confirmar Matrícula"
                            className="p-2 bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 rounded-lg transition hover:shadow-sm"
                        >
                            <Check className="w-4 h-4" />
                        </button>
                   )}
                   
                   {/* Botão Cancelar */}
                   {lead.status !== 'CANCELADO' && (
                        <button 
                             onClick={() => handleStatusChange('CANCELADO')}
                             title="Cancelar/Rejeitar"
                             className="p-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition hover:shadow-sm"
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