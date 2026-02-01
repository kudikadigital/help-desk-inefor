import BatchForm from '@/components/admin/BatchForm'
import { prisma } from '@/lib/prisma'
import { Save, Lock, User, CreditCard } from 'lucide-react'

export default async function AdminSettingsPage() {
  const batches = await prisma.batch.findMany({
    orderBy: { order: 'desc' }
  })
  
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Configurações do Sistema</h1>
      
      <div className="space-y-8">
        
        {/* Seção 1: Perfil do Admin */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/30 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                <h2 className="font-bold text-slate-200">Perfil do Administrador</h2>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nome de Exibição</label>
                    <input 
                        type="text" 
                        defaultValue="Administrador" 
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition" 
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">E-mail de Acesso</label>
                    <input 
                        type="email" 
                        defaultValue="admin@inefor.ao" 
                        className="w-full p-3 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-slate-500 cursor-not-allowed" 
                        disabled 
                    />
                </div>
            </div>
            <div className="px-6 py-4 bg-slate-950/30 border-t border-slate-800 flex justify-end">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-lg shadow-blue-900/20">
                    <Save className="w-4 h-4" /> Salvar Alterações
                </button>
            </div>
        </section>

        {/* Seção 2: Parâmetros do Curso (Lotes) */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/30 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" />
              <h2 className="font-bold text-slate-200">Gestão de Lotes e Preços</h2>
          </div>
          
          <div className="divide-y divide-slate-800">
            {batches.map((batch) => (
               <BatchForm key={batch.id} batch={batch} />
            ))}
          </div>

          <div className="p-4 bg-blue-900/10 border-t border-blue-900/20 text-sm text-blue-200 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              <p>Alterações salvas refletem imediatamente na Landing Page pública.</p>
          </div>
      </section>

        {/* Seção 3: Segurança */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden opacity-75 hover:opacity-100 transition duration-300">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/30 flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-500" />
                <h2 className="font-bold text-slate-200">Segurança</h2>
            </div>
            <div className="p-6 flex items-center justify-between">
                <div>
                    <h3 className="font-medium text-white">Alterar Senha</h3>
                    <p className="text-sm text-slate-400 mt-1">Recomendamos alterar sua senha a cada 90 dias.</p>
                </div>
                <button className="border border-slate-700 bg-transparent text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
                    Redefinir Senha
                </button>
            </div>
        </section>

      </div>
    </div>
  )
}