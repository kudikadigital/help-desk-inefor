import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  buildConfig,
  createCharge,
  getMethodId,
  generateMerchantTransactionId,
  type PaymentMethod,
} from '@/lib/appypay'
import {
  sendPaymentConfirmationEmail,
} from '@/lib/brevo'

const COMPANY_NAME = process.env.PAYMENT_COMPANY_NAME || 'INEFOR'
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'geral@inefor.ao'
const COURSE_NAME = 'Help Desk - Formacao Pratica'

interface ChargeRequest {
  batchId: string
  batchName: string
  amount: number
  method: PaymentMethod
  fullName: string
  email: string
  phone: string
  phoneNumber?: string // telefone para o GPO
}

interface AppyPayPayload {
  merchantTransactionId: string
  amount: number
  currency: string
  paymentMethod: string
  customerName: string
  customerEmail: string
  customerPhone: string
  description: string
  paymentInfo?: { phoneNumber: string }
}

export async function POST(request: NextRequest) {
  try {
    const body: ChargeRequest = await request.json()
    const { batchId, batchName, amount, method, fullName, email, phone, phoneNumber } = body
    
    // 1. Validação básica
    if (!batchId || !batchName || !amount || !method || !fullName || !email || !phone) {
      return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 })
    }

    // 2. Tratamento do Telefone GPO
    let formattedGpoPhone = ''
    if (method === 'GPO') {
      if (!phoneNumber) {
        return NextResponse.json(
          { error: 'Número Multicaixa Express obrigatório para pagamento GPO.' },
          { status: 400 }
        )
      }
      // Garante o prefixo 244 e remove espaços
      formattedGpoPhone = phoneNumber.replace(/\s+/g, '')
      if (formattedGpoPhone.startsWith('+244')) {
        formattedGpoPhone = formattedGpoPhone.substring(1)
      } else if (!formattedGpoPhone.startsWith('244')) {
        formattedGpoPhone = `244${formattedGpoPhone}`
      }
    }

    const config = buildConfig()
    const merchantTransactionId = generateMerchantTransactionId()
    const methodId = getMethodId(config, method)

    // 3. Preparar Payload conforme a API espera (Estrutura do sistema funcional)
    const payload: AppyPayPayload = {
      merchantTransactionId,
      amount,
      currency: 'AOA',
      paymentMethod: methodId,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      description: `${COURSE_NAME} - ${batchName}`,
    }

    // A CHAVE DO ERRO: Para GPO, o phoneNumber deve estar dentro de paymentInfo
    if (method === 'GPO') {
      payload.paymentInfo = { phoneNumber: formattedGpoPhone }
    }

    // 4. Chamar AppyPay
    const appypayResponse = await createCharge(config, payload)

    console.log('AppyPay response:', JSON.stringify(appypayResponse, null, 2))

    const { responseStatus } = appypayResponse
    const isGPO = method === 'GPO'

    // 5. Determinar status
    let status: 'pending' | 'paid' | 'failed' = 'pending'
    if (isGPO) {
      status = responseStatus.successful && responseStatus.status === 'Success' ? 'paid' : 'failed'
    }

    // 6. Persistir no Banco
    await prisma.payment.create({
      data: {
        batchId,
        batchName,
        amount,
        currency: 'AOA',
        paymentMethod: method,
        appypayChargeId: appypayResponse.id,
        merchantTransactionId,
        status,
        phoneNumber: isGPO ? formattedGpoPhone : phone,
        referenceNumber: responseStatus.reference?.referenceNumber,
        referenceEntity: responseStatus.reference?.entity,
        fullName,
        email,
        phone,
        expiresAt: responseStatus.reference?.dueDate
          ? new Date(responseStatus.reference.dueDate)
          : null,
        paidAt: status === 'paid' ? new Date() : null,
      },
    })

    // 7. Atualizar Lead
    await prisma.lead.upsert({
      where: { email },
      update: {
        name: fullName,
        phone,
        status: status === 'paid' ? 'MATRICULADO' : 'AGUARDANDO_VALIDACAO',
      },
      create: {
        name: fullName,
        email,
        phone,
        status: status === 'paid' ? 'MATRICULADO' : 'AGUARDANDO_VALIDACAO',
      },
    })

    // Se GPO falhou
    if (isGPO && status === 'failed') {
      return NextResponse.json({
        success: false,
        method,
        error: responseStatus.message || 'Pagamento recusado. Verifique a sua aplicação Express.',
      })
    }

    // 8. E-mail de confirmação
    const brevoApiKey = process.env.BREVO_API_KEY
    if (brevoApiKey) {
      sendPaymentConfirmationEmail(brevoApiKey, {
        email,
        fullName,
        courseName: `${COURSE_NAME} - ${batchName}`,
        amount,
        method,
        referenceNumber: responseStatus.reference?.referenceNumber,
        referenceEntity: responseStatus.reference?.entity,
        referenceExpiry: responseStatus.reference?.dueDate,
        companyName: COMPANY_NAME,
        notifyEmail: NOTIFY_EMAIL,
      }).catch((e) => console.error('Brevo email error:', e))
    }

    return NextResponse.json({
      success: true,
      method,
      ...(isGPO && { gpoStatus: 'paid' }),
      ...(!isGPO && {
        referenceNumber: responseStatus.reference?.referenceNumber,
        referenceEntity: responseStatus.reference?.entity,
        referenceExpiry: responseStatus.reference?.dueDate,
      }),
    })
  } catch (error) {
    console.error('Payment charge error:', error)
    return NextResponse.json({ error: 'Erro interno ao processar pagamento.' }, { status: 500 })
  }
}