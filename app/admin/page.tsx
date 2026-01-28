import { prisma } from '@/lib/prisma'
import AdminLeadRow from '@/components/AdminLeadRow'
import { Users, DollarSign, Clock, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic' // Garante que a página não faça cache estático

export default async function AdminDashboard() {
  // 1. Buscar Leads ordenados por data
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // 2. Calcular Estatísticas
  const stats = {
    total: leads.length,
    waiting: leads.filter(l => l.status === 'AGUARDANDO_VALIDACAO').length,
    confirmed: leads.filter(l => l.status === 'MATRICULADO').length,
    // Estimativa simples: Matriculados * Preço Lote 1 (87.500)
    revenue: leads.filter(l => l.status === 'MATRICULADO').length * 87500
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard de Inscrições</h1>
                <p className="text-slate-500">Gestão da turma Help Desk - Fevereiro 2026</p>
            </div>
            <div className="text-right hidden sm:block">
                <p className="text-sm text-slate-400">Última atualização</p>
                <p className="font-mono text-slate-700">{new Date().toLocaleTimeString()}</p>
            </div>
        </div>

        {/* Cards de KPI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Leads */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Total de Leads</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                </div>
            </div>

            {/* Aguardando Validação (O mais importante) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 relative overflow-hidden">
                {stats.waiting > 0 && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full m-2 animate-pulse"></div>
                )}
                <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                    <Clock className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Aguardando Pagamento</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.waiting}</p>
                </div>
            </div>

             {/* Matriculados */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                    <Check className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Matriculados</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.confirmed}</p>
                </div>
            </div>

            {/* Receita Estimada */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                    <DollarSign className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Receita Confirmada</p>
                    <p className="text-2xl font-bold text-slate-800">
                        {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(stats.revenue)}
                    </p>
                </div>
            </div>
        </div>

        {/* Tabela de Leads */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-700">Inscrições Recentes</h3>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">
                    {leads.length} registros
                </span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                            <th className="px-6 py-4">Aluno / Data</th>
                            <th className="px-6 py-4">Contacto</th>
                            <th className="px-6 py-4">Comprovativo</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {leads.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 flex flex-col items-center">
                                    <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                                    Nenhuma inscrição recebida ainda.
                                </td>
                            </tr>
                        ) : (
                            leads.map((lead) => (
                                <AdminLeadRow key={lead.id} lead={lead} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  )
}