import { prisma } from '@/lib/prisma'
import AdminLeadRow from '@/components/AdminLeadRow'
import { Users, TrendingUp, Clock, CheckCircle2, CreditCard } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [leads, payments] = await Promise.all([
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.payment.findMany({ orderBy: { createdAt: 'desc' } }),
  ])

  const paidPayments = payments.filter(p => p.status === 'paid')
  const revenue = paidPayments.reduce((sum, p) => sum + p.amount, 0)
  const pending = payments.filter(p => p.status === 'pending').length

  const stats = {
    total: leads.length,
    waiting: leads.filter(l => l.status === 'AGUARDANDO_VALIDACAO').length,
    confirmed: leads.filter(l => l.status === 'MATRICULADO').length,
    revenue,
    pending,
  }

  const recentLeads = leads.slice(0, 10)

  return (
    <div className="space-y-8">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Visão geral — Help Desk 2026</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 p-6 shadow-2xl shadow-blue-900/20 group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-blue-200 text-sm font-medium">Receita Confirmada</p>
          <h3 className="text-3xl font-bold text-white mt-1">
            {new Intl.NumberFormat('pt-AO', { maximumFractionDigits: 0 }).format(revenue)} Kz
          </h3>
          <p className="text-blue-300 text-xs mt-1">{paidPayments.length} pagamentos confirmados</p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 hover:border-slate-700 transition group relative overflow-hidden">
          {pending > 0 && <div className="absolute top-0 right-0 w-1.5 h-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]" />}
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-slate-800 rounded-xl text-orange-500">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Pagamentos Pendentes</p>
          <h3 className="text-3xl font-bold text-white mt-1">{pending}</h3>
          <p className="text-slate-600 text-xs mt-1">Referências por pagar</p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 hover:border-slate-700 transition group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-slate-800 rounded-xl text-green-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Matrículas Activas</p>
          <h3 className="text-3xl font-bold text-white mt-1">{stats.confirmed}</h3>
          <p className="text-slate-600 text-xs mt-1">{stats.waiting} aguardam validação</p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 hover:border-slate-700 transition">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-slate-800 rounded-xl text-blue-500">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Total de Leads</p>
          <h3 className="text-3xl font-bold text-white mt-1">{stats.total}</h3>
          <p className="text-slate-600 text-xs mt-1">Todos os contactos</p>
        </div>
      </div>

      {/* Tabela de leads recentes */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Candidaturas Recentes
          </h3>
          <a href="/admin/leads" className="text-xs text-blue-400 hover:text-blue-300 transition">
            Ver todos →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Candidato</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Pagamento</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Nenhuma inscrição encontrada.
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead) => (
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
