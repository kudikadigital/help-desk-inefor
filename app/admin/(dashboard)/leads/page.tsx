import { prisma } from '@/lib/prisma'
import AdminLeadRow from '@/components/AdminLeadRow'
import { Users, UserCheck, Clock, UserX } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminLeadsPage({ searchParams }: Props) {
  const { status } = await searchParams

  const where = status && status !== 'todos'
    ? { status: status.toUpperCase() }
    : {}

  const [leads, counts] = await Promise.all([
    prisma.lead.findMany({ where, orderBy: { createdAt: 'desc' } }),
    prisma.lead.groupBy({ by: ['status'], _count: true }),
  ])

  const countMap: Record<string, number> = {}
  counts.forEach(c => { countMap[c.status] = c._count })

  const tabs = [
    { key: 'todos', label: 'Todos', count: Object.values(countMap).reduce((a, b) => a + b, 0), icon: Users },
    { key: 'novo', label: 'Novos', count: countMap['NOVO'] || 0, icon: Users },
    { key: 'aguardando_validacao', label: 'Aguardando', count: countMap['AGUARDANDO_VALIDACAO'] || 0, icon: Clock },
    { key: 'matriculado', label: 'Matriculados', count: countMap['MATRICULADO'] || 0, icon: UserCheck },
    { key: 'cancelado', label: 'Cancelados', count: countMap['CANCELADO'] || 0, icon: UserX },
  ]

  const activeTab = status || 'todos'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Gestão de Leads</h1>
        <p className="text-slate-400 text-sm mt-1">Todos os contactos e candidaturas</p>
      </div>

      {/* Tabs filtro */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <a key={tab.key} href={`/admin/leads?status=${tab.key}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition border ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-900/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white'
            }`}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {tab.count}
            </span>
          </a>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
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
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="w-10 h-10 opacity-20" />
                      <span>Nenhum lead encontrado nesta categoria.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map(lead => <AdminLeadRow key={lead.id} lead={lead} />)
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/30 text-xs text-slate-500">
          {leads.length} lead{leads.length !== 1 ? 's' : ''} encontrado{leads.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}
