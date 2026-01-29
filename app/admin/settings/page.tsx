// app/admin/settings/page.tsx
import { Save, Lock, User, CreditCard } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Configurações do Sistema</h1>
      
      <div className="space-y-8">
        
        {/* Seção 1: Perfil do Admin */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <User className="w-5 h-5 text-slate-500" />
                <h2 className="font-bold text-slate-700">Perfil do Administrador</h2>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome de Exibição</label>
                    <input type="text" defaultValue="Administrador" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">E-mail de Acesso</label>
                    <input type="email" defaultValue="admin@inefor.ao" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-slate-100 text-slate-500 cursor-not-allowed" disabled />
                </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition">
                    <Save className="w-4 h-4" /> Salvar Alterações
                </button>
            </div>
        </section>

        {/* Seção 2: Parâmetros do Curso (Lotes) */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-slate-500" />
                <h2 className="font-bold text-slate-700">Gestão de Lotes e Preços</h2>
            </div>
            <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Preço Base (Kz)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Kz</span>
                            <input type="number" defaultValue="175000" className="w-full pl-9 p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Desconto Lote 1 (%)</label>
                         <input type="number" defaultValue="50" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Vagas Lote 1</label>
                         <input type="number" defaultValue="87" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                    <p><strong>Nota:</strong> Alterar os preços aqui refletirá imediatamente na Landing Page para novos visitantes.</p>
                </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    <Save className="w-4 h-4" /> Atualizar Preços
                </button>
            </div>
        </section>

        {/* Seção 3: Segurança */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden opacity-75">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <Lock className="w-5 h-5 text-slate-500" />
                <h2 className="font-bold text-slate-700">Segurança</h2>
            </div>
            <div className="p-6 flex items-center justify-between">
                <div>
                    <h3 className="font-medium text-slate-900">Alterar Senha</h3>
                    <p className="text-sm text-slate-500">Recomendamos alterar sua senha a cada 90 dias.</p>
                </div>
                <button className="border border-slate-300 bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
                    Redefinir Senha
                </button>
            </div>
        </section>

      </div>
    </div>
  )
}