import { ArrowRight, CheckCircle, Zap, Layers, Lock } from "lucide-react";
import { Batch } from "@prisma/client";

interface InvestimentProps {
  openModal: () => void;
  batches: Batch[];
}

export function Investiment({ openModal, batches }: InvestimentProps) {
  // Função auxiliar para calcular preço com desconto
  const calculatePrice = (price: number, discount: number) => {
    return price * (1 - discount / 100);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })
      .format(value)
      .replace('Kz', '')
      .trim() + ' Kz';
  };

  return (
    <section id="investimento" className="py-24 px-4 max-w-7xl mx-auto bg-slate-50">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
          Investimento Inteligente
        </h2>
        <p className="text-slate-600 text-lg max-w-xl mx-auto">
          Condições especiais para quem decide rápido. Escolha o lote que melhor se adapta ao seu momento.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {batches.map((batch) => {
            const finalPrice = calculatePrice(batch.price, batch.discount);
            const isFeatured = batch.isFeatured;
            
            // Simulação de vagas preenchidas para a barra de progresso (Inverso dos slots restantes)
            // Assumindo base 100 para visualização
            const progress = Math.min(100, Math.max(10, 100 - batch.slots)); 

            return (
                <div 
                    key={batch.id} 
                    className={`
                        relative rounded-3xl p-8 transition-all duration-300 flex flex-col h-full
                        ${isFeatured 
                            ? 'bg-white border-2 border-blue-600 shadow-2xl scale-105 z-10' 
                            : 'bg-white border border-slate-200 shadow-sm hover:border-blue-300'
                        }
                    `}
                >
                    {/* Badge de Destaque Superior */}
                    {isFeatured && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-md">
                            Mais Popular
                        </div>
                    )}

                    {/* Cabeçalho do Card */}
                    <div className="text-center mb-6">
                        <div className={`mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${isFeatured ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                            <Layers className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-xl text-slate-800 uppercase tracking-wide">{batch.name}</h3>
                    </div>

                    {/* Preço */}
                    <div className="text-center mb-6">
                        <p className="text-slate-400 line-through text-sm font-medium mb-1">
                            {formatCurrency(batch.price)}
                        </p>
                        <p className={`text-4xl font-extrabold ${isFeatured ? 'text-blue-600' : 'text-slate-800'}`}>
                            {formatCurrency(finalPrice)}
                        </p>
                        <p className="text-slate-500 text-xs mt-2 font-medium">
                            à vista ou 2x de {formatCurrency(finalPrice / 2)}
                        </p>
                    </div>

                    {/* Banner de Desconto Verde (Estilo da Imagem) */}
                    <div className="bg-green-500 text-white text-center font-bold text-sm py-2.5 rounded-lg mb-8 flex items-center justify-center gap-2 shadow-sm shadow-green-200">
                        <Zap className="w-4 h-4 fill-current" />
                        DESCONTO DE ATÉ {batch.discount}%
                    </div>

                    {/* Lista de Benefícios */}
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex gap-3 text-sm text-slate-600">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                            <span>24 horas de conteúdo prático</span>
                        </li>
                        <li className="flex gap-3 text-sm text-slate-600">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                            <span>Certificado reconhecido INEFOR</span>
                        </li>
                        <li className="flex gap-3 text-sm text-slate-600">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                            <span>Material didático incluso</span>
                        </li>
                        {/* {isFeatured && (
                             <li className="flex gap-3 text-sm text-slate-600 font-medium">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                <span>Mentoria de Carreira Exclusiva</span>
                            </li>
                        )} */}
                         <li className="flex gap-3 text-sm text-slate-600">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                            <span>Aulas 100% Presenciais</span>
                        </li>
                    </ul>

                    {/* Barra de Vagas e Footer */}
                    <div className="mt-auto">
                        <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                            <span>Vagas ocupadas</span>
                            <span>{batch.slots > 20 ? 'Alta procura' : 'Quase esgotado'}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
                            <div 
                                className={`h-full rounded-full ${isFeatured ? 'bg-blue-600' : 'bg-slate-400'}`} 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-right text-slate-400 mb-6">{batch.slots} vagas restantes</p>

                        <button 
                            onClick={openModal}
                            className={`
                                w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg hover:-translate-y-1
                                ${isFeatured 
                                    ? 'bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-orange-500/30' 
                                    : 'bg-slate-800 hover:bg-slate-900 text-white shadow-slate-900/10'
                                }
                            `}
                        >
                            {isFeatured ? 'INSCREVER-SE AGORA' : 'GARANTIR VAGA'}
                            {isFeatured && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </div>
                    
                    {/* Overlay para Lotes Esgotados (Exemplo Visual se slots == 0) */}
                    {batch.slots === 0 && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-3xl flex flex-col items-center justify-center z-20">
                             <Lock className="w-12 h-12 text-slate-400 mb-2" />
                             <span className="font-bold text-xl text-slate-600">ESGOTADO</span>
                        </div>
                    )}
                </div>
            )
        })}
      </div>
    </section>
  );
}