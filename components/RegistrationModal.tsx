'use client'

import { useState, useRef, useEffect } from 'react' // 1. Importar useEffect
import { X, UploadCloud, CheckCircle, ArrowRight, Loader2, AlertCircle } from 'lucide-react'

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  // Estados do Formulário
  const [formDataState, setFormDataState] = useState({ name: '', email: '', phone: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  // 2. Efeito para resetar o modal sempre que ele for fechado
  useEffect(() => {
    if (!isOpen) {
      // Pequeno delay para evitar que o usuário veja o reset acontecendo enquanto o modal fecha
      const timer = setTimeout(() => {
        setStep(1)
        setSuccess(false)
        setError('')
        setLoading(false)
        setFormDataState({ name: '', email: '', phone: '' })
        setFileName(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDataState({ ...formDataState, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
    }
  }

  // Função principal de envio
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    
    // Validação simples do Passo 1 antes de prosseguir
    if (step === 1) {
      if (!formDataState.name || !formDataState.email || !formDataState.phone) {
        setError('Por favor, preencha todos os campos de contacto.')
        return
      }
      setStep(2) // Vai para o passo do arquivo
      return
    }

    // Validação do Passo 2 (Arquivo)
    if (step === 2 && !fileInputRef.current?.files?.[0]) {
        setError('Por favor, anexe o comprovativo de pagamento.')
        return
    }

    // Se chegou aqui, estamos no passo 2 e prontos para enviar tudo
    setLoading(true)
    
    const submitData = new FormData()
    submitData.append('name', formDataState.name)
    submitData.append('email', formDataState.email)
    submitData.append('phone', formDataState.phone)
    
    if (fileInputRef.current?.files?.[0]) {
      submitData.append('paymentProof', fileInputRef.current.files[0])
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        // Nota: Não defina Content-Type header aqui, o navegador define automaticamente para multipart/form-data com o boundary correto
        body: submitData,
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Erro ao processar inscrição.')

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  // --- UI Dos Passos ---

  const renderStep1 = () => (
    <div className="space-y-4 animate-fadeIn">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
        <input 
          name="name" type="text" value={formDataState.name} onChange={handleInputChange}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Ex: João Manuel" required 
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">E-mail Profissional</label>
        <input 
          name="email" type="email" value={formDataState.email} onChange={handleInputChange}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Ex: joao@email.com" required 
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
        <input 
          name="phone" type="tel" value={formDataState.phone} onChange={handleInputChange}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Ex: 923 000 000" required 
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeIn">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>Realize o pagamento para o IBAN <strong>AO06.0000.0000.0000.0000.0</strong> (Banco BIC) e anexe o comprovativo abaixo para garantir sua vaga imediata.</p>
        </div>
        
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-white rounded-xl p-8 text-center cursor-pointer transition group"
      >
        <input ref={fileInputRef} type="file" accept="image/png, image/jpeg, application/pdf" className="hidden" onChange={handleFileChange} />
        
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
            <UploadCloud className="w-8 h-8 text-blue-600" />
        </div>
        {fileName ? (
             <p className="text-blue-700 font-medium truncate px-4">{fileName}</p>
        ) : (
            <>
            <p className="text-slate-700 font-medium mb-1">Clique para fazer upload do comprovativo</p>
            <p className="text-slate-400 text-sm">PNG, JPG ou PDF (Max. 5MB)</p>
            </>
        )}
      </div>
    </div>
  )

  const renderSuccess = () => (
     <div className="text-center py-8 animate-fadeIn">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-4">Inscrição Recebida!</h3>
        <p className="text-slate-600 mb-6">
            Seus dados e comprovativo foram enviados com sucesso. Nossa equipe validará sua inscrição e entrará em contacto em breve para confirmar sua matrícula.
        </p>
        {/* O botão fechar chama o onClose, que muda o isOpen para false, disparando o useEffect de reset */}
        <button onClick={onClose} className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-3 px-8 rounded-lg transition">
            Fechar
        </button>
     </div>
  )

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-blue-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
        
        {/* Header do Modal */}
        {!success && (
            <div className="px-8 pt-8 pb-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-800">
                        {step === 1 ? 'Garantir Minha Vaga' : 'Confirmar Pagamento'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition bg-slate-100 p-2 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {/* Progress Bar */}
                <div className="flex items-center gap-2 mb-4">
                    <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-orange-500' : 'bg-slate-200'}`}></div>
                    <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-orange-500' : 'bg-slate-200'}`}></div>
                </div>
            </div>
        )}

        <form onSubmit={handleSubmit} className="px-8 pb-8">
          
          {success ? renderSuccess() : (
             <>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded flex items-center gap-3 animate-shake">
                    <AlertCircle className="w-5 h-5 shrink-0"/> {error}
                  </div>
                )}

                <div className="mb-8">
                    {step === 1 ? renderStep1() : renderStep2()}
                </div>

                <div className="flex gap-3">
                    {step === 2 && (
                        <button type="button" onClick={() => setStep(1)} disabled={loading} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition text-sm">
                            Voltar
                        </button>
                    )}
                    <button 
                        type="submit"
                        disabled={loading}
                        className="flex-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <>
                             {step === 1 ? 'Continuar para Pagamento' : 'Finalizar Inscrição'}
                             <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                    </button>
                </div>
             </>
          )}
        </form>
      </div>
    </div>
  )
}