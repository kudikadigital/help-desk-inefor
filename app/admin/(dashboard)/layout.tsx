import AdminSidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/Header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      {/* Sidebar (Fixo à esquerda) */}
      <AdminSidebar />

      {/* Wrapper do Conteúdo (Lado Direito) */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 md:ml-64">
        
        {/* Header (Fixo no topo da área direita) */}
        <AdminHeader />
        <main className="flex-1 mt-16 p-6 md:p-8 animate-fadeIn overflow-x-hidden">
          {children}
        </main>
        
      </div>
    </div>
  )
}