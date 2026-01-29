"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: "admin", // O usuário padrão que criamos no seed
          password 
        }),
      });

      if (response.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await response.json();
        setError(data.error || "Acesso negado.");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        {/* Luz decorativa de fundo */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/10 blur-[100px] rounded-full" />
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30">
            <ShieldCheck className="text-white h-8 w-8" />
          </div>
          <h1 className="text-white font-black text-2xl uppercase tracking-tighter italic">Admin INEFOR</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 bg-slate-800/50 px-3 py-1 rounded-full">
            Acesso Restrito
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-[10px] font-black uppercase text-blue-500 mb-2 tracking-[0.2em] ml-1">
              Chave de Acesso
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="password" 
                value={password}
                required
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-slate-700"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-red-500 text-[10px] font-bold uppercase mt-3 text-center animate-pulse">
                ⚠️ {error}
              </p>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black py-4 rounded-xl uppercase tracking-tighter transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Autenticar no Painel"
            )}
          </button>
        </form>

        <p className="text-center text-slate-600 text-[9px] uppercase font-bold tracking-widest mt-8 italic">
          v2.0 Encryption Active
        </p>
      </div>
    </main>
  );
}