'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Settings, LogOut, Shield} from 'lucide-react'
import { useRouter } from 'next/navigation'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'Todos os Leads', icon: Users, href: '/admin/students' },
  { name: 'Configurações', icon: Settings, href: '/admin/settings' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex-col h-screen fixed left-0 top-0 z-50 hidden md:flex">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
          <div className="bg-blue-600 p-1.5 rounded-lg">
             <Shield className="w-5 h-5 text-white" />
          </div>
          INEFOR <span className="text-slate-500 text-xs ml-1 font-normal">ADMIN</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Principal</p>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition"
        >
          <LogOut className="w-5 h-5" />
          Sair do Sistema
        </button>
      </div>
    </aside>
  )
}