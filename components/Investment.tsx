import { ArrowRight, CheckCircle, Zap } from "lucide-react";

export function Investiment({openModal }: { openModal: () => void }) {
  return (
    <section id="investimento" className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
          Investimento Inteligente
        </h2>
        <p className="text-slate-600 text-lg max-w-xl mx-auto">
          Condições especiais para quem decide rápido. O conhecimento que se
          paga no primeiro serviço.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-10 items-end">
        {/* Lote 3 */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300 scale-95">
          <h3 className="font-bold text-xl text-slate-500 mb-2">
            Lote 3 (Final)
          </h3>
          <p className="text-3xl font-bold text-slate-700 mb-2">140.000 Kz</p>
          <p className="text-sm inline-block bg-slate-100 text-slate-500 px-3 py-1 rounded-full mb-6">
            20% OFF
          </p>
          <button
            onClick={openModal}
            className="w-full py-3 border-2 border-slate-300 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition"
          >
            Inscrever neste lote
          </button>
        </div>

        {/* Lote 2 */}
        <div className="bg-white p-8 rounded-2xl border border-blue-200 shadow-lg shadow-blue-100/50 relative scale-100 z-10">
          <h3 className="font-bold text-xl text-blue-900 mb-2">
            Lote 2 (Intermédio)
          </h3>
          <p className="text-3xl font-bold text-blue-900 mb-2">105.000 Kz</p>
          <p className="text-sm inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-6 font-semibold">
            40% OFF
          </p>
          <ul className="mb-8 space-y-3 text-sm text-slate-600">
            <li className="flex gap-2">
              <CheckCircle className="w-5 h-5 text-blue-500" /> Acesso completo
              ao curso
            </li>
            <li className="flex gap-2">
              <CheckCircle className="w-5 h-5 text-blue-500" /> Material digital
            </li>
            <li className="flex gap-2">
              <CheckCircle className="w-5 h-5 text-blue-500" /> Certificado
              incluso
            </li>
          </ul>
          <button
            onClick={openModal}
            className="w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold rounded-lg transition"
          >
            Aproveitar Lote 2
          </button>
        </div>

        {/* Lote 1 (Featured Premium) */}
        <div className="bg-linear-to-b from-blue-900 to-blue-950 p-1 rounded-3xl shadow-2xl shadow-orange-500/20 transform hover:-translate-y-2 transition-all duration-300 scale-105 z-20 relative">
          <div className="bg-white p-8 rounded-[22px] h-full relative overflow-hidden">
            {/* Badge */}
            <div className="absolute top-0 right-0">
              <div className="bg-linear-to-r from-orange-500 to-red-500 text-white text-xs font-extrabold px-4 py-2 rounded-bl-2xl uppercase tracking-wider shadow-sm">
                Melhor Oferta
              </div>
            </div>

            <h3 className="font-bold text-2xl text-blue-950 mb-1">
              Lote 1 (VIP)
            </h3>
            <p className="text-sm text-orange-600 font-semibold mb-4">
              Vagas Limitadas (Primeiros 87)
            </p>

            <div className="flex items-center gap-3 mb-2">
              <p className="text-slate-400 line-through text-lg">175.000 Kz</p>
              <p className="text-5xl font-extrabold text-blue-950">87.500 Kz</p>
            </div>
            <p className="text-sm inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full mb-8 font-bold">
              <Zap className="w-4 h-4 fill-current" /> 50% DE DESCONTO REAL
            </p>

            <ul className="space-y-4 mb-8 text-slate-700">
              <li className="flex gap-3 items-center font-medium">
                <CheckCircle className="w-6 h-6 text-orange-500 shadow-sm rounded-full" />{" "}
                Prioridade na matrícula
              </li>
              <li className="flex gap-3 items-center font-medium">
                <CheckCircle className="w-6 h-6 text-orange-500 shadow-sm rounded-full" />{" "}
                Kit de Boas-vindas INEFOR
              </li>
              <li className="flex gap-3 items-center font-medium">
                <CheckCircle className="w-6 h-6 text-orange-500 shadow-sm rounded-full" />{" "}
                Mentoria de Carreira (Grupo)
              </li>
            </ul>

            <button
              onClick={openModal}
              className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-xl text-lg flex justify-center items-center gap-2 animate-pulse hover:animate-none"
            >
              GARANTIR 50% OFF AGORA <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">
              Pagamento em até 2x sem juros no Banco BIC.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
