'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, ArrowRight, Loader2, AlertCircle, CreditCard, Landmark, Copy, Check } from 'lucide-react'

// Interface completa baseada no modelo Batch da BD
interface Batch {
  id: string
  name: string
  order: number
  price: number
  discount: number
  installmentPrice: number  // Já vem da BD, não precisa calcular
  slots: number
  isActive: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  selectedBatch?: Batch | null
}

type PaymentMethod = 'GPO' | 'REF'
type PaymentType = 'FULL' | 'INSTALLMENT'
type Step = 1 | 2 | 'success_gpo' | 'success_ref'

interface RefData {
  entity: string
  reference: string
  expiry: string
  amount: number
}

export default function RegistrationModal({ isOpen, onClose, selectedBatch }: RegistrationModalProps) {
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [method, setMethod] = useState<PaymentMethod>('GPO')
  const [paymentType, setPaymentType] = useState<PaymentType>('FULL')
  const [copied, setCopied] = useState<string | null>(null)
  const [refData, setRefData] = useState<RefData | null>(null)
  const [txId, setTxId] = useState<string | null>(null)
  const [refPaid, setRefPaid] = useState(false)

  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [phoneNumber, setPhoneNumber] = useState('')

  // Polling: verificar se REF foi paga a cada 10s
  useEffect(() => {
    if (step !== 'success_ref' || !txId || refPaid) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/status?txId=${txId}`)
        const data = await res.json()
        if (data.status === 'paid') {
          setRefPaid(true)
          clearInterval(interval)
        }
      } catch {
        // silently ignore polling errors
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [step, txId, refPaid])

  // --- Lógica de Preços ---
  // Usa o price e discount do Batch para calcular o valor com desconto
  const fullPrice = selectedBatch
    ? Math.round(selectedBatch.price * (1 - selectedBatch.discount / 100))
    : 0
  
  // Usa o installmentPrice vindo diretamente da BD (já está pré-calculado)
  // IMPORTANTE: O installmentPrice já deve vir da BD com o valor correto da parcela
  const installmentPriceFromDb = selectedBatch?.installmentPrice || Math.round(fullPrice / 2)
  
  // Valor que será enviado para a API
  const finalAmount = paymentType === 'FULL' ? fullPrice : installmentPriceFromDb

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-AO').format(value) + ' Kz'

  // Informações adicionais do batch para exibição
  const slotsAvailable = selectedBatch?.slots 
    ? `Vagas: ${selectedBatch.slots}` 
    : 'Vagas limitadas'
  
  const isFeatured = selectedBatch?.isFeatured || false
  const batchStatus = selectedBatch?.isActive ? 'Ativo' : 'Encerrado'

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStep(1)
        setError('')
        setLoading(false)
        setMethod('GPO')
        setPaymentType('FULL')
        setRefData(null)
        setTxId(null)
        setRefPaid(false)
        setPhoneNumber('')
        setFormData({ name: '', email: '', phone: '' })
        setCopied(null)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Por favor, preencha todos os campos.')
      return
    }
    setLoading(true)
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('email', formData.email)
      data.append('phone', formData.phone)
      const res = await fetch('/api/leads', { method: 'POST', body: data })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Erro ao registar contacto.')
      setStep(2)
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao registar contacto.')
    } finally {
      setLoading(false)
    }
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (method === 'GPO' && !phoneNumber) {
      setError('Introduza o número Multicaixa Express para pagar via GPO.')
      return
    }
    if (!selectedBatch) {
      setError('Nenhum lote seleccionado.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/payments/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId: selectedBatch.id,
          batchName: `${selectedBatch.name} - ${paymentType === 'FULL' ? 'Pagamento Total' : '1ª Prestação (50%)'}`,
          amount: finalAmount,
          method,
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          ...(method === 'GPO' && { phoneNumber }),
        }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.error || 'Pagamento falhado. Tente novamente.')
        return
      }

      if (method === 'GPO') {
        setStep('success_gpo')
      } else {
        setRefData({
          entity: data.referenceEntity,
          reference: data.referenceNumber,
          expiry: data.referenceExpiry,
          amount: finalAmount,
        })
        setTxId(data.merchantTransactionId || null)
        setRefPaid(false)
        setStep('success_ref')
      }
    } catch {
      setError('Erro de ligação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const isSuccess = step === 'success_gpo' || step === 'success_ref'

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-blue-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden my-4">

        {/* Header */}
        {!isSuccess && (
          <div className="px-8 pt-8 pb-4">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-slate-800">
                {step === 1 ? 'Dados de Contacto' : 'Pagamento da Inscrição'}
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition bg-slate-100 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-orange-500" />
              <div className={`h-1.5 flex-1 rounded-full transition-all ${step === 2 ? 'bg-orange-500' : 'bg-slate-200'}`} />
            </div>
          </div>
        )}

        {isSuccess && (
          <div className="flex justify-end px-6 pt-6">
            <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition bg-slate-100 p-2 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="px-8 pb-8">
            {error && <ErrorBox message={error} />}
            <div className="space-y-4 mb-8">
              <Field label="Nome Completo">
                <input name="name" type="text" value={formData.name} onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                  placeholder="Ex: João Manuel" />
              </Field>
              <Field label="E-mail">
                <input name="email" type="email" value={formData.email} onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                  placeholder="Ex: joao@email.com" />
              </Field>
              <Field label="Telefone / WhatsApp">
                <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                  placeholder="Ex: 923 000 000" />
              </Field>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition flex justify-center items-center gap-2 disabled:opacity-70 text-lg">
              {loading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <><span>Continuar para Pagamento</span><ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handlePayment} className="px-8 pb-8">
            {error && <ErrorBox message={error} />}

            {selectedBatch && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-0.5">Lote seleccionado</p>
                    <p className="font-bold text-slate-800">{selectedBatch.name}</p>
                    {isFeatured && (
                      <span className="inline-block mt-1 text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                        Destaque
                      </span>
                    )}
                    <p className="text-[10px] text-slate-500 mt-1">
                      {slotsAvailable} • {batchStatus}
                    </p>
                  </div>
                  <p className="text-2xl font-extrabold text-orange-500">{formatCurrency(finalAmount)}</p>
                </div>

                {/* --- SELECÇÃO DE PARCELAMENTO --- */}
                <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Opção de Investimento</p>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button" 
                    onClick={() => setPaymentType('FULL')}
                    className={`py-2.5 px-3 rounded-lg border text-[11px] font-bold transition ${
                      paymentType === 'FULL' 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                    }`}
                  >
                    Total à Vista
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPaymentType('INSTALLMENT')}
                    className={`py-2.5 px-3 rounded-lg border text-[11px] font-bold transition ${
                      paymentType === 'INSTALLMENT' 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                    }`}
                  >
                    Parcelado (2x {formatCurrency(installmentPriceFromDb)})
                  </button>
                </div>
                {paymentType === 'INSTALLMENT' && (
                  <p className="text-[10px] text-blue-600 mt-2 font-medium italic">
                    * Pague a 1ª prestação hoje para garantir a vaga. A 2ª será paga no início do curso.
                  </p>
                )}
              </div>
            )}

            <p className="text-sm font-semibold text-slate-600 mb-3">Método de pagamento</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {(['GPO', 'REF'] as PaymentMethod[]).map((m) => (
                <button key={m} type="button" onClick={() => setMethod(m)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 font-semibold text-sm transition ${
                    method === m
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}>
                  {m === 'GPO' ? <CreditCard className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
                  {m === 'GPO' ? 'MCX Express' : 'Referência'}
                </button>
              ))}
            </div>

            {method === 'GPO' && (
              <div className="mb-6">
                <Field label="Número Multicaixa Express">
                  <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                    placeholder="Ex: 923 000 000" />
                </Field>
                <p className="text-[11px] text-slate-400 mt-2 ml-1">
                  Confirme o pagamento na aplicação Multicaixa Express após clicar abaixo.
                </p>
              </div>
            )}

            {method === 'REF' && (
              <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3 mb-6 border border-slate-100 leading-relaxed">
                Ao clicar em `&quot;Gerar Referência`&quot;, receberá os dados bancários para pagar via ATM ou Homebanking.
              </p>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => { setStep(1); setError('') }}
                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition text-sm">
                Voltar
              </button>
              <button type="submit" disabled={loading || !selectedBatch}
                className="flex-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition flex justify-center items-center gap-2 disabled:opacity-70 text-base">
                {loading
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : <><span>{method === 'GPO' ? 'Pagar Agora' : 'Gerar Referência'}</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </form>
        )}

        {/* SUCCESS GPO */}
        {step === 'success_gpo' && (
          <div className="px-8 pb-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Solicitação Enviada!</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Verifique o seu telemóvel e autorize o pagamento na aplicação Multicaixa Express.<br />
              Assim que confirmar, a sua vaga estará garantida.
            </p>
            <button onClick={onClose} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-10 rounded-full transition">
              Concluir
            </button>
          </div>
        )}

        {/* SUCCESS REF */}
        {step === 'success_ref' && (
          <div className="px-8 pb-8">
            {refPaid ? (
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Pagamento Confirmado!</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  A referência bancária foi paga com sucesso.<br />
                  A nossa equipa irá contactá-lo em breve para confirmar a matrícula.
                </p>
                <button onClick={onClose} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-10 rounded-full transition">
                  Concluir
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Landmark className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Referência Gerada</h3>
                  <p className="text-slate-500 text-sm">Pague agora para garantir o seu lugar no curso.</p>
                </div>

                {refData && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-100 mb-4">
                    {[
                      { label: 'Entidade', value: refData.entity, key: 'entity' },
                      { label: 'Referência', value: refData.reference, key: 'ref' },
                      { label: 'Valor', value: formatCurrency(refData.amount), key: 'amount' },
                      { label: 'Validade', value: new Date(refData.expiry).toLocaleDateString('pt-AO'), key: 'expiry' },
                    ].map(({ label, value, key }) => (
                      <div key={key} className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm text-slate-500">{label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-sm">{value}</span>
                          {(key === 'entity' || key === 'ref') && (
                            <button type="button" onClick={() => copyToClipboard(value, key)}
                              className="text-slate-400 hover:text-orange-500 transition">
                              {copied === key ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  A aguardar confirmação de pagamento…
                </div>

                <p className="text-xs text-slate-400 text-center mb-4">Os dados foram enviados para o seu e-mail.</p>
                <button onClick={onClose} className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition">
                  Fechar
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  )
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded flex items-center gap-3">
      <AlertCircle className="w-5 h-5 shrink-0" /> {message}
    </div>
  )
}