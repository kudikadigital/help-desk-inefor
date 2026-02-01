import { prisma } from '@/lib/prisma'
import AdminLeadRow from '@/components/AdminLeadRow'
import { Users, DollarSign, Clock, CheckCircle2, Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } })

  const stats = {
    total: leads.length,
    waiting: leads.filter(l => l.status === 'AGUARDANDO_VALIDACAO').length,
    confirmed: leads.filter(l => l.status === 'MATRICULADO').length,
    revenue: leads.filter(l => l.status === 'MATRICULADO').length * 87500
  }

  return (
    <div className="space-y-8">
      
      {/* Header da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
           <p className="text-slate-400 text-sm mt-1">Visão geral da turma de Fevereiro/2026</p>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Receita (Gradiente) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 p-6 shadow-2xl shadow-blue-900/20 group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition"></div>
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold bg-white/20 text-white px-2 py-1 rounded-full">+12%</span>
            </div>
            <p className="text-blue-200 text-sm font-medium">Receita Confirmada</p>
            <h3 className="text-3xl font-bold text-white mt-1">
                {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(stats.revenue)}
            </h3>
        </div>

        {/* Card 2: Pendentes */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 hover:border-slate-700 transition group relative overflow-hidden">
             {stats.waiting > 0 && <div className="absolute top-0 right-0 w-1.5 h-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]"></div>}
             <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-slate-800 rounded-xl text-orange-500 group-hover:text-orange-400 transition">
                    <Clock className="w-6 h-6" />
                </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Aguardando Validação</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stats.waiting}</h3>
        </div>

        {/* Card 3: Confirmados */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 hover:border-slate-700 transition group">
             <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-slate-800 rounded-xl text-green-500 group-hover:text-green-400 transition">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Matrículas Ativas</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stats.confirmed}</h3>
        </div>

        {/* Card 4: Total */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 hover:border-slate-700 transition">
             <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-slate-800 rounded-xl text-blue-500">
                    <Users className="w-6 h-6" />
                </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Total de Leads</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stats.total}</h3>
        </div>
      </div>

      {/* Tabela de Leads "Glassy" */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-5 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Candidaturas Recentes
            </h3>
            
            {/* Filtros Visuais */}
            <div className="flex gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800">
                <button className="px-3 py-1.5 text-xs font-medium bg-slate-800 text-white rounded-md shadow-sm">Todos</button>
                <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-white transition">Pendentes</button>
                <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-white transition">Confirmados</button>
            </div>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-950/50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                        <th className="px-6 py-4">Candidato</th>
                        <th className="px-6 py-4">Contacto</th>
                        <th className="px-6 py-4">Comprovativo</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {leads.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                Nenhuma inscrição encontrada.
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
  )
}