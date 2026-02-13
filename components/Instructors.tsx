import { User } from "lucide-react";
import Image from "next/image";
// Se estiver num componente separado, certifique-se de importar o que for necessário.

export function Instructors() {
  return (
    <section className="bg-slate-950 text-white py-24 px-4 relative overflow-hidden">
      {/* Background Pattern e Brilhos */}
      <div className="absolute inset-0 opacity-10 bg-[radial-linear(#ffffff_1px,transparent_1px)] bg-size-[24px_24px]"></div>
      <div className="absolute top-0 right-0 w-125 h-125 bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-orange-500/10 blur-[100px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-orange-500 uppercase mb-3">
            Mentoria de Excelência
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Conheça os seus formadores
          </h3>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Aprenda com profissionais que estão no campo de batalha. Nossa
            equipa une o rigor académico à experiência real do mercado
            corporativo angolano.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-stretch">
          {/* Lead Instructor (Destaque) */}
          <div className="lg:col-span-3 p-8 md:p-10 bg-linear-to-br from-blue-900/40 to-slate-900/80 rounded-3xl border border-blue-800/30 backdrop-blur-md shadow-2xl relative overflow-hidden group">
            {/* Elemento de design flutuante */}
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              <User className="w-32 h-32 text-blue-400" />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 relative z-10">
              {/* Substitua a URL abaixo pela foto real do Dionísio */}
              <Image
                src="/images/dionisio-fama.png"
                width={50}
                height={50}
                alt="Dionísio Fama Noque"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-orange-500 shadow-xl shadow-orange-500/20"
              />
              <div>
                <h3 className="text-3xl font-bold text-white mb-1">
                  Dionísio Fama Noque
                </h3>
                <p className="text-orange-400 font-semibold tracking-wide uppercase text-sm mb-2">
                  Líder Educacional & Especialista IT
                </p>
                <div className="flex gap-2">
                  <span className="bg-blue-950 text-blue-300 text-xs px-2.5 py-1 rounded-md border border-blue-800/50">
                    Fundador
                  </span>
                  <span className="bg-blue-950 text-blue-300 text-xs px-2.5 py-1 rounded-md border border-blue-800/50">
                    Docente
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 space-y-5">
              <p className="text-xl text-blue-100 font-medium italic leading-relaxed border-l-4 border-orange-500 pl-4">
                &quot;Não basta saber resolver problemas técnicos; é preciso
                saber vender soluções, comunicar com clareza e gerar valor
                indiscutível para o cliente.&quot;
              </p>
              <p className="text-slate-300 leading-relaxed">
                Com mais de 15 anos de trajetória unindo a excelência académica
                em instituições de renome (UCAN, INSTIC, ISTA) às reais
                exigências do mercado corporativo. Dionísio fundou a INEFOR com
                um propósito claro:{" "}
                <strong>
                  preencher a lacuna entre a teoria universitária e a prática
                  exigida pelas empresas de Luanda
                </strong>
                , formando profissionais que o mercado disputa.
              </p>
            </div>
          </div>

          {/* Other Instructors */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {[
              {
                name: "João Caterça",
                role: "Especialista em Redes & Infraestrutura",
                bio: "Vasta experiência na conceção e implementação de redes corporativas seguras e escaláveis.",
                // Substitua pela foto real do João
                image: "/images/joao-caterca.jpg",
              },
              {
                name: "Santana Peliganga",
                role: "Especialista em Hardware & Servidores",
                bio: "Mestre em diagnósticos complexos e otimização de infraestruturas físicas para alta disponibilidade.",
                // Substitua pela foto real do Santana
                image: "/images/santana-peliganga.jpg",
              },
            ].map((inst, i) => (
              <div
                key={i}
                className="bg-slate-900/50 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-5 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-300 h-full shadow-lg"
              >
                <Image
                  src={inst.image}
                  alt={inst.name}
                  width={50}
                  height={50}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-700 shadow-md shrink-0"
                />
                <div>
                  <h4 className="font-bold text-lg text-white mb-0.5">
                    {inst.name}
                  </h4>
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
                    {inst.role}
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {inst.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
