import {
  Facebook,
  Linkedin,
  Instagram,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-white text-2xl font-bold mb-6">
            INEFOR<span className="text-orange-500">.</span>
          </h3>
          <p className="mb-6 text-sm leading-relaxed max-w-md">
            Formamos profissionais prontos para os desafios reais do mercado de
            tecnologia. Nossa missão é transformar conhecimento técnico em
            carreiras de sucesso em Angola.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-slate-400 hover:text-orange-500 transition"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-orange-500 transition"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-orange-500 transition"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Links Rápidos</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="#" className="hover:text-orange-500 transition">
                Início
              </a>
            </li>
            <li>
              <a href="#modulos" className="hover:text-orange-500 transition">
                Formação Help Desk
              </a>
            </li>
            <li>
              <a
                href="#investimento"
                className="hover:text-orange-500 transition"
              >
                Preços e Lotes
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-500 transition">
                Termos de Serviço
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Contacto</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3 items-start">
              <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
              <span>Av. Deolinda Rodrigues 329, 2º Andar</span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone className="w-5 h-5 text-orange-500 shrink-0" />
              <span>+244 944 683 483</span>
            </li>
            <li className="flex gap-3 items-center">
              <Mail className="w-5 h-5 text-orange-500 shrink-0" />
              <span>geral@inefor.ao</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-900 pt-8 text-center text-xs md:text-sm flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-4">
        <p>
          © {new Date().getFullYear()} INEFOR - Instituto de Formação. Todos os
          direitos reservados.
        </p>
        <p className="mt-2 md:mt-0">Desenvolvido com excelência.</p>
      </div>
    </footer>
  );
}
