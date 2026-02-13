"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegistrationModal from "@/components/RegistrationModal";
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronDown,
  ShieldCheck,
  Zap,
  TrendingUp,
  ChevronUp,
} from "lucide-react";
import { Faqs } from "@/components/Faqs";
import { TargetAudience } from "@/components/TargetAudience";
import { Benefits } from "@/components/Benefits";
import { Investiment } from "@/components/Investment";
import { Batch } from "@prisma/client";
import { Instructors } from "./Instructors";

export default function LandingPageClient({ batches }: { batches: Batch[] }) {
  // Estado global para controlar o modal na página
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden">
      <Header onOpenModal={openModal} />
      <RegistrationModal isOpen={isModalOpen} onClose={closeModal} />

      {/* --- HERO SECTION IMPACTANTE --- */}
      <section className="relative pt-32 pb-20 lg:pt-44 overflow-hidden">
        {/* Background Premium com Gradiente e Imagem Abstrata */}
        <div className="absolute inset-0 z-0">
          {/* Camada Azul de Sobreposição (Multiplicação para dar o tom da marca) */}
          <div className="absolute inset-0 bg-blue-950/90 mix-blend-multiply z-10"></div>

          {/* Imagem de Fundo (Ex: Laboratório ou Cabos de Rede) */}
          {/* Nota: Substitua a URL abaixo por uma foto real do INEFOR se tiveres */}
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0')] bg-cover bg-center opacity-60"></div>

          {/* Opcional: Manter a textura de cubos sutil por cima */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-20">
          <div className="max-w-4xl">
            <span className="text-4xl text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-yellow-300">
                Help Desk
              </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight drop-shadow-sm">
              Domine o Suporte de TI e Torne-se{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-yellow-300">
                Indispensável
              </span>
              .
            </h1>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl">
              Help Desk - Formação prática que te prepara para resolver
              problemas reais, configurar redes e iniciar sua carreira em
              tecnologia com confiança imediata.
            </p>

            <div className="flex flex-wrap gap-4 text-sm font-bold text-white mb-10">
              <div className="flex items-center gap-2 bg-blue-950/50 border border-blue-800/50 py-3 px-5 rounded-lg backdrop-blur-sm">
                <Calendar className="w-5 h-5 text-orange-400" /> Início:
                14/02/2026
              </div>
              <div className="flex items-center gap-2 bg-blue-950/50 border border-blue-800/50 py-3 px-5 rounded-lg backdrop-blur-sm">
                <Clock className="w-5 h-5 text-orange-400" /> Sábados (08:30 -
                13:00)
              </div>
              <div className="flex items-center gap-2 bg-blue-950/50 border border-blue-800/50 py-3 px-5 rounded-lg backdrop-blur-sm">
                <MapPin className="w-5 h-5 text-orange-400" /> Presencial
                (Luanda)
              </div>
            </div>

            <button
              onClick={openModal}
              className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-10 rounded-xl transition-all transform hover:-translate-y-1 shadow-lg shadow-orange-500/30 text-lg flex items-center gap-3"
            >
              QUERO GARANTIR MINHA VAGA{" "}
              <ChevronUp className="w-5 h-5 rotate-90" />
            </button>
            <p className="text-blue-200 text-sm mt-4 ml-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" /> Lote 1 (50%
              OFF) quase esgotado.
            </p>
          </div>
        </div>
      </section>

      <TargetAudience />

      {/* --- DIFERENCIAIS (Cards Elevados) --- */}
      <section id="sobre" className="py-24 px-4 relative z-20 -mt-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Aplicabilidade Imediata",
              icon: Zap,
              desc: "Nada de teoria inútil. Aprenda diagnosticando problemas reais de hardware e redes desde a primeira aula.",
            },
            {
              title: "Certificado Reconhecido",
              icon: ShieldCheck,
              desc: "Documento com peso no mercado, emitido por uma instituição líder em formação tecnológica.",
            },
            {
              title: "Visão de Negócio",
              icon: TrendingUp,
              desc: "Módulo exclusivo de empreendedorismo para você aprender a precificar e vender seus serviços como freelancer.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 transition hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200 group"
            >
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">
                {item.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- O QUE VAI APRENDER (Grid Limpo) --- */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-base text-orange-600 font-bold tracking-wider uppercase mb-3">
            Conteúdo Prático
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-blue-950">
            Competências que o Mercado Exige
          </h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "Diagnóstico avançado de Hardware e Software",
            "Configuração e manutenção de Redes TCP/IP",
            "Manutenção preventiva e corretiva de PCs",
            "Atendimento ao cliente e gestão de SLAs",
            "Sistemas de Ticketing e Help Desk",
            "Empreendedorismo e Marketing Pessoal em TI",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-blue-300 transition"
            >
              <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
              <p className="font-medium text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <Benefits openModal={openModal} />

      {/* --- CURRICULUM (Accordion Moderno) --- */}
      <section id="modulos" className="bg-slate-100 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
              Conteúdo Programático Detalhado
            </h2>
            <p className="text-slate-600 text-lg">
              7 Sábados intensivos de imersão técnica.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "M.1: Fundamentos de Help Desk & Ética",
                desc: "O papel do analista, níveis de suporte, postura profissional e comunicação assertiva.",
              },
              {
                title: "M.2: Sistemas Operacionais Avançados",
                desc: "Instalação, configuração, recuperação e gestão de usuários em Windows e noções de Linux/macOS.",
              },
              {
                title: "M.3: Montagem e Manutenção de Hardware",
                desc: "Identificação de componentes, diagnóstico de falhas, limpeza e substituição de peças.",
              },
              {
                title: "M.4: Redes e Conectividade Aplicada",
                desc: "Conceitos TCP/IP, crimpagem de cabos, configuração de roteadores Wi-Fi e impressoras de rede.",
              },
              {
                title: "M.5: Ferramentas de Gestão de TI",
                desc: "Uso de softwares de acesso remoto, sistemas de tickets (GLPI/Jira) e documentação técnica.",
              },
              {
                title: "Bónus M.6: Empreendedorismo na Prática (Online)",
                desc: "Como criar sua marca, precificar serviços, contratos e atrair os primeiros clientes.",
              },
            ].map((mod, i) => (
              <details
                key={i}
                className="group bg-white rounded-xl shadow-sm cursor-pointer open:ring-2 open:ring-blue-400/50 transition-all overflow-hidden border border-slate-200/50"
              >
                <summary className="flex justify-between items-center font-bold text-lg p-6 list-none text-slate-700 group-hover:text-blue-700 transition bg-white z-10 relative">
                  <span className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-md flex items-center justify-center text-sm">
                      {i + 1}
                    </span>
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
      <Investiment openModal={openModal} batches={batches} />

      {/* --- INSTRUTORES (Dark Section Professional) --- */}
     <Instructors />

      {/* --- FINAL CTA --- */}
      <section className="py-20 bg-slate-50 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-950 mb-6">
            Pronto para iniciar sua jornada?
          </h2>
          <p className="text-slate-600 mb-8 text-lg">
            As vagas do Lote 1 podem acabar a qualquer momento. Não deixe essa
            oportunidade passar.
          </p>
          <button
            onClick={openModal}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-12 rounded-full text-lg shadow-xl hover:shadow-2xl transition hover:-translate-y-1"
          >
            Inscrever-se Agora
          </button>
        </div>
      </section>
      <Faqs />
      <Footer />
    </div>
  );
}
