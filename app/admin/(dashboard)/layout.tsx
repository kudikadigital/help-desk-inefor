// app/admin/(dashboard)/layout.tsx
import AdminSidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/Header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950 font-sans flex text-slate-200 selection:bg-blue-500/30">
      {/* Sidebar Fixo */}
      <AdminSidebar />

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 transition-all duration-300">
        <AdminHeader />
        
        <main className="flex-1 mt-16 p-6 md:p-8 animate-fadeIn overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}