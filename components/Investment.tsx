import { ArrowRight, CheckCircle, Zap } from "lucide-react";
import { Batch } from "@prisma/client"; // Importamos o tipo do Prisma

interface InvestimentProps {
  openModal: () => void;
  batches: Batch[]; // Recebe a lista do banco de dados
}

export function Investiment({ openModal, batches }: InvestimentProps) {
  // Função auxiliar para calcular preço com desconto
  const calculatePrice = (price: number, discount: number) => {
    return price * (1 - discount / 100);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(value).replace('Kz', '').trim() + ' Kz';
  };

  return (
    <section id="investimento" className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
          Investimento Inteligente
        </h2>
        <p className="text-slate-600 text-lg max-w-xl mx-auto">
          Condições especiais para quem decide rápido. O conhecimento que se paga no primeiro serviço.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-10 items-end">
        {batches.map((batch) => {
            const finalPrice = calculatePrice(batch.price, batch.discount);
            
            // Renderização Condicional baseada se é destaque (Lote 1) ou normal
            if (batch.isFeatured) {
                return (
                    <div key={batch.id} className="bg-linear-to-b from-blue-900 to-blue-950 p-1 rounded-3xl shadow-2xl shadow-orange-500/20 transform hover:-translate-y-2 transition-all duration-300 scale-105 z-20 relative order-first md:order-0">
                        <div className="bg-white p-8 rounded-[22px] h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0">
                                <div className="bg-linear-to-r from-orange-500 to-red-500 text-white text-xs font-extrabold px-4 py-2 rounded-bl-2xl uppercase tracking-wider shadow-sm">
                                    Melhor Oferta
                                </div>
                            </div>
                            <h3 className="font-bold text-2xl text-blue-950 mb-1">{batch.name}</h3>
                            <p className="text-sm text-orange-600 font-semibold mb-4">Vagas Limitadas ({batch.slots})</p>
                            <div className="flex items-center gap-3 mb-2">
                                <p className="text-slate-400 line-through text-lg">{formatCurrency(batch.price)}</p>
                                <p className="text-5xl font-extrabold text-blue-950">{formatCurrency(finalPrice)}</p>
                            </div>
                            <p className="text-sm inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full mb-8 font-bold">
                                <Zap className="w-4 h-4 fill-current" /> {batch.discount}% DE DESCONTO REAL
                            </p>
                             <ul className="space-y-4 mb-8 text-slate-700">
                                <li className="flex gap-3 items-center font-medium"><CheckCircle className="w-6 h-6 text-orange-500 shadow-sm rounded-full" /> Prioridade na matrícula</li>
                                <li className="flex gap-3 items-center font-medium"><CheckCircle className="w-6 h-6 text-orange-500 shadow-sm rounded-full" /> Kit de Boas-vindas INEFOR</li>
                                <li className="flex gap-3 items-center font-medium"><CheckCircle className="w-6 h-6 text-orange-500 shadow-sm rounded-full" /> Mentoria de Carreira (Grupo)</li>
                            </ul>
                            <button onClick={openModal} className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-xl text-lg flex justify-center items-center gap-2 animate-pulse hover:animate-none">
                                GARANTIR {batch.discount}% OFF AGORA <ArrowRight className="w-5 h-5" />
                            </button>
                             <p className="text-center text-xs text-slate-400 mt-4">Pagamento em até 2x sem juros no Banco BIC.</p>
                        </div>
                    </div>
                )
            } 
            
            // Renderização dos Lotes Normais (2 e 3)
            return (
                 <div key={batch.id} className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition-all duration-300">
                    <h3 className={`font-bold text-xl mb-2 ${batch.discount >= 40 ? 'text-blue-900' : 'text-slate-500'}`}>{batch.name}</h3>
                    <p className={`text-3xl font-bold mb-2 ${batch.discount >= 40 ? 'text-blue-900' : 'text-slate-700'}`}>{formatCurrency(finalPrice)}</p>
                    <p className={`text-sm inline-block px-3 py-1 rounded-full mb-6 ${batch.discount >= 40 ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-slate-100 text-slate-500'}`}>
                        {batch.discount}% OFF
                    </p>
                     <ul className="mb-8 space-y-3 text-sm text-slate-600">
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-blue-500" /> Acesso completo</li>
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-blue-500" /> Material digital</li>
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-blue-500" /> Certificado incluso</li>
                    </ul>
                    <button onClick={openModal} className={`w-full py-3 font-bold rounded-lg transition ${batch.discount >= 40 ? 'bg-blue-100 hover:bg-blue-200 text-blue-800' : 'border-2 border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                        {batch.discount >= 40 ? 'Aproveitar Oferta' : 'Inscrever neste lote'}
                    </button>
                </div>
            )
        })}
      </div>
    </section>
  );
}