import { CheckCircle } from 'lucide-react'

export function Benefits({ openModal }: { openModal: () => void }) {
  return (
    <section className="py-24 px-4 bg-blue-50 relative overflow-hidden">
      {/* Elemento decorativo de fundo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-6">Por que escolher o INEFOR?</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Não somos apenas um centro de formação.Somos uma ponte direta entre o conhecimento académico e o mercado de trabalho angolano.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Conteúdo 100% adaptado à realidade do mercado nacional",
              "Laboratórios equipados (não precisa levar PC)",
              "Instrutores com vasta experiência prática e académica",
              "Mentoria de carreira e empreendedorismo inclusa",
              "Certificado reconhecido que valida sua competência"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                <CheckCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <span className="font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>
          
          <button onClick={openModal} className="bg-blue-900 text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-800 transition shadow-lg hover:-translate-y-1">
            Quero fazer parte da elite
          </button>
        </div>

        {/* Card Flutuante Visual */}
        <div className="relative h-100 bg-slate-200 rounded-2xl overflow-hidden shadow-2xl border-4 border-white hidden lg:block bg-[url('/images/inefor-interns-img.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-linear-to-t from-blue-900/90 to-transparent flex items-end p-8">
                <div className="text-white">
                    <p className="font-bold text-xl mb-1">Ambiente 100% Prático</p>
                    <p className="text-sm opacity-90">Simulamos os desafios reais das empresas.</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  )
}