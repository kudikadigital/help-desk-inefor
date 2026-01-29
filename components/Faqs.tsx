import { ChevronDown } from 'lucide-react'

export function Faqs() {
  return (
    <section className="py-20 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-blue-950 mb-4">Dúvidas Frequentes</h2>
        <p className="text-slate-500">Tudo o que precisa saber antes de garantir a sua vaga.</p>
      </div>

      <div className="space-y-4">
        {[
          { q: "É necessário ter experiência prévia em TI?", a: "Não. Basta ter conhecimentos básicos de informática para acompanhar o curso." },
          { q: "O curso é presencial ou online?", a: "Totalmente presencial em Luanda, para garantir a qualidade das aulas práticas nos nossos laboratórios." },
          { q: "Recebo certificado ao final?", a: "Sim. Ao concluir o curso com aproveitamento, receberá um certificado emitido pelo INEFOR." },
          { q: "Preciso levar notebook?", a: "Não. Toda a infraestrutura e equipamentos necessários serão disponibilizados pelo INEFOR." },
          { q: "Posso parcelar o pagamento?", a: "Sim, oferecemos a opção de pagamento em até 2 parcelas, dependendo do lote escolhido." },
        ].map((faq, i) => (
          <details key={i} className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <summary className="flex justify-between items-center font-semibold text-slate-800 p-5 cursor-pointer list-none hover:bg-slate-50 transition">
              {faq.q}
              <ChevronDown className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-5 pt-2 text-slate-600 bg-slate-50/50 leading-relaxed border-t border-slate-100">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}