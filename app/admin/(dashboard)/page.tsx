import { prisma } from '@/lib/prisma'
import AdminLeadRow from '@/components/AdminLeadRow'
import { Users, DollarSign, Clock, AlertCircle, TrendingUp, Download } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // Stats Logic
  const stats = {
    total: leads.length,
    waiting: leads.filter(l => l.status === 'AGUARDANDO_VALIDACAO').length,
    confirmed: leads.filter(l => l.status === 'MATRICULADO').length,
    revenue: leads.filter(l => l.status === 'MATRICULADO').length * 87500
  }

  return (
    <div className="space-y-8">
      
      {/* Page Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard de Vendas</h1>
           <p className="text-slate-500 text-sm mt-1">Acompanhe as inscrições da turma de Fevereiro/2026.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
            <Download className="w-4 h-4" />
            Exportar Relatório
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Receita (Destaque) */}
        <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg shadow-blue-500/20">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded text-white">
                    +12%
                </span>
            </div>
            <p className="text-blue-100 text-sm font-medium">Receita Confirmada</p>
            <h3 className="text-2xl font-bold mt-1">
                {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(stats.revenue)}
            </h3>
        </div>

        {/* Card 2: Aguardando (Atenção) */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-orange-300 transition">
             {stats.waiting > 0 && <div className="absolute top-0 right-0 w-1.5 h-full bg-orange-500"></div>}
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-100 transition">
                    <Clock className="w-6 h-6" />
                </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Aguardando Pagamento</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.waiting}</h3>
        </div>

        {/* Card 3: Matriculados */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:border-green-300 transition group">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition">
                    <TrendingUp className="w-6 h-6" />
                </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Matrículas Ativas</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.confirmed}</h3>
        </div>

        {/* Card 4: Total Leads */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                    <Users className="w-6 h-6" />
                </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Total de Leads</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</h3>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-700">Inscrições Recentes</h3>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
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
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                <div className="flex flex-col items-center gap-2">
                                    <AlertCircle className="w-8 h-8 opacity-50" />
                                    <span>Nenhuma inscrição recebida ainda.</span>
                                </div>
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