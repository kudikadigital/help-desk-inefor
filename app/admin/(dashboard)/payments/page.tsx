import { prisma } from '@/lib/prisma'
import { CreditCard, Landmark, CheckCircle2, Clock, XCircle, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ status?: string; method?: string }>
}

const statusStyles: Record<string, string> = {
  paid:    'bg-green-500/10 text-green-400 border-green-500/20',
  pending: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  failed:  'bg-red-500/10 text-red-400 border-red-500/20',
  expired: 'bg-slate-700 text-slate-400 border-slate-600',
}

const statusLabel: Record<string, string> = {
  paid: 'Pago', pending: 'Pendente', failed: 'Falhado', expired: 'Expirado',
}

export default async function AdminPaymentsPage({ searchParams }: Props) {
  const { status, method } = await searchParams

  const where: Record<string, string> = {}
  if (status && status !== 'todos') where.status = status
  if (method && method !== 'todos') where.paymentMethod = method.toUpperCase()

  const [payments, counts] = await Promise.all([
    prisma.payment.findMany({ where, orderBy: { createdAt: 'desc' } }),
    prisma.payment.groupBy({ by: ['status'], _count: true }),
  ])

  const countMap: Record<string, number> = {}
  counts.forEach(c => { countMap[c.status] = c._count })

  const paidPayments = payments.filter(p => p.status === 'paid')
  const revenue = paidPayments.reduce((sum, p) => sum + p.amount, 0)

  const activeStatus = status || 'todos'
  const activeMethod = method || 'todos'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Pagamentos</h1>
        <p className="text-slate-400 text-sm mt-1">Histórico de transacções GPO e Referência Bancária</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Receita Total', value: `${new Intl.NumberFormat('pt-AO').format(revenue)} Kz`, icon: TrendingUp, color: 'text-green-400' },
          { label: 'Pagos', value: countMap['paid'] || 0, icon: CheckCircle2, color: 'text-green-400' },
          { label: 'Pendentes', value: countMap['pending'] || 0, icon: Clock, color: 'text-orange-400' },
          { label: 'Falhados', value: countMap['failed'] || 0, icon: XCircle, color: 'text-red-400' },
        ].map(k => (
          <div key={k.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <k.icon className={`w-4 h-4 ${k.color}`} />
              <span className="text-xs text-slate-500 font-medium">{k.label}</span>
            </div>
            <p className="text-xl font-bold text-white">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          {['todos', 'paid', 'pending', 'failed'].map(s => (
            <a key={s} href={`/admin/payments?status=${s}&method=${activeMethod}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeStatus === s
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}>
              {s === 'todos' ? 'Todos' : statusLabel[s]}
              {s !== 'todos' && countMap[s] !== undefined && (
                <span className="ml-1.5 opacity-70">({countMap[s]})</span>
              )}
            </a>
          ))}
        </div>

        <div className="flex gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          {['todos', 'gpo', 'ref'].map(m => (
            <a key={m} href={`/admin/payments?status=${activeStatus}&method=${m}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeMethod === m
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}>
              {m === 'gpo' && <CreditCard className="w-3 h-3" />}
              {m === 'ref' && <Landmark className="w-3 h-3" />}
              {m === 'todos' ? 'Todos os métodos' : m.toUpperCase()}
            </a>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Lote</th>
                <th className="px-6 py-4">Método</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Referência</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <CreditCard className="w-10 h-10 opacity-20" />
                      <span>Nenhum pagamento encontrado.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-400">
                        #{p.id.slice(0, 6)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white text-sm">{p.fullName}</div>
                      <div className="text-xs text-slate-500">{p.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{p.batchName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                        p.paymentMethod === 'GPO'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {p.paymentMethod === 'GPO'
                          ? <><CreditCard className="w-3 h-3" /> GPO</>
                          : <><Landmark className="w-3 h-3" /> REF</>
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white text-sm">
                      {new Intl.NumberFormat('pt-AO').format(p.amount)} Kz
                    </td>
                    <td className="px-6 py-4">
                      {p.referenceNumber ? (
                        <div className="text-xs">
                          <div className="font-mono text-slate-300">{p.referenceNumber}</div>
                          <div className="text-slate-600">Ent. {p.referenceEntity}</div>
                          {p.expiresAt && (
                            <div className="text-slate-600">
                              Val. {new Date(p.expiresAt).toLocaleDateString('pt-AO')}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      <div>{new Date(p.createdAt).toLocaleDateString('pt-AO')}</div>
                      <div className="text-slate-600">
                        {new Date(p.createdAt).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {p.paidAt && (
                        <div className="text-green-500 mt-0.5">
                          Pago: {new Date(p.paidAt).toLocaleDateString('pt-AO')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        statusStyles[p.status] || statusStyles.expired
                      }`}>
                        {statusLabel[p.status] || p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/30 text-xs text-slate-500 flex justify-between">
          <span>{payments.length} transacção{payments.length !== 1 ? 'ões' : ''}</span>
          <span className="text-green-400 font-semibold">
            Total confirmado: {new Intl.NumberFormat('pt-AO').format(revenue)} Kz
          </span>
        </div>
      </div>
    </div>
  )
}
