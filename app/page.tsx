'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RegistrationModal from '@/components/RegistrationModal'
import { CheckCircle, Calendar, Clock, MapPin, User, ChevronDown, ShieldCheck, Zap, TrendingUp, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  // Estado global para controlar o modal na página
  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden">
      <Header onOpenModal={openModal} />
      <RegistrationModal isOpen={isModalOpen} onClose={closeModal} />
      
      {/* --- HERO SECTION IMPACTANTE --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Premium com Gradiente e Imagem Abstrata */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-950 via-blue-900 to-indigo-900">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             {/* Efeito de luz */}
             <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/20 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-blue-800/50 text-orange-300 text-sm font-bold mb-6 border border-blue-700/50 backdrop-blur-md uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Certificação Profissional INEFOR
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight drop-shadow-sm">
              Domine o Suporte de TI e Torne-se <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-yellow-300">Indispensável</span>.
            </h1>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl">
              A formação Help Desk prática que te prepara para resolver problemas reais, configurar redes e iniciar sua carreira em tecnologia com confiança imediata.
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm font-bold text-white mb-10">
              <div className="flex items-center gap-2 bg-blue-950/50 border border-blue-800/50 py-3 px-5 rounded-lg backdrop-blur-sm">
                <Calendar className="w-5 h-5 text-orange-400" /> Início: 14/02/2026
              </div>
              <div className="flex items-center gap-2 bg-blue-950/50 border border-blue-800/50 py-3 px-5 rounded-lg backdrop-blur-sm">
                <Clock className="w-5 h-5 text-orange-400" /> Sábados (08:30 - 13:00)
              </div>
              <div className="flex items-center gap-2 bg-blue-950/50 border border-blue-800/50 py-3 px-5 rounded-lg backdrop-blur-sm">
                <MapPin className="w-5 h-5 text-orange-400" /> Presencial (Luanda)
              </div>
            </div>

            <button 
              onClick={openModal}
              className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-10 rounded-xl transition-all transform hover:-translate-y-1 shadow-lg shadow-orange-500/30 text-lg flex items-center gap-3"
            >
              QUERO GARANTIR MINHA VAGA <ChevronDown className="w-5 h-5 rotate-90"/>
            </button>
            <p className="text-blue-200 text-sm mt-4 ml-2 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400"/> Lote 1 (50% OFF) quase esgotado.</p>
          </div>
        </div>
      </section>

      {/* --- DIFERENCIAIS (Cards Elevados) --- */}
      <section id="sobre" className="py-24 px-4 relative z-20 -mt-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {[
                { title: "Aplicabilidade Imediata", icon: Zap, desc: "Nada de teoria inútil. Aprenda diagnosticando problemas reais de hardware e redes desde a primeira aula." },
                { title: "Certificado Reconhecido", icon: ShieldCheck, desc: "Documento com peso no mercado, emitido por uma instituição líder em formação tecnológica." },
                { title: "Visão de Negócio", icon: TrendingUp, desc: "Módulo exclusivo de empreendedorismo para você aprender a precificar e vender seus serviços como freelancer." },
            ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 transition hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200 group">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
                        <item.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-slate-800">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
            ))}
        </div>
      </section>

      {/* --- O QUE VAI APRENDER (Grid Limpo) --- */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-base text-orange-600 font-bold tracking-wider uppercase mb-3">Conteúdo Prático</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-blue-950">Competências que o Mercado Exige</h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "Diagnóstico avançado de Hardware e Software",
            "Configuração e manutenção de Redes TCP/IP",
            "Manutenção preventiva e corretiva de PCs",
            "Atendimento ao cliente e gestão de SLAs",
            "Sistemas de Ticketing e Help Desk",
            "Empreendedorismo e Marketing Pessoal em TI"
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-blue-300 transition">
              <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
              <p className="font-medium text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CURRICULUM (Accordion Moderno) --- */}
      <section id="modulos" className="bg-slate-100 py-24 px-4">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">Conteúdo Programático Detalhado</h2>
                <p className="text-slate-600 text-lg">7 Sábados intensivos de imersão técnica.</p>
            </div>
          
          <div className="space-y-4">
            {[
              { title: "M.1: Fundamentos de Help Desk & Ética", desc: "O papel do analista, níveis de suporte, postura profissional e comunicação assertiva." },
              { title: "M.2: Sistemas Operacionais Avançados", desc: "Instalação, configuração, recuperação e gestão de usuários em Windows e noções de Linux/macOS." },
              { title: "M.3: Montagem e Manutenção de Hardware", desc: "Identificação de componentes, diagnóstico de falhas, limpeza e substituição de peças." },
              { title: "M.4: Redes e Conectividade Aplicada", desc: "Conceitos TCP/IP, crimpagem de cabos, configuração de roteadores Wi-Fi e impressoras de rede." },
              { title: "M.5: Ferramentas de Gestão de TI", desc: "Uso de softwares de acesso remoto, sistemas de tickets (GLPI/Jira) e documentação técnica." },
              { title: "Bónus M.6: Empreendedorismo na Prática (Online)", desc: "Como criar sua marca, precificar serviços, contratos e atrair os primeiros clientes." }
            ].map((mod, i) => (
              <details key={i} className="group bg-white rounded-xl shadow-sm cursor-pointer open:ring-2 open:ring-blue-400/50 transition-all overflow-hidden border border-slate-200/50">
                <summary className="flex justify-between items-center font-bold text-lg p-6 list-none text-slate-700 group-hover:text-blue-700 transition bg-white z-10 relative">
                  <span className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-md flex items-center justify-center text-sm">{i + 1}</span>
                    {mod.title}
                  </span>
                  <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180 text-slate-400" />
                </summary>
                <div className="px-6 pb-6 pt-2 text-slate-600 bg-slate-50/50 border-t border-slate-100 leading-relaxed pl-16">
                    {mod.desc}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING (Cards de Investimento Premium) --- */}
      <section id="investimento" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">Investimento Inteligente</h2>
             <p className="text-slate-600 text-lg max-w-xl mx-auto">Condições especiais para quem decide rápido. O conhecimento que se paga no primeiro serviço.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-10 items-end">
          {/* Lote 3 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300 scale-95">
            <h3 className="font-bold text-xl text-slate-500 mb-2">Lote 3 (Final)</h3>
            <p className="text-3xl font-bold text-slate-700 mb-2">140.000 Kz</p>
            <p className="text-sm inline-block bg-slate-100 text-slate-500 px-3 py-1 rounded-full mb-6">20% OFF</p>
            <button onClick={openModal} className="w-full py-3 border-2 border-slate-300 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition">
              Inscrever neste lote
            </button>
          </div>

          {/* Lote 2 */}
          <div className="bg-white p-8 rounded-2xl border border-blue-200 shadow-lg shadow-blue-100/50 relative scale-100 z-10">
             <h3 className="font-bold text-xl text-blue-900 mb-2">Lote 2 (Intermédio)</h3>
            <p className="text-3xl font-bold text-blue-900 mb-2">105.000 Kz</p>
            <p className="text-sm inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-6 font-semibold">40% OFF</p>
            <ul className="mb-8 space-y-3 text-sm text-slate-600">
                 <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-blue-500"/> Acesso completo ao curso</li>
                 <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-blue-500"/> Material digital</li>
                 <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-blue-500"/> Certificado incluso</li>
            </ul>
            <button onClick={openModal} className="w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold rounded-lg transition">
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

                <h3 className="font-bold text-2xl text-blue-950 mb-1">Lote 1 (VIP)</h3>
                <p className="text-sm text-orange-600 font-semibold mb-4">Vagas Limitadas (Primeiros 87)</p>
                
                <div className="flex items-center gap-3 mb-2">
                    <p className="text-slate-400 line-through text-lg">175.000 Kz</p>
                    <p className="text-5xl font-extrabold text-blue-950">87.500 Kz</p>
                </div>
                <p className="text-sm inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full mb-8 font-bold">
                    <Zap className="w-4 h-4 fill-current" /> 50% DE DESCONTO REAL
                </p>
                
                <ul className="space-y-4 mb-8 text-slate-700">
                <li className="flex gap-3 items-center font-medium"><CheckCircle className="w-6 h-6 text-orange-500 shadow-sm rounded-full"/> Prioridade na matrícula</li>
                <li className="flex gap-3 items-center font-medium"><CheckCircle className="w-6 h-6 text-orange-500 shadow-sm rounded-full"/> Kit de Boas-vindas INEFOR</li>
                <li className="flex gap-3 items-center font-medium"><CheckCircle className="w-6 h-6 text-orange-500 shadow-sm rounded-full"/> Mentoria de Carreira (Grupo)</li>
                </ul>

                <button 
                  onClick={openModal}
                  className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-xl text-lg flex justify-center items-center gap-2 animate-pulse hover:animate-none"
                >
                  GARANTIR 50% OFF AGORA <ArrowRight className="w-5 h-5"/>
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">Pagamento em até 2x sem juros no Banco BIC.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- INSTRUTORES (Dark Section Professional) --- */}
      <section className="bg-blue-950 text-white py-24 px-4 relative overflow-hidden">
        {/* Background Pattern */}
         <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[16px_16px]bg-size-[16px_16px]"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Liderança e Experiência Comprovada</h2>
          
          <div className="grid md:grid-cols-5 gap-12 items-center">
             {/* Lead Instructor (Destaque) */}
             <div className="md:col-span-3 p-8 bg-blue-900/50 rounded-2xl border border-blue-800/50 backdrop-blur-md">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center border-4 border-blue-950 shadow-xl">
                        <span className="text-3xl font-bold">DF</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">Dionísio Fama Noque</h3>
                        <p className="text-orange-300 font-medium">Líder Educacional & Especialista</p>
                    </div>
                </div>
                
                <p className="mb-6 leading-relaxed text-blue-100 text-lg italic">
                  &quot;Não basta saber resolver problemas técnicos; é preciso saber vender soluções e gerar valor para o cliente.&quot;
                </p>
                <p className="text-blue-200 text-sm leading-relaxed">
                  Com mais de 15 anos de experiência acadêmica (UCAN, INSTIC, ISTA) e corporativa. Dionísio fundou a INEFOR com a visão de preencher a lacuna entre a teoria universitária e a prática exigida pelas empresas de Luanda.
                </p>
             </div>

             {/* Other Instructors */}
             <div className="md:col-span-2 space-y-6">
                {[
                    { name: "João Caterça", role: "Especialista em Redes e Infraestrutura" },
                    { name: "Santana Peliganga", role: "Especialista em Hardware e Servidores" }
                ].map((inst, i) => (
                    <div key={i} className="bg-blue-900/30 p-6 rounded-xl flex items-center gap-4 border border-blue-800/30 hover:bg-blue-800/50 transition backdrop-blur-md">
                        <div className="bg-blue-800 p-3 rounded-full">
                            <User className="w-8 h-8 text-blue-300"/>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">{inst.name}</h4>
                            <p className="text-sm text-blue-300">{inst.role}</p>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-20 bg-slate-50 text-center px-4">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-950 mb-6">Pronto para iniciar sua jornada?</h2>
            <p className="text-slate-600 mb-8 text-lg">As vagas do Lote 1 podem acabar a qualquer momento. Não deixe essa oportunidade passar.</p>
            <button onClick={openModal} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-12 rounded-full text-lg shadow-xl hover:shadow-2xl transition hover:-translate-y-1">
                Inscrever-se Agora
            </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}