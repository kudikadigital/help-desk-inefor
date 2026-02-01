'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Settings, Shield } from 'lucide-react'
import LogoutBtn from './Logout'

const menuItems = [
  { name: 'Visão Geral', icon: LayoutDashboard, href: '/admin' },
  { name: 'Alunos', icon: Users, href: '/admin/students' }, // Exemplo futuro
  { name: 'Configurações', icon: Settings, href: '/admin/settings' }, // Exemplo futuro
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-50 transition-all duration-300 hidden md:flex">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950/50">
        <div className="font-bold text-xl text-white tracking-tight flex items-center gap-2">
          <Shield className="w-6 h-6 text-orange-500" />
          INEFOR<span className="text-orange-500">.</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Principal</p>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30">
        <LogoutBtn />
      </div>
    </aside>
  )
}