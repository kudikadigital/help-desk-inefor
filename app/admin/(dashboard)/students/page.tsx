// app/admin/(dashboard)/students/page.tsx
import { prisma } from '@/lib/prisma'
import { Mail, Phone, Calendar, Download, Search, UserCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminStudentsPage() {
  // Busca apenas quem já é aluno oficial (Status = MATRICULADO)
  const students = await prisma.lead.findMany({
    where: { status: 'MATRICULADO' },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Alunos Matriculados</h1>
          <p className="text-slate-400 text-sm mt-1">Gestão da turma atual (Help Desk - Fev/2026)</p>
        </div>
        
        <div className="flex gap-3">
            <div className="relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Buscar aluno..." 
                    className="pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none w-full md:w-64 transition-all placeholder:text-slate-600"
                />
            </div>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-lg shadow-blue-900/20 hover:shadow-blue-600/20">
                <Download className="w-4 h-4" />
                Baixar Lista
            </button>
        </div>
      </div>

      {/* Tabela Dark Mode */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                        <th className="px-6 py-4">Nome do Aluno</th>
                        <th className="px-6 py-4">Contato</th>
                        <th className="px-6 py-4">Data Matrícula</th>
                        <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {students.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="p-4 bg-slate-800 rounded-full">
                                        <UserCheck className="w-8 h-8 opacity-40" />
                                    </div>
                                    <span className="font-medium">Nenhum aluno matriculado ainda.</span>
                                    <span className="text-xs text-slate-600">Vá ao Dashboard e aprove as inscrições pendentes.</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        students.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-800/50 transition group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-900/20">
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-slate-200 group-hover:text-white transition">{student.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Mail className="w-3.5 h-3.5 text-slate-600" /> {student.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Phone className="w-3.5 h-3.5 text-slate-600" /> {student.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Calendar className="w-4 h-4 text-slate-600" />
                                        {new Date(student.createdAt).toLocaleDateString('pt-AO')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20">
                                        Ativo
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
        
        {/* Footer da Tabela */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/30 text-xs text-slate-500 flex justify-between items-center">
            <span>Mostrando {students.length} alunos</span>
            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700 text-slate-400">Turma 01 - 2026</span>
        </div>
      </div>
    </div>
  )
}