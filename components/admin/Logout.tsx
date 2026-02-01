// Adicione no topo do arquivo do dashboard ou crie um componente separado
"use client"; // Se decidir transformar a sidebar em client component

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutBtn() {
  // ... dentro do seu componente de Sidebar
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (response.ok) {
        router.push("/admin/login"); // Redireciona para o login após sair
        router.refresh()
      }
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 text-red-500 font-bold text-sm hover:translate-x-1 transition-transform w-full"
    >
      <LogOut size={18} /> Sair do Sistema
    </button>
  );
}
