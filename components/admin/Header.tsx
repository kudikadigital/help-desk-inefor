'use client'

import { Bell, Search } from 'lucide-react'

export default function AdminHeader() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-0 md:left-64 z-40 flex items-center justify-between px-6 md:px-8 shadow-sm">
      
      {/* Search / Breadcrumb Placeholder */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
                type="text" 
                placeholder="Buscar lead..." 
                className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-orange-500/50 outline-none w-64 transition-all"
            />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition border border-transparent hover:border-slate-200">
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                AD
            </div>
            <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-700 leading-none">Administrador</p>
                <p className="text-xs text-slate-400 mt-1">admin@inefor.ao</p>
            </div>
        </div>
      </div>
    </header>
  )
}