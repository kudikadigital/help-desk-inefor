// app/admin/students/page.tsx
import { prisma } from '@/lib/prisma'
import { Mail, Phone, Calendar, Download, Search, UserCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminStudentsPage() {
  // Busca apenas quem já é aluno oficial (Status = MATRICULADO)
  const students = await prisma.lead.findMany({
    where: { status: 'MATRICULADO' },
    orderBy: { name: 'asc' } // Ordem alfabética para facilitar a chamada
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Alunos Matriculados</h1>
          <p className="text-slate-500 text-sm mt-1">Gestão da turma atual (Help Desk - Fev/2026)</p>
        </div>
        
        <div className="flex gap-2">
            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Buscar aluno..." 
                    className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
                />
            </div>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
                <Download className="w-4 h-4" />
                Baixar Lista
            </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                        <th className="px-6 py-4">Nome do Aluno</th>
                        <th className="px-6 py-4">Contato</th>
                        <th className="px-6 py-4">Data Matrícula</th>
                        <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {students.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                <div className="flex flex-col items-center gap-2">
                                    <UserCheck className="w-10 h-10 opacity-20" />
                                    <span>Nenhum aluno matriculado ainda.</span>
                                    <span className="text-xs">Vá ao Dashboard e aprove as inscrições pendentes.</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        students.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-50 transition group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-slate-900">{student.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Mail className="w-3 h-3 text-slate-400" /> {student.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Phone className="w-3 h-3 text-slate-400" /> {student.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        {new Date(student.createdAt).toLocaleDateString('pt-AO')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                        Ativo
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 text-xs text-slate-500 flex justify-between">
            <span>Mostrando {students.length} alunos</span>
            <span>Turma 01 - 2026</span>
        </div>
      </div>
    </div>
  )
}