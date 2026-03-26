import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWebhookPaidEmail } from '@/lib/brevo'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('AppyPay Webhook Payload:', JSON.stringify(body, null, 2))

    // A AppyPay pode enviar campos com iniciais maiúsculas ou minúsculas
    const merchantTransactionId = body.merchantTransactionId || body.MerchantTransactionId
    const status = body.status || body.Status
    const appyId = body.id || body.Id

    if (!merchantTransactionId) {
      return NextResponse.json({ error: 'ID da transação não encontrado' }, { status: 400 })
    }

    const payment = await prisma.payment.findUnique({
      where: { merchantTransactionId },
    })

    if (!payment) {
      console.error('Webhook: Pagamento não existe no banco:', merchantTransactionId)
      return NextResponse.json({ received: true }) 
    }

    if (payment.status === 'paid') {
      return NextResponse.json({ message: 'Já processado' })
    }

    // LISTA DE STATUS POSITIVOS DA APPYPAY
    const positiveStatus = ['paid', 'Paid', 'PAID', 'success', 'Success', 'SUCCESS', 'completed']
    const isPaid = positiveStatus.includes(status)

    if (isPaid) {
      // 1. Atualiza o Pagamento
      await prisma.payment.update({
        where: { merchantTransactionId },
        data: { 
          status: 'paid', 
          paidAt: new Date(),
          // Opcional: guardar o ID da AppyPay que veio no webhook se for diferente
        },
      })

      // 2. Atualiza o Lead
      await prisma.lead.update({
        where: { email: payment.email },
        data: { status: 'MATRICULADO' },
      })

      // 3. Notificação (Brevo)
      const brevoApiKey = process.env.BREVO_API_KEY
      if (brevoApiKey) {
        sendWebhookPaidEmail(brevoApiKey, {
          notifyEmail: process.env.NOTIFY_EMAIL || 'geral@inefor.ao',
          companyName: process.env.PAYMENT_COMPANY_NAME || 'INEFOR',
          fullName: payment.fullName,
          email: payment.email,
          courseName: payment.batchName,
          amount: payment.amount,
        }).catch(e => console.error('Brevo Webhook Email Error:', e))
      }

      console.log(`✅ Pagamento ${merchantTransactionId} validado com sucesso via Webhook.`)
    } else {
      console.log(`⚠️ Webhook recebido para ${merchantTransactionId} com status: ${status}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook Critical Error:', error)
    return NextResponse.json({ error: 'Erro interno no Webhook' }, { status: 500 })
  }
}