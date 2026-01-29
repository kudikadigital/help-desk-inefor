import { ShieldCheck, User, TrendingUp, DollarSign } from 'lucide-react'

export function TargetAudience() {
  return (
    <section className="py-20 px-4 bg-white relative z-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">Para quem é esta formação?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Se identifica com um destes perfis? Então este é o próximo passo para a sua carreira.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Técnicos de TI", desc: "Que desejam especialização prática.", icon: ShieldCheck },
            { label: "Estudantes", desc: "De Engenharia ou TI buscando prática real.", icon: User },
            { label: "Primeiro Emprego", desc: "Quem quer entrar rápido no mercado.", icon: TrendingUp },
            { label: "Empreendedores", desc: "Que querem abrir seu negócio de suporte.", icon: DollarSign },
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:border-blue-300 hover:shadow-lg transition group text-center">
              <div className="w-14 h-14 mx-auto bg-white text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">{item.label}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}