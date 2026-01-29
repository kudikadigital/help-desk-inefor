import AdminSidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/Header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Sidebar (Fixo à esquerda) */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col min-h-screen transition-all duration-300">
        
        {/* Header (Fixo no topo da área de conteúdo) */}
        <AdminHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 pt-20 p-6 md:p-8 animate-fadeIn">
          {children}
        </main>
        
      </div>
    </div>
  )
}