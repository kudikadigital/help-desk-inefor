'use client'

import { Bell, Search } from 'lucide-react'

export default function AdminHeader() {
  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 fixed top-0 right-0 left-0 md:left-64 z-40 flex items-center justify-between px-6 md:px-8 shadow-sm transition-all duration-300">
      
      {/* Search / Breadcrumb Placeholder */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
                type="text" 
                placeholder="Buscar lead..." 
                className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-sm text-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none w-64 transition-all placeholder:text-slate-600"
            />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notificações */}
        <button className="relative p-2 text-slate-400 hover:bg-slate-900 hover:text-white rounded-full transition">
            <Bell className="w-5 h-5" />
            {/* Dot de notificação com borda escura para destacar no fundo dark */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950"></span>
        </button>
        
        {/* Divisor Vertical */}
        <div className="h-8 w-px bg-slate-800 mx-1"></div>

        {/* Perfil do Usuário */}
        <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-900 p-1.5 rounded-xl transition border border-transparent hover:border-slate-800 group">
            <div className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-900/20 group-hover:scale-105 transition">
                AD
            </div>
            <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-200 leading-none group-hover:text-white transition">Administrador</p>
                <p className="text-[10px] text-slate-500 mt-1.5 font-medium tracking-wide">admin@inefor.ao</p>
            </div>
        </div>
      </div>
    </header>
  )
}