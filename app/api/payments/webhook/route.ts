import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWebhookPaidEmail } from '@/lib/brevo'

const COMPANY_NAME = process.env.PAYMENT_COMPANY_NAME || 'INEFOR'
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'geral@inefor.ao'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('AppyPay webhook received:', JSON.stringify(body, null, 2))

    const merchantTransactionId =
      body.merchantTransactionId || body.MerchantTransactionId
    const status = body.status || body.Status

    if (!merchantTransactionId) {
      return NextResponse.json({ error: 'Missing merchantTransactionId' }, { status: 400 })
    }

    const payment = await prisma.payment.findUnique({
      where: { merchantTransactionId },
    })

    if (!payment) {
      console.warn('Webhook: payment not found for', merchantTransactionId)
      return NextResponse.json({ received: true })
    }

    // Já pago — ignorar duplicados
    if (payment.status === 'paid') {
      return NextResponse.json({ received: true })
    }

    const isPaid =
      status === 'paid' ||
      status === 'Paid' ||
      status === 'Success' ||
      status === 'PAID'

    if (isPaid) {
      // Actualizar pagamento
      await prisma.payment.update({
        where: { merchantTransactionId },
        data: { status: 'paid', paidAt: new Date() },
      })

      // Actualizar lead para MATRICULADO
      await prisma.lead.updateMany({
        where: { email: payment.email },
        data: { status: 'MATRICULADO' },
      })

      // Notificação interna
      const brevoApiKey = process.env.BREVO_API_KEY
      if (brevoApiKey) {
        await sendWebhookPaidEmail(brevoApiKey, {
          notifyEmail: NOTIFY_EMAIL,
          companyName: COMPANY_NAME,
          fullName: payment.fullName,
          email: payment.email,
          courseName: payment.batchName,
          amount: payment.amount,
        }).catch((e) => console.error('Brevo webhook email error:', e))
      }
    } else {
      await prisma.payment.update({
        where: { merchantTransactionId },
        data: { status: 'failed' },
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
