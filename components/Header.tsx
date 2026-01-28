'use client'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header({ onOpenModal }: { onOpenModal: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Início', href: '#' },
    { name: 'O Curso', href: '#sobre' },
    { name: 'Módulos', href: '#modulos' },
    { name: 'Investimento', href: '#investimento' },
  ]

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-blue-950/90 backdrop-blur-md py-4 shadow-lg' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo Placeholder */}
        <div className="text-white font-bold text-2xl tracking-tight">
          INEFOR<span className="text-orange-500">.</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="text-blue-100 hover:text-orange-400 transition text-sm font-medium">
              {link.name}
            </a>
          ))}
          <button onClick={onOpenModal} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-bold transition transform hover:scale-105 text-sm">
            Inscrever-se Agora
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-blue-900 py-4 px-4 shadow-xl border-t border-blue-800">
           <nav className="flex flex-col gap-4">
            {navLinks.map(link => (
                <a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-blue-100 block py-2">
                  {link.name}
                </a>
              ))}
               <button onClick={() => {onOpenModal(); setIsMobileMenuOpen(false)}} className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold">
                Inscrever-se Agora
              </button>
           </nav>
        </div>
      )}
    </header>
  )
}